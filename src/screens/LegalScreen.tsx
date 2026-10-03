import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  LEGAL_UPDATED,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  TERMS_INTRO,
  TERMS_SECTIONS,
} from '../legal/content';
import { FadeIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow } from '../theme/ui';

export default function LegalScreen({ route }: { route: { params?: { kind?: 'privacy' | 'terms' } } }) {
  const { colors, isDark } = useTheme();
  const kind = route.params?.kind === 'terms' ? 'terms' : 'privacy';
  const intro = kind === 'terms' ? TERMS_INTRO : PRIVACY_INTRO;
  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeIn fromY={8}>
        <View style={[styles.introCard, { backgroundColor: colors.card }, cardShadow(isDark)]}>
          <View style={[styles.updatedPill, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.updatedText, { color: colors.accent }]}>
              Updated {LEGAL_UPDATED}
            </Text>
          </View>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>{intro}</Text>
        </View>
      </FadeIn>

      {sections.map((section, index) => (
        <FadeIn key={section.title} delay={staggerDelay(index, 35, 240)} fromY={8}>
          <View style={styles.section}>
            <Text style={[styles.heading, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        </FadeIn>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  introCard: {
    borderRadius: radius.lg,
    padding: spacing.lg + 2,
    marginBottom: spacing.xl,
  },
  updatedPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  updatedText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  intro: {
    fontSize: 15,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.xl,
  },
  heading: {
    ...typography.section,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
  },
});
