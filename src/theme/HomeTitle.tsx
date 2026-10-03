import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { openRootScreen } from '../navigation/openRootScreen';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function HomeTitle() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text }]}>Daily Bible</Text>
      <ThemeToggle />
      <TouchableOpacity
        onPress={() => openRootScreen(navigation, 'About')}
        style={[styles.info, { backgroundColor: colors.accentSoft, borderColor: colors.border }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="About, privacy, and terms"
      >
        <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  info: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
});
