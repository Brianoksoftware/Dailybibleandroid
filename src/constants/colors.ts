// Shared color tokens for Daily Bible
export const COLORS = {
  // Primary colors
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#EC4899', // Pink
  secondaryLight: '#F472B6',
  
  // Accent colors
  accent: '#F59E0B', // Amber
  accentLight: '#FCD34D',
  
  // Status colors
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Neutral colors
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate 100
  surfaceElevated: '#FFFFFF',
  
  // Text colors
  text: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  textLight: '#CBD5E1', // Slate 300
  
  // Border and divider colors
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  divider: '#E2E8F0', // Slate 200
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Gradient colors
  gradientPrimary: ['#6366F1', '#818CF8'],
  gradientSecondary: ['#EC4899', '#F472B6'],
  gradientAccent: ['#F59E0B', '#FCD34D'],
  gradientSuccess: ['#10B981', '#34D399'],
  
  // Recipe category colors
  categoryItalian: '#DC2626', // Red
  categoryMexican: '#EA580C', // Orange
  categoryAsian: '#D97706', // Amber
  categoryIndian: '#059669', // Emerald
  categoryMediterranean: '#0891B2', // Cyan
  categoryAmerican: '#7C3AED', // Violet
  categoryFrench: '#BE185D', // Pink
  categoryJapanese: '#1F2937', // Gray
};

// Typography
export const TYPOGRAPHY = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  
  // Font weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Line heights
  tight: 1.25,
  lineNormal: 1.5,
  relaxed: 1.75,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border radius
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
};






