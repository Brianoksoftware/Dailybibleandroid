import {
  BIBLE_BOOKS,
  VERSE_CATALOG,
  decodeVerseId,
  encodeVerseId,
  findBook,
  formatReference,
  getCatalogVerse,
  getDailyCatalogVerse,
  parseReference,
  shuffleVerses,
  verseSourceUrl,
} from '../data/verses';
import { SearchParams, Verse, VerseContextLine, VerseSearchResult } from '../types/Verse';

const BIBLE_API = 'https://bible-api.com';
const BOLLS = 'https://bolls.life';

type BibleApiVerse = {
  book?: string;
  book_name?: string;
  chapter?: number;
  verse?: number;
  text?: string;
};

type BibleApiResponse = {
  reference?: string;
  text?: string;
  translation_id?: string;
  verses?: BibleApiVerse[];
};

type BollsHit = {
  book?: number;
  chapter?: number;
  verse?: number;
  text?: string;
};

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim();

const uniqueById = (verses: VerseSearchResult[]) => {
  const seen = new Set<number>();
  return verses.filter((verse) => {
    if (!verse.id || seen.has(verse.id)) return false;
    seen.add(verse.id);
    return true;
  });
};

const fromParts = (
  bookName: string,
  chapter: number,
  verse: number,
  text: string,
  verseEnd?: number,
  topics: string[] = []
): VerseSearchResult | null => {
  const book = findBook(bookName);
  if (!book || !chapter || !verse || !text) return null;
  const reference = formatReference(book.name, chapter, verse, verseEnd);
  return {
    id: encodeVerseId(book.id, chapter, verse),
    reference,
    book: book.name,
    chapter,
    verse,
    verseEnd,
    text: cleanText(text),
    topics,
    testament: book.testament,
    translation: 'KJV',
    sourceUrl: verseSourceUrl(reference),
  };
};

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Bible request failed (${response.status})`);
  }
  return response.json();
};

const fromApiResponse = (data: BibleApiResponse): VerseSearchResult | null => {
  const verses = Array.isArray(data.verses) ? data.verses : [];
  const first = verses[0];
  const last = verses[verses.length - 1];
  const bookName = first?.book_name || '';
  const chapter = first?.chapter || 0;
  const verse = first?.verse || 0;
  const verseEnd = last && last.verse !== verse ? last.verse : undefined;
  const text = verses.map((item) => item.text || '').join(' ') || data.text || '';
  return fromParts(bookName, chapter, verse, text, verseEnd);
};

const fetchReference = async (reference: string): Promise<VerseSearchResult | null> => {
  const data = (await fetchJson(
    `${BIBLE_API}/${encodeURIComponent(reference)}?translation=kjv`
  )) as BibleApiResponse;
  return fromApiResponse(data);
};

const fetchContext = async (verse: VerseSearchResult): Promise<VerseContextLine[]> => {
  const start = Math.max(1, verse.verse - 2);
  const end = (verse.verseEnd || verse.verse) + 2;
  const reference = `${verse.book} ${verse.chapter}:${start}-${end}`;
  try {
    const data = (await fetchJson(
      `${BIBLE_API}/${encodeURIComponent(reference)}?translation=kjv`
    )) as BibleApiResponse;
    return (data.verses || [])
      .filter((item) => item.verse && item.text)
      .map((item) => ({
        verse: item.verse as number,
        text: cleanText(item.text || ''),
      }));
  } catch {
    return [{ verse: verse.verse, text: verse.text }];
  }
};

const searchBolls = async (query: string): Promise<VerseSearchResult[]> => {
  const data = (await fetchJson(
    `${BOLLS}/v2/find/KJV?search=${encodeURIComponent(query)}&match_case=false&match_whole=false`
  )) as BollsHit[] | { results?: BollsHit[] };
  const hits = Array.isArray(data) ? data : data.results || [];
  return hits
    .slice(0, 30)
    .map((hit) => {
      const book = BIBLE_BOOKS.find((item) => item.id === hit.book);
      if (!book || !hit.chapter || !hit.verse || !hit.text) return null;
      return fromParts(book.name, hit.chapter, hit.verse, hit.text.replace(/<[^>]*>/g, ''));
    })
    .filter((verse): verse is VerseSearchResult => verse !== null);
};

const fetchRandomVerse = async (): Promise<VerseSearchResult | null> => {
  try {
    const data = (await fetchJson(`${BIBLE_API}/data/kjv/random`)) as BibleApiResponse & {
      random_verse?: BibleApiVerse;
    };
    if (data.random_verse) {
      const item = data.random_verse;
      return fromParts(item.book_name || item.book || '', item.chapter || 0, item.verse || 0, item.text || '');
    }
    return fromApiResponse(data);
  } catch {
    return null;
  }
};

const hydrateFromApi = async (verse: VerseSearchResult): Promise<VerseSearchResult> => {
  try {
    const remote = await fetchReference(verse.reference);
    if (!remote) return verse;
    return {
      ...verse,
      text: remote.text,
      translation: remote.translation,
    };
  } catch {
    return verse;
  }
};

const matchesFilters = (verse: VerseSearchResult, params: SearchParams) => {
  if (params.book && verse.book !== params.book) return false;
  if (params.topic && !verse.topics.includes(params.topic)) return false;
  if (params.testament && verse.testament !== params.testament) return false;
  if (params.query?.trim()) {
    const needle = params.query.trim().toLowerCase();
    const haystack = `${verse.reference} ${verse.text} ${verse.topics.join(' ')}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
};

