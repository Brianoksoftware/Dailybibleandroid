import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { usePro } from '../pro/ProContext';
import { useTheme } from '../theme/ThemeContext';
import { openPaywall } from '../navigation/openPaywall';
import EmptyState from '../components/EmptyState';
import { FadeIn, PopOnChange, PressableScale, ProgressBar } from '../theme/motion';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow } from '../theme/ui';
import {
  ReadingItem,
  clearCheckedItems,
  getReadingList,
  removeReadingItem,
  toggleReadingItem,
} from '../storage/readingList';

export default function ReadingListScreen({ navigation }: { navigation: any }) {
  const { isPro } = usePro();
  const { colors, isDark } = useTheme();
  const [items, setItems] = useState<ReadingItem[]>([]);

  const loadList = async () => {
    setItems(await getReadingList());
  };

  useFocusEffect(
    useCallback(() => {
      loadList();
    }, [])
  );

  const readCount = items.filter((item) => item.checked).length;
  const unreadCount = items.length - readCount;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isPro && readCount > 0 ? (
          <TouchableOpacity
            onPress={async () => setItems(await clearCheckedItems())}
            style={styles.headerButton}
          >
            <Text style={[styles.headerButtonText, { color: colors.accent }]}>Clear read</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, isPro, readCount, colors.accent]);

  if (!isPro) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="sparkles"
          title="Reading list is Pro"
          message="Unlock Pro to collect verses into a reading plan and check them off as you go."
          actionLabel="See Pro"
          onAction={() => openPaywall(navigation)}
        />
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="book-outline"
          title="Your list is empty"
          message="Open any verse and tap “Add to reading list” to build your plan."
          actionLabel="Find a verse"
          onAction={() => navigation.navigate('Search')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <FadeIn fromY={10}>
          <View style={[styles.progressCard, { backgroundColor: colors.card }, cardShadow(isDark)]}>
            <View style={styles.progressTop}>
              <View>
                <Text style={[styles.progressEyebrow, { color: colors.textMuted }]}>Your plan</Text>
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  {unreadCount === 0
                    ? 'All caught up'
                    : `${unreadCount} verse${unreadCount === 1 ? '' : 's'} to read`}
                </Text>
              </View>
              <View style={[styles.progressBadge, { backgroundColor: colors.accentSoft }]}>
                <Text style={[styles.progressBadgeText, { color: colors.accent }]}>
                  {readCount}/{items.length}
                </Text>
              </View>
            </View>
            <ProgressBar
              value={items.length ? readCount / items.length : 0}
              trackColor={colors.input}
              fillColor={colors.accent}
            />
          </View>
        </FadeIn>
      }
      renderItem={({ item, index }) => (
        <FadeIn delay={staggerDelay(index, 45, 220)} fromY={8}>
          <View style={[styles.row, { backgroundColor: colors.card }, cardShadow(isDark)]}>
            <TouchableOpacity
              style={styles.checkArea}
              onPress={() => onToggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
              accessibilityLabel={`Mark ${item.reference} as ${item.checked ? 'unread' : 'read'}`}
            >
              <PopOnChange active={item.checked}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: item.checked ? colors.accent : 'transparent',
                      borderColor: item.checked ? colors.accent : colors.border,
                    },
                  ]}
                >
                  {item.checked ? (
                    <Ionicons name="checkmark" size={15} color={colors.accentOn} />
                  ) : null}
                </View>
              </PopOnChange>
            </TouchableOpacity>

            <PressableScale
              style={styles.rowText}
              scaleTo={0.99}
              onPress={() => navigation.navigate('VerseDetail', { verseId: item.verseId })}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.reference}`}
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
            </PressableScale>

            <TouchableOpacity
              onPress={() => onRemove(item)}
              style={styles.remove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.reference}`}
            >
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </FadeIn>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerButton: {
    paddingHorizontal: spacing.md,
  },
  headerButtonText: {
    ...typography.label,
  },
  progressCard: {
    borderRadius: radius.lg,
    padding: spacing.lg + 2,
    marginBottom: spacing.lg,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressEyebrow: {
    ...typography.eyebrow,
    marginBottom: 3,
  },
  progressTitle: {
    ...typography.section,
  },
  progressBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  progressBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    marginBottom: spacing.md,
    paddingRight: spacing.xs,
  },
  checkArea: {
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingRight: spacing.sm,
  },
  name: {
    fontSize: 15.5,
    lineHeight: 22,
    fontWeight: '700',
  },
  snippet: {
    ...typography.caption,
    marginTop: 3,
  },
  remove: {
    padding: spacing.md,
  },
});
