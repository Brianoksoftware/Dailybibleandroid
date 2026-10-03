import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { CONTACT_EMAIL, CONTACT_NAME } from '../legal/content';
import { openRootScreen } from '../navigation/openRootScreen';
import { useTheme } from '../theme/ThemeContext';

export default function AboutScreen({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Daily Bible</Text>
      <Text style={[styles.meta, { color: colors.textSecondary }]}>Version {version}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        A daily verse app for personal reading. Free users get the verse of the day, bookmarks, and
        three searches a day. Pro unlocks unlimited search and a reading list.
      </Text>

      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card }]}
        onPress={() => openRootScreen(navigation, 'Privacy')}
      >
        <Ionicons name="shield-outline" size={20} color={colors.accent} />
        <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card }]}
        onPress={() => openRootScreen(navigation, 'Terms')}
      >
        <Ionicons name="document-text-outline" size={20} color={colors.accent} />
        <Text style={[styles.rowText, { color: colors.text }]}>Terms of Use</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card }]}
        onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
      >
        <Ionicons name="mail-outline" size={20} color={colors.accent} />
        <Text style={[styles.rowText, { color: colors.text }]}>
          {CONTACT_NAME} · {CONTACT_EMAIL}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  meta: {
    fontSize: 15,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
