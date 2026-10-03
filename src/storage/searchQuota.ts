import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTA_KEY = 'daily_search_quota';
export const FREE_SEARCHES_PER_DAY = 3;

type StoredQuota = {
  date: string;
  count: number;
};

export type SearchQuota = {
  used: number;
  remaining: number;
  limit: number;
};

const todayKey = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const toQuota = (count: number): SearchQuota => ({
  used: count,
  remaining: Math.max(0, FREE_SEARCHES_PER_DAY - count),
  limit: FREE_SEARCHES_PER_DAY,
});

const loadToday = async (): Promise<StoredQuota> => {
  const today = todayKey();
  try {
    const stored = await AsyncStorage.getItem(QUOTA_KEY);
    const parsed: StoredQuota | null = stored ? JSON.parse(stored) : null;
    if (parsed?.date === today) {
      return { date: today, count: parsed.count || 0 };
    }
  } catch (error) {
    console.error('Failed to read search quota:', error);
  }
  return { date: today, count: 0 };
};

export const getSearchQuota = async (): Promise<SearchQuota> => {
  const { count } = await loadToday();
  return toQuota(count);
};

export const consumeSearch = async (): Promise<SearchQuota> => {
  const current = await loadToday();
  const next = {
    date: current.date,
    count: Math.min(FREE_SEARCHES_PER_DAY, current.count + 1),
  };

  try {
    await AsyncStorage.setItem(QUOTA_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Failed to save search quota:', error);
  }

  return toQuota(next.count);
};
