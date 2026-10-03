export type Testament = 'Old' | 'New';

export interface VerseSearchResult {
  id: number;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
  text: string;
  topics: string[];
  testament: Testament;
  translation: string;
  sourceUrl: string;
}

export interface VerseContextLine {
  verse: number;
  text: string;
}

export interface Verse extends VerseSearchResult {
  context: VerseContextLine[];
}

export interface SearchParams {
  query?: string;
  book?: string;
  topic?: string;
  testament?: Testament;
  number?: number;
}
