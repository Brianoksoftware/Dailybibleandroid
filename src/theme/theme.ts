export type ThemeColors = {
  background: string;
  card: string;
  header: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentSoft: string;
  input: string;
  chip: string;
  icon: string;
  overlay: string;
  success: string;
  gradient: [string, string];
};

export const lightColors: ThemeColors = {
  background: '#F7F4EE',
  card: '#FFFFFF',
  header: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E8E2D6',
  accent: '#2F6F62',
  accentSoft: '#E8F3F0',
  input: '#F7F4EE',
  chip: '#F7F4EE',
  icon: '#666666',
  overlay: 'rgba(0,0,0,0.35)',
  success: '#2E7D32',
  gradient: ['#2F6F62', '#4A9A88'],
};

export const darkColors: ThemeColors = {
  background: '#0E1116',
  card: '#1A1F27',
  header: '#141821',
  text: '#F4F1EA',
  textSecondary: '#B8B3A9',
  textMuted: '#8A857C',
  border: '#2A313C',
  accent: '#D4AF37',
  accentSoft: '#2A2416',
  input: '#12171E',
  chip: '#12171E',
  icon: '#C4BEB4',
  overlay: 'rgba(0,0,0,0.5)',
  success: '#81C784',
  gradient: ['#1A2E2A', '#2F4A44'],
};
