import { Alert } from 'react-native';
import * as Network from 'expo-network';

export const isOnline = async (): Promise<boolean> => {
  try {
    const state = await Network.getNetworkStateAsync();
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  } catch {
    // If the check itself fails, assume online and let feature calls surface errors.
    return true;
  }
};

export const alertOffline = (feature: string) => {
  Alert.alert(
    'No internet connection',
    `${feature} needs an internet connection. Check your network and try again.`
  );
};

/** Returns true if online. If offline, shows an alert and returns false. */
export const ensureOnline = async (feature: string): Promise<boolean> => {
  const online = await isOnline();
  if (!online) {
    alertOffline(feature);
    return false;
  }
  return true;
};

/**
 * Soft offline notice for features that still work with limited local data.
 * Returns true if the user chooses to continue (or if online).
 */
export const confirmOfflineLimited = (feature: string): Promise<boolean> =>
  new Promise((resolve) => {
    Alert.alert(
      'You are offline',
      `${feature} will only use verses saved in the app. Live lookup needs internet.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continue', onPress: () => resolve(true) },
      ]
    );
  });
