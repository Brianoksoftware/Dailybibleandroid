import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VerseSearchResult } from '../types/Verse';
import { getFavorites, removeFavorite, setFavorites } from '../storage/favorites';
import { useTheme } from '../theme/ThemeContext';

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
          <TouchableOpacity onPress={clearAllFavorites} style={{ paddingHorizontal: 12 }}>
            <Text style={{ color: colors.accent, fontWeight: '600' }}>Clear</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, favorites.length, colors.accent]);

  const renderFavoriteCard = ({ item }: { item: VerseSearchResult }) => (
    <TouchableOpacity
      style={[styles.verseCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('VerseDetail', { verseId: item.id })}
    >
      <View style={styles.verseInfo}>
        <Text style={[styles.verseReference, { color: colors.accent }]}>{item.reference}</Text>
        <Text style={[styles.verseText, { color: colors.text }]} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
        <Ionicons name="bookmark" size={20} color={colors.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading saved verses...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <Ionicons name="bookmark-outline" size={80} color={colors.textMuted} />
        <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No bookmarks yet</Text>
        <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
          Save verses with the bookmark icon, then they will appear here.
        </Text>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreButtonText}>Explore verses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderFavoriteCard}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      style={[styles.container, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  verseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  verseInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  verseReference: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
  },
  removeButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F8F9FA',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#2F6F62',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
