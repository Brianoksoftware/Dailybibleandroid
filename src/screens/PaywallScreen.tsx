import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePro } from '../pro/ProContext';
import { openRootScreen } from '../navigation/openRootScreen';
import { useTheme } from '../theme/ThemeContext';

export default function PaywallScreen({ navigation }: { navigation: any }) {
  const { isPro, unlockPro, restorePro, priceLabel, isExpoGo } = usePro();
  const { colors } = useTheme();
  const [buying, setBuying] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const buy = async () => {
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
          'Google Play could not complete this purchase. Check that Daily Bible Pro is set up in Play Console, then try again.'
        );
      }
    } finally {
      setBuying(false);
    }
  };

  const restore = async () => {
    setRestoring(true);
    try {
      const result = await restorePro();
      if (result === 'success') {
        Alert.alert('Restored', 'Daily Bible Pro is unlocked on this device.');
        navigation.goBack();
      } else if (result === 'unavailable') {
        Alert.alert('Restore unavailable', 'Restore works in a Google Play or internal-testing build.');
      } else {
        Alert.alert(
          'Nothing to restore',
          'No previous Daily Bible Pro purchase was found for this Google account.'
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
    >
      <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name="book" size={36} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Daily Bible Pro</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        One-time purchase. Unlock unlimited verse search and a reading list you can check off as you go.
      </Text>

      <View style={styles.perk}>
        <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
        <Text style={[styles.perkText, { color: colors.text }]}>Unlimited searches every day</Text>
      </View>
      <View style={styles.perk}>
        <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
        <Text style={[styles.perkText, { color: colors.text }]}>Add any verse to your reading list in one tap</Text>
      </View>
      <View style={styles.perk}>
        <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
        <Text style={[styles.perkText, { color: colors.text }]}>Keep the list on this device and reuse it</Text>
      </View>
      <View style={styles.perk}>
        <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
        <Text style={[styles.perkText, { color: colors.text }]}>Check off verses as you read</Text>
      </View>

      {isPro ? (
        <Text style={[styles.owned, { color: colors.success }]}>Pro is already unlocked on this device.</Text>
      ) : (
        <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.accent }]} onPress={buy} disabled={buying}>
          <Text style={styles.buyButtonText}>
            {buying ? 'Working…' : `Unlock Pro · ${priceLabel}`}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={restore} disabled={restoring} style={styles.restoreButton}>
        <Text style={[styles.restoreText, { color: colors.accent }]}>
          {restoring ? 'Restoring…' : 'Restore Purchases'}
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F3F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  perkText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  buyButton: {
    marginTop: 20,
    backgroundColor: '#2F6F62',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  restoreButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  owned: {
    marginTop: 20,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  legalLine: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  legalDot: {
    marginHorizontal: 8,
    fontSize: 13,
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
});