export class VerseService {
  static async getDailyVerse(): Promise<VerseSearchResult> {
    const daily = getDailyCatalogVerse();
    return hydrateFromApi(daily);
  }

  static async getSuggestedVerses(
    number: number = 8,
    excludeId?: number
  ): Promise<VerseSearchResult[]> {
    const local = shuffleVerses(VERSE_CATALOG.filter((verse) => verse.id !== excludeId)).slice(
      0,
      number
    );

    try {
      const remote = (
        await Promise.all(Array.from({ length: Math.min(4, number) }, () => fetchRandomVerse()))
      ).filter((verse): verse is VerseSearchResult => Boolean(verse && verse.id !== excludeId));
      return uniqueById([...remote, ...local]).slice(0, number);
    } catch {
      return local;
    }
  }

  static async searchVerses(params: SearchParams): Promise<VerseSearchResult[]> {
    const limit = params.number || 20;
    const query = params.query?.trim() || '';
    const parsed = query ? parseReference(query) : null;
    const lists: VerseSearchResult[][] = [];

    if (parsed) {
      try {
        const remote = await fetchReference(
          formatReference(parsed.book.name, parsed.chapter, parsed.verse, parsed.verseEnd)
        );
        if (remote) lists.push([remote]);
      } catch {
        // Local catalog can still match the typed reference.
      }
    }

    const catalogMatches = VERSE_CATALOG.filter((verse) => matchesFilters(verse, params));
    if (catalogMatches.length > 0) {
      lists.push(catalogMatches);
    }

    if (query && !parsed) {
      try {
        const remote = await searchBolls(query);
        const filtered = remote.filter((verse) =>
          matchesFilters(verse, { ...params, query: undefined })
        );
        if (filtered.length > 0) lists.push(filtered);
      } catch {
        // Catalog results are enough if the live search is unavailable.
      }
    }

    if (lists.length === 0) {
      return [];
    }

    return uniqueById(lists.flat()).slice(0, limit);
  }

  static async getVerseById(id: number): Promise<Verse> {
    const local = getCatalogVerse(id);
    const decoded = decodeVerseId(id);
    const book = BIBLE_BOOKS.find((item) => item.id === decoded.bookId);
    const fallback = local || (book ? fromParts(book.name, decoded.chapter, decoded.verse, '') : null);

    if (!fallback && !book) {
      throw new Error('Verse not found');
    }

    const reference = fallback?.reference || formatReference(book!.name, decoded.chapter, decoded.verse);
    let verse = fallback;

    try {
      const remote = await fetchReference(reference);
      if (remote) {
        verse = {
          ...remote,
          topics: fallback?.topics || remote.topics,
        };
      }
    } catch {
      if (!verse) {
        throw new Error('Could not load this verse. Check your connection and try again.');
      }
    }

    if (!verse) {
      throw new Error('Verse not found');
    }

    const context = await fetchContext(verse);
    return { ...verse, context };
  }

  static getRelatedVerses(verse: VerseSearchResult, limit = 4): VerseSearchResult[] {
    const topic = verse.topics[0];
    return VERSE_CATALOG.filter((item) => item.id !== verse.id && (!topic || item.topics.includes(topic)))
      .slice(0, limit);
  }
}
