import { Platform, ViewStyle } from 'react-native';

/** Soft card elevation that works in light and dark. */
export const cardShadow = (isDark: boolean): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: '#0B1A16',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.4 : 0.07,
      shadowRadius: 16,
    },
    android: {
      elevation: isDark ? 2 : 3,
    },
    default: {},
  }) as ViewStyle;

/** Stronger lift for hero surfaces and primary buttons. */
export const heroShadow = (isDark: boolean): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: '#06231C',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: isDark ? 0.5 : 0.2,
      shadowRadius: 24,
    },
    android: {
      elevation: isDark ? 6 : 8,
    },
    default: {},
  }) as ViewStyle;
