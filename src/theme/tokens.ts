/** Shared layout, type, and motion scales so every screen feels like one app. */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const typography = {
  display: { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.4 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.2 },
  section: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 23 },
  verse: { fontSize: 18, lineHeight: 29 },
  label: { fontSize: 13, fontWeight: '600' as const },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
  caption: { fontSize: 12, lineHeight: 18 },
};

export const duration = {
  fast: 180,
  base: 320,
  slow: 480,
};

/** Cap stagger so long lists never feel sluggish. */
export const staggerDelay = (index: number, step = 50, max = 260) =>
  Math.min(index * step, max);
