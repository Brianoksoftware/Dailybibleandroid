import React, { createContext, useContext, useEffect, useState } from 'react';
import { isExpoGo } from '../iap/env';

type AdsContextValue = {
  ready: boolean;
  canRequestAds: boolean;
};

const AdsContext = createContext<AdsContextValue>({
  ready: false,
  canRequestAds: false,
});

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [canRequestAds, setCanRequestAds] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (isExpoGo) {
        if (!cancelled) {
          setReady(true);
          setCanRequestAds(false);
        }
        return;
      }

      try {
        const { AdsConsent, MobileAds } = require('react-native-google-mobile-ads') as typeof import('react-native-google-mobile-ads');

        try {
          await AdsConsent.gatherConsent();
        } catch (error) {
          console.warn('Ad consent form skipped:', error);
        }

        await MobileAds().initialize();

        if (!cancelled) {
          setCanRequestAds(true);
          setReady(true);
        }
      } catch (error) {
        console.warn('AdMob unavailable in this build:', error);
        if (!cancelled) {
          setCanRequestAds(false);
          setReady(true);
        }
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdsContext.Provider value={{ ready, canRequestAds }}>{children}</AdsContext.Provider>
  );
}

export const useAds = () => useContext(AdsContext);
