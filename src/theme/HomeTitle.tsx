import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_SHORT_NAME } from '../branding';
import { useTheme } from './ThemeContext';
import { radius, spacing } from './tokens';

export default function HomeTitle() {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.mark, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name="book" size={14} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{APP_SHORT_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
});
