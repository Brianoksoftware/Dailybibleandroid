import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePro } from '../pro/ProContext';
import { PRO_DISPLAY_NAME } from '../branding';
import { openRootScreen } from '../navigation/openRootScreen';
import GradientButton from '../components/GradientButton';
import { FadeIn, ScaleIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow, heroShadow } from '../theme/ui';
import { ensureOnline } from '../utils/network';

const PERKS: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string }[] = [
  {
    icon: 'infinite',
    title: 'Unlimited search',
    detail: 'No daily cap — look up any verse, any time.',
  },
  {
    icon: 'book',
    title: 'Reading list',
    detail: 'Collect verses into a plan and check them off.',
  },
  {
    icon: 'eye-off',
    title: 'No banner ads',
    detail: 'A calm, distraction-free reading screen.',
  },
  {
    icon: 'heart',
    title: 'Support the app',
    detail: 'One payment keeps updates coming.',
  },
];

export default function PaywallScreen({ navigation }: { navigation: any }) {
  const { isPro, unlockPro, restorePro, priceLabel, isExpoGo } = usePro();
  const { colors, isDark } = useTheme();
  const [buying, setBuying] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const buy = async () => {
    if (!isExpoGo && !(await ensureOnline('Purchases'))) return;

    setBuying(true);
    try {
      const result = await unlockPro();
      if (result === 'success') {
        Alert.alert('Pro unlocked', 'You now have unlimited search and a reading list.');
        navigation.goBack();
      } else if (result === 'cancelled') {
        return;
      } else if (result === 'unavailable') {
        Alert.alert(
          'Store unavailable',
          'Purchases need a Google Play build. In Expo Go, Pro can still be unlocked for testing.'
        );
      } else {
        Alert.alert(
          'Purchase failed',
          `Google Play could not complete this purchase. Check that ${PRO_DISPLAY_NAME} is set up in Play Console, then try again.`
        );
      }
    } finally {
      setBuying(false);
    }
  };

  const restore = async () => {
    if (!isExpoGo && !(await ensureOnline('Restore Purchases'))) return;

    setRestoring(true);
    try {
      const result = await restorePro();
      if (result === 'success') {
        Alert.alert('Restored', `${PRO_DISPLAY_NAME} is unlocked on this device.`);
        navigation.goBack();
      } else if (result === 'unavailable') {
        Alert.alert('Restore unavailable', 'Restore works in a Google Play or internal-testing build.');
      } else {
        Alert.alert(
          'Nothing to restore',
          `No previous ${PRO_DISPLAY_NAME} purchase was found for this Google account.`
        );
      }
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScaleIn>
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, heroShadow(isDark)]}
        >
          <View style={styles.heroGlow} />
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>{PRO_DISPLAY_NAME}</Text>
          <Text style={styles.heroSubtitle}>
            One payment. Unlimited search, your own reading list, and no ads — forever.
          </Text>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{priceLabel}</Text>
            <Text style={styles.priceNote}>one-time</Text>
          </View>
        </LinearGradient>
      </ScaleIn>

      <View style={styles.perks}>
        {PERKS.map((perk, index) => (
          <FadeIn key={perk.title} delay={staggerDelay(index, 60, 260)} fromY={10}>
            <View style={[styles.perkCard, { backgroundColor: colors.card }, cardShadow(isDark)]}>
              <View style={[styles.perkIcon, { backgroundColor: colors.accentSoft }]}>
                <Ionicons name={perk.icon} size={18} color={colors.accent} />
              </View>
              <View style={styles.perkBody}>
                <Text style={[styles.perkTitle, { color: colors.text }]}>{perk.title}</Text>
                <Text style={[styles.perkDetail, { color: colors.textSecondary }]}>{perk.detail}</Text>
              </View>
            </View>
          </FadeIn>
        ))}
      </View>

      {isPro ? (
        <FadeIn delay={260}>
          <View style={[styles.ownedCard, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.ownedText, { color: colors.success }]}>
              Pro is already unlocked on this device.
            </Text>
          </View>
        </FadeIn>
      ) : (
        <FadeIn delay={260}>
          <GradientButton
            label={`Unlock Pro · ${priceLabel}`}
            icon="lock-open"
            onPress={buy}
            loading={buying}
          />
        </FadeIn>
      )}

      <TouchableOpacity onPress={restore} disabled={restoring} style={styles.restoreButton}>
        <Text style={[styles.restoreText, { color: colors.accent }]}>
          {restoring ? 'Restoring…' : 'Restore purchase'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.legalLine, { color: colors.textMuted }]}>
        Payment is charged to your Google account. This is a one-time unlock, not a subscription.
      </Text>
      <View style={styles.legalRow}>
        <TouchableOpacity onPress={() => openRootScreen(navigation, 'Privacy')}>
          <Text style={[styles.legalLink, { color: colors.accent }]}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={[styles.legalDot, { color: colors.textMuted }]}>·</Text>
        <TouchableOpacity onPress={() => openRootScreen(navigation, 'Terms')}>
          <Text style={[styles.legalLink, { color: colors.accent }]}>Terms of Use</Text>
        </TouchableOpacity>
      </View>

      {isExpoGo ? (
        <Text style={[styles.note, { color: colors.textMuted }]}>
          Expo Go cannot talk to Google Play Billing. Tapping Unlock Pro here turns Pro on locally so you can test.
        </Text>
      ) : null}
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
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xxl - 2,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    ...typography.display,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.88)',
  },
  pricePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  priceNote: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  perks: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  perkIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  perkBody: {
    flex: 1,
  },
  perkTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  perkDetail: {
    ...typography.caption,
    marginTop: 2,
  },
  ownedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  ownedText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
  },
  restoreButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  legalLine: {
    marginTop: spacing.lg,
    ...typography.caption,
    textAlign: 'center',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  legalDot: {
    marginHorizontal: spacing.sm,
    fontSize: 13,
  },
  note: {
    marginTop: spacing.lg,
    ...typography.caption,
    textAlign: 'center',
  },
});
