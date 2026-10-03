import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { VerseSearchResult } from '../types/Verse';
import { getFavorites, removeFavorite, setFavorites } from '../storage/favorites';
import EmptyState from '../components/EmptyState';
import VerseCard from '../components/VerseCard';
import VerseSkeleton from '../components/VerseSkeleton';
import { FadeIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { spacing, typography } from '../theme/tokens';

interface FavoritesScreenProps {
  navigation: any;
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { colors } = useTheme();
  const [favorites, setFavoriteList] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setFavoriteList(await getFavorites());
    } catch (error) {
      console.error('Failed to load saved verses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const onRemove = (verseId: number) => {
    Alert.alert('Remove bookmark', 'Remove this verse from your saved list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeFavorite(verseId);
          setFavoriteList((current) => current.filter((verse) => verse.id !== verseId));
        },
      },
    ]);
  };

  const clearAllFavorites = () => {
    Alert.alert('Clear all bookmarks', 'Remove every saved verse?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          await setFavorites([]);
          setFavoriteList([]);
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        favorites.length > 0 ? (
          <TouchableOpacity onPress={clearAllFavorites} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: colors.accent }]}>Clear</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, favorites.length, colors.accent]);

  if (loading) {
    return (
      <View style={[styles.container, styles.padded, { backgroundColor: colors.background }]}>
        <VerseSkeleton count={4} />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="bookmark-outline"
          title="No bookmarks yet"
          message="Tap the bookmark icon on any verse and it will show up here, ready to read offline."
          actionLabel="Explore verses"
          onAction={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={({ item, index }) => (
        <VerseCard
          verse={item}
          index={index}
          bookmarked
          showTopics={false}
          onPress={() => navigation.navigate('VerseDetail', { verseId: item.id })}
          onToggleBookmark={() => onRemove(item.id)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      style={[styles.container, { backgroundColor: colors.background }]}
      ListHeaderComponent={
        <FadeIn>
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {favorites.length} saved verse{favorites.length === 1 ? '' : 's'}
          </Text>
        </FadeIn>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  count: {
    ...typography.eyebrow,
    marginBottom: spacing.md,
  },
  headerButton: {
    paddingHorizontal: spacing.md,
  },
  headerButtonText: {
    ...typography.label,
  },
});
