export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  card: string;
  cardAlt: string;
  header: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentAlt: string;
  accentSoft: string;
  accentOn: string;
  input: string;
  chip: string;
  icon: string;
  overlay: string;
  success: string;
  successSoft: string;
  gradient: [string, string];
  gradientWarm: [string, string];
  skeleton: string;
  skeletonHighlight: string;
};

export const lightColors: ThemeColors = {
  background: '#F6F2EA',
  backgroundAlt: '#EFE9DD',
  card: '#FFFFFF',
  cardAlt: '#FBF8F2',
  header: '#FFFFFF',
  text: '#16211F',
  textSecondary: '#5B6B67',
  textMuted: '#93A09C',
  border: '#E6DFD1',
  accent: '#1F6F5C',
  accentAlt: '#48A98B',
  accentSoft: '#E3F2EC',
  accentOn: '#FFFFFF',
  input: '#F4F0E7',
  chip: '#F4F0E7',
  icon: '#5B6B67',
  overlay: 'rgba(14, 24, 22, 0.35)',
  success: '#1F7A43',
  successSoft: '#E2F4E8',
  gradient: ['#1F6F5C', '#49A98C'],
  gradientWarm: ['#C9892F', '#E0B35B'],
  skeleton: '#EAE4D8',
  skeletonHighlight: '#F6F2EA',
};

export const darkColors: ThemeColors = {
  background: '#0B0F14',
  backgroundAlt: '#11161D',
  card: '#161C24',
  cardAlt: '#1C242E',
  header: '#10151C',
  text: '#F2EFE7',
  textSecondary: '#A9B2B0',
  textMuted: '#76817F',
  border: '#242D38',
  accent: '#E0B65C',
  accentAlt: '#F1D08A',
  accentSoft: '#2A2314',
  accentOn: '#17130A',
  input: '#121820',
  chip: '#141B23',
  icon: '#B9C1BF',
  overlay: 'rgba(0, 0, 0, 0.55)',
  success: '#6FC58A',
  successSoft: '#17291D',
  gradient: ['#14312B', '#2C5C50'],
  gradientWarm: ['#3A2E13', '#6B5424'],
  skeleton: '#1B222B',
  skeletonHighlight: '#232C37',
};
