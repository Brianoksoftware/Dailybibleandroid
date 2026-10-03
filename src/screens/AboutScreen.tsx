import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { APP_NAME } from '../branding';
import { CONTACT_EMAIL, CONTACT_NAME } from '../legal/content';
import { openRootScreen } from '../navigation/openRootScreen';
import { usePro } from '../pro/ProContext';
import IconBubble from '../components/IconBubble';
import { FadeIn, PressableScale, ScaleIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow } from '../theme/ui';

export default function AboutScreen({ navigation }: { navigation: any }) {
  const { colors, isDark } = useTheme();
  const { isPro } = usePro();
  const version = Constants.expoConfig?.version || '1.0.0';

  const rows: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
  }[] = [
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacy Policy',
      onPress: () => openRootScreen(navigation, 'Privacy'),
    },
    {
      icon: 'document-text-outline',
      label: 'Terms of Use',
      onPress: () => openRootScreen(navigation, 'Terms'),
    },
    {
      icon: 'mail-outline',
      label: `${CONTACT_NAME} · ${CONTACT_EMAIL}`,
      onPress: () => Linking.openURL(`mailto:${CONTACT_EMAIL}`),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScaleIn style={styles.center}>
        <IconBubble name="book" size={72} />
      </ScaleIn>

      <FadeIn delay={80} style={styles.center}>
        <Text style={[styles.title, { color: colors.text }]}>{APP_NAME}</Text>
        <View style={[styles.versionPill, { backgroundColor: colors.chip }]}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version {version}
            {isPro ? ' · Pro' : ''}
          </Text>
        </View>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          A daily verse companion for personal reading — online or offline. Free users get the verse
          of the day, bookmarks, and three searches a day. Pro unlocks unlimited search and a reading
          list.
        </Text>
      </FadeIn>

      {rows.map((row, index) => (
        <FadeIn key={row.label} delay={staggerDelay(index, 60, 220)} fromY={10}>
          <PressableScale
            style={[styles.row, { backgroundColor: colors.card }, cardShadow(isDark)]}
            onPress={row.onPress}
            accessibilityRole="button"
            accessibilityLabel={row.label}
          >
            <View style={[styles.rowIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name={row.icon} size={18} color={colors.accent} />
            </View>
            <Text style={[styles.rowText, { color: colors.text }]} numberOfLines={1}>
              {row.label}
            </Text>
            <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
          </PressableScale>
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
  center: {
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  versionPill: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
});
