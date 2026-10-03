import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  LEGAL_UPDATED,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  TERMS_INTRO,
  TERMS_SECTIONS,
} from '../legal/content';
import { useTheme } from '../theme/ThemeContext';

export default function LegalScreen({ route }: { route: { params?: { kind?: 'privacy' | 'terms' } } }) {
  const { colors } = useTheme();
  const kind = route.params?.kind === 'terms' ? 'terms' : 'privacy';
  const intro = kind === 'terms' ? TERMS_INTRO : PRIVACY_INTRO;
  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.updated, { color: colors.textMuted }]}>Last updated: {LEGAL_UPDATED}</Text>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{intro}</Text>
      {sections.map((section) => (
        <React.Fragment key={section.title}>
          <Text style={[styles.heading, { color: colors.text }]}>{section.title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  updated: {
    fontSize: 13,
    marginBottom: 16,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});
