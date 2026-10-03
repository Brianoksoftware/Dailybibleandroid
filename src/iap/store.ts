import { PRO_PRICE_LABEL, setProUnlocked } from '../storage/pro';
import { isExpoGo } from './env';

export const PRO_PRODUCT_ID = 'dailybible_pro';

export type PurchaseResult = 'success' | 'cancelled' | 'failed' | 'unavailable';

type ExpoIap = typeof import('expo-iap');

let iapModule: ExpoIap | null | undefined;
let connectionReady = false;

const getIap = (): ExpoIap | null => {
  if (isExpoGo) return null;
  if (iapModule !== undefined) return iapModule;
  try {
    iapModule = require('expo-iap') as ExpoIap;
    return iapModule;
  } catch (error) {
    console.warn('In-app purchases are not available:', error);
    iapModule = null;
    return null;
  }
};

const purchaseSku = (purchase: { id?: string; productId?: string }) =>
  purchase.productId || purchase.id || '';

const ownsPro = (purchase: { id?: string; productId?: string }) =>
  purchaseSku(purchase) === PRO_PRODUCT_ID;

const ensureConnection = async (iap: ExpoIap) => {
  if (connectionReady) return;
  await iap.initConnection();
  connectionReady = true;
};

export const canUsePlayBilling = () => getIap() !== null;

export const getStorePriceLabel = async (): Promise<string> => {
  const iap = getIap();
  if (!iap) return PRO_PRICE_LABEL;

  try {
    await ensureConnection(iap);
    const products = await iap.fetchProducts({
      skus: [PRO_PRODUCT_ID],
      type: 'in-app',
    });
    const list = Array.isArray(products) ? products : [];
    const match = list.find((product) => product.id === PRO_PRODUCT_ID) || list[0];
    return match?.displayPrice || PRO_PRICE_LABEL;
  } catch (error) {
    console.warn('Could not load store price:', error);
    return PRO_PRICE_LABEL;
  }
};

const grantProFromPurchases = async (iap: ExpoIap) => {
  const purchases = await iap.getAvailablePurchases();
  const owned = (purchases || []).filter(ownsPro);
  if (owned.length === 0) return false;

  await Promise.all(
    owned.map((purchase) =>
      iap.finishTransaction({ purchase, isConsumable: false }).catch(() => undefined)
    )
  );
  await setProUnlocked(true);
  return true;
};

export const syncProFromStore = async (): Promise<boolean> => {
  const iap = getIap();
  if (!iap) return false;

  try {
    await ensureConnection(iap);
    return grantProFromPurchases(iap);
  } catch (error) {
    console.warn('Could not sync Pro from the store:', error);
    return false;
  }
};

export const purchaseProFromStore = async (): Promise<PurchaseResult> => {
  const iap = getIap();
  if (!iap) {
    if (isExpoGo) {
      await setProUnlocked(true);
      return 'success';
    }
    return 'unavailable';
  }

  try {
    await ensureConnection(iap);
  } catch {
    return 'failed';
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: PurchaseResult) => {
      if (settled) return;
      settled = true;
      success.remove();
      error.remove();
      resolve(result);
    };

    const success = iap.purchaseUpdatedListener(async (purchase) => {
      if (!ownsPro(purchase)) return;
      try {
        await iap.finishTransaction({ purchase, isConsumable: false });
        await setProUnlocked(true);
        finish('success');
      } catch (err) {
        console.warn('Could not finish purchase:', err);
        finish('failed');
      }
    });

    const error = iap.purchaseErrorListener((err) => {
      if (iap.isUserCancelledError(err)) {
        finish('cancelled');
        return;
      }
      finish('failed');
    });

    iap
      .requestPurchase({
        request: {
          google: { skus: [PRO_PRODUCT_ID] },
        },
        type: 'in-app',
      })
      .catch((err) => {
        if (iap.isUserCancelledError(err)) {
          finish('cancelled');
          return;
        }
        finish('failed');
      });
  });
};

export const restoreProFromStore = async (): Promise<PurchaseResult> => {
  const iap = getIap();
  if (!iap) {
    if (isExpoGo) return 'unavailable';
    return 'unavailable';
  }

  try {
    await ensureConnection(iap);
    await iap.restorePurchases();
    const owned = await grantProFromPurchases(iap);
    return owned ? 'success' : 'failed';
  } catch (error) {
    console.warn('Restore failed:', error);
    return 'failed';
  }
};
