import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getStorePriceLabel,
  purchaseProFromStore,
  PurchaseResult,
  restoreProFromStore,
  syncProFromStore,
} from '../iap/store';
import { isExpoGo } from '../iap/env';
import { isProUnlocked, PRO_PRICE_LABEL } from '../storage/pro';

type ProContextValue = {
  isPro: boolean;
  ready: boolean;
  isExpoGo: boolean;
  priceLabel: string;
  refreshPro: () => Promise<void>;
  unlockPro: () => Promise<PurchaseResult>;
  restorePro: () => Promise<PurchaseResult>;
};

const ProContext = createContext<ProContextValue>({
  isPro: false,
  ready: false,
  isExpoGo: false,
  priceLabel: PRO_PRICE_LABEL,
  refreshPro: async () => {},
  unlockPro: async () => 'failed',
  restorePro: async () => 'failed',
});

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);
  const [priceLabel, setPriceLabel] = useState(PRO_PRICE_LABEL);

  const refreshPro = async () => {
    const local = await isProUnlocked();
    const fromStore = local ? false : await syncProFromStore();
    setIsPro(local || fromStore);
    setReady(true);
  };

  useEffect(() => {
    refreshPro();
    getStorePriceLabel().then(setPriceLabel);
  }, []);

  const unlockPro = async () => {
    const result = await purchaseProFromStore();
    if (result === 'success') {
      setIsPro(true);
    }
    return result;
  };

  const restorePro = async () => {
    const result = await restoreProFromStore();
    if (result === 'success') {
      setIsPro(true);
    }
    return result;
  };

  return (
    <ProContext.Provider
      value={{ isPro, ready, isExpoGo, priceLabel, refreshPro, unlockPro, restorePro }}
    >
      {children}
    </ProContext.Provider>
  );
}

export const usePro = () => useContext(ProContext);
