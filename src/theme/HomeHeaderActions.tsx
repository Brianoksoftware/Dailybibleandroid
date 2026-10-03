import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { openRootScreen } from '../navigation/openRootScreen';
import { PressableScale } from './motion';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
import { radius, spacing } from './tokens';

export default function HomeHeaderActions() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.row}>
      <ThemeToggle />
      <PressableScale
        onPress={() => openRootScreen(navigation, 'About')}
        scaleTo={0.88}
        accessibilityRole="button"
        accessibilityLabel="About, privacy, and terms"
        style={[styles.info, { backgroundColor: colors.accentSoft, borderColor: colors.border }]}
      >
        <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  info: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    borderWidth: 1,
  },
});
