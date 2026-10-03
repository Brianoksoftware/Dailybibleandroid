import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { isExpoGo } from '../iap/env';
import { usePro } from '../pro/ProContext';
import { useTheme } from '../theme/ThemeContext';
import { useAds } from './AdsContext';
import { PRODUCTION_BANNER_UNIT_ID, shouldUseTestAds } from './config';

/**
 * Anchored banner for free users. Hidden for Pro, Expo Go, and failed loads.
 * Safe placement: bottom of Home/Search only — never over verse reading content.
 */
export default function BannerAdSlot() {
  const { isPro } = usePro();
  const { ready, canRequestAds } = useAds();
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);

  const unitId = useMemo(() => {
    if (isExpoGo || Platform.OS !== 'android') return null;
    try {
      const { TestIds } = require('react-native-google-mobile-ads') as typeof import('react-native-google-mobile-ads');
      return shouldUseTestAds() ? TestIds.BANNER : PRODUCTION_BANNER_UNIT_ID.trim();
    } catch {
      return null;
    }
  }, []);

  if (isPro || !ready || !canRequestAds || !unitId || failed) {
    return null;
  }

  let BannerAd: typeof import('react-native-google-mobile-ads').BannerAd;
  let BannerAdSize: typeof import('react-native-google-mobile-ads').BannerAdSize;
  try {
    const ads = require('react-native-google-mobile-ads') as typeof import('react-native-google-mobile-ads');
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch {
    return null;
  }

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdFailedToLoad={(error) => {
          console.warn('Banner failed to load:', error);
          setFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 50,
  },
});
