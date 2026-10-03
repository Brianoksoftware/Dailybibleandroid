import AsyncStorage from '@react-native-async-storage/async-storage';

const PRO_KEY = 'daily_bible_pro';

export const PRO_PRODUCT_ID = 'dailybible_pro';
export const PRO_PRICE_LABEL = '$3.99';

export const isProUnlocked = async (): Promise<boolean> => {
  try {
    return (await AsyncStorage.getItem(PRO_KEY)) === '1';
  } catch (error) {
    console.error('Failed to read Pro status:', error);
    return false;
  }
};

export const setProUnlocked = async (unlocked: boolean): Promise<void> => {
  try {
    if (unlocked) {
      await AsyncStorage.setItem(PRO_KEY, '1');
    } else {
      await AsyncStorage.removeItem(PRO_KEY);
    }
  } catch (error) {
    console.error('Failed to save Pro status:', error);
  }
};
