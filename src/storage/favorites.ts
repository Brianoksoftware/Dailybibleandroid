import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerseSearchResult } from '../types/Verse';

const FAVORITES_KEY = 'favorite_verses';

type StoredFavorite = VerseSearchResult & { savedAt?: number };

const loadRaw = async (): Promise<StoredFavorite[]> => {
  const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

const newestFirst = (favorites: StoredFavorite[]): StoredFavorite[] =>
  favorites
    .map((favorite, index) => ({
      ...favorite,
      savedAt: favorite.savedAt ?? index,
    }))
    .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));

export const getFavorites = async (): Promise<VerseSearchResult[]> => {
  try {
    return newestFirst(await loadRaw());
  } catch (error) {
    console.error('Error getting saved verses:', error);
    return [];
  }
};

export const setFavorites = async (favorites: VerseSearchResult[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error setting saved verses:', error);
  }
};

export const isFavorite = async (verseId: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.id === verseId);
};

export const toggleFavorite = async (verse: VerseSearchResult): Promise<boolean> => {
  try {
    const favorites = await loadRaw();
    const existingIndex = favorites.findIndex((fav) => fav.id === verse.id);

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      await setFavorites(favorites);
      return false;
    }

    favorites.push({
      id: verse.id,
      reference: verse.reference,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      verseEnd: verse.verseEnd,
      text: verse.text,
      topics: verse.topics || [],
      testament: verse.testament,
      translation: verse.translation,
      sourceUrl: verse.sourceUrl,
      savedAt: Date.now(),
    });
    await setFavorites(favorites);
    return true;
  } catch (error) {
    console.error('Error toggling saved verse:', error);
    return false;
  }
};

export const removeFavorite = async (verseId: number): Promise<void> => {
  try {
    const favorites = await loadRaw();
    await setFavorites(favorites.filter((fav) => fav.id !== verseId));
  } catch (error) {
    console.error('Error removing saved verse:', error);
  }
};

export const getFavoriteIds = async (): Promise<number[]> => {
  try {
    const favorites = await getFavorites();
    return favorites.map((fav) => fav.id);
  } catch (error) {
    console.error('Error getting saved verse IDs:', error);
    return [];
  }
};
