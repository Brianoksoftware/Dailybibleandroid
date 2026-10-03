export const openRootScreen = (navigation: any, name: string, params?: object) => {
  let current = navigation;
  while (current) {
    const names = current.getState?.()?.routeNames;
    if (Array.isArray(names) && names.includes(name)) {
      current.navigate(name, params);
      return;
    }
    current = current.getParent?.();
  }
  navigation.navigate(name, params);
};
