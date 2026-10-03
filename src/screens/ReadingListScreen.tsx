import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { usePro } from '../pro/ProContext';
import { useTheme } from '../theme/ThemeContext';
import { openPaywall } from '../navigation/openPaywall';
import {
  ReadingItem,
  clearCheckedItems,
  getReadingList,
  removeReadingItem,
  toggleReadingItem,
} from '../storage/readingList';

export default function ReadingListScreen({ navigation }: { navigation: any }) {
  const { isPro } = usePro();
  const { colors } = useTheme();
  const [items, setItems] = useState<ReadingItem[]>([]);

  const loadList = async () => {
    setItems(await getReadingList());
  };

  useFocusEffect(
    useCallback(() => {
      loadList();
    }, [])
  );

  const unreadCount = items.filter((item) => !item.checked).length;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isPro && items.some((item) => item.checked) ? (
          <TouchableOpacity
            onPress={async () => setItems(await clearCheckedItems())}
            style={{ paddingHorizontal: 12 }}
          >
            <Text style={{ color: colors.accent, fontWeight: '600' }}>Clear read</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, isPro, items, colors.accent]);

  if (!isPro) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <Ionicons name="book-outline" size={80} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Reading list is Pro</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Unlock Pro to save verses to a reading list and check them off as you go.
        </Text>
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.accent }]}
          onPress={() => openPaywall(navigation)}
        >
          <Text style={styles.ctaText}>See Pro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onToggle = async (itemId: string) => {
    setItems(await toggleReadingItem(itemId));
  };

  const onRemove = (item: ReadingItem) => {
    Alert.alert('Remove verse', `Remove ${item.reference} from the list?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => setItems(await removeReadingItem(item.id)),
      },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <Ionicons name="book-outline" size={80} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your list is empty</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Open a verse and tap Add to reading list to keep it here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={[styles.header, { color: colors.text }]}>
          {unreadCount} verse{unreadCount === 1 ? '' : 's'} to read
        </Text>
      }
      renderItem={({ item }) => (
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.checkArea} onPress={() => onToggle(item.id)}>
            <Ionicons
              name={item.checked ? 'checkbox' : 'square-outline'}
              size={24}
              color={item.checked ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowText}
            onPress={() => navigation.navigate('VerseDetail', { verseId: item.verseId })}
          >
            <Text
              style={[
                styles.name,
                { color: colors.text },
                item.checked && { color: colors.textMuted, textDecorationLine: 'line-through' },
              ]}
            >
              {item.reference}
            </Text>
            <Text style={[styles.snippet, { color: colors.textMuted }]} numberOfLines={2}>
              {item.text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(item)} style={styles.remove}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  list: {
    padding: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    paddingRight: 8,
  },
  checkArea: {
    padding: 14,
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontWeight: '600',
  },
  snippet: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    lineHeight: 18,
  },
  remove: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F8F9FA',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  cta: {
    backgroundColor: '#2F6F62',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  ctaText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
