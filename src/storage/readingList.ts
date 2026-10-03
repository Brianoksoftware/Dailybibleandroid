import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerseSearchResult } from '../types/Verse';

const LIST_KEY = 'reading_list';

export type ReadingItem = {
  id: string;
  verseId: number;
  reference: string;
  text: string;
  checked: boolean;
  addedAt: number;
};

const loadItems = async (): Promise<ReadingItem[]> => {
  try {
    const stored = await AsyncStorage.getItem(LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load reading list:', error);
    return [];
  }
};

const saveItems = async (items: ReadingItem[]): Promise<void> => {
  await AsyncStorage.setItem(LIST_KEY, JSON.stringify(items));
};

export const getReadingList = async (): Promise<ReadingItem[]> => {
  const items = await loadItems();
  return items.sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    return b.addedAt - a.addedAt;
  });
};

export const addVerseToReadingList = async (verse: VerseSearchResult): Promise<boolean> => {
  const items = await loadItems();
  if (items.some((item) => item.verseId === verse.id)) {
    return false;
  }

  items.push({
    id: `${verse.id}-${Date.now()}`,
    verseId: verse.id,
    reference: verse.reference,
    text: verse.text,
    checked: false,
    addedAt: Date.now(),
  });
  await saveItems(items);
  return true;
};

export const toggleReadingItem = async (itemId: string): Promise<ReadingItem[]> => {
  const items = await loadItems();
  const next = items.map((item) =>
    item.id === itemId ? { ...item, checked: !item.checked } : item
  );
  await saveItems(next);
  return getReadingList();
};

export const removeReadingItem = async (itemId: string): Promise<ReadingItem[]> => {
  const items = await loadItems();
  await saveItems(items.filter((item) => item.id !== itemId));
  return getReadingList();
};

export const clearCheckedItems = async (): Promise<ReadingItem[]> => {
  const items = await loadItems();
  await saveItems(items.filter((item) => !item.checked));
  return getReadingList();
};
