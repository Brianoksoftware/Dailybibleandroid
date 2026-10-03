export const openPaywall = (navigation: any) => {
  let current = navigation;
  while (current) {
    const names = current.getState?.()?.routeNames;
    if (Array.isArray(names) && names.includes('Paywall')) {
      current.navigate('Paywall');
      return;
    }
    current = current.getParent?.();
  }
  navigation.navigate('Paywall');
};
