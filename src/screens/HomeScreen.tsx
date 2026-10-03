import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { VerseService } from '../services/verseService';
import { VerseSearchResult } from '../types/Verse';
import { getFavoriteIds, toggleFavorite } from '../storage/favorites';
import { useTheme } from '../theme/ThemeContext';

interface HomeScreenProps {
  navigation: any;
}

const formatToday = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors } = useTheme();
  const [dailyVerse, setDailyVerse] = useState<VerseSearchResult | null>(null);
  const [verses, setVerses] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const loadFavorites = async () => {
    const ids = await getFavoriteIds();
    setFavoriteIds(new Set(ids));
  };

  const loadVerses = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const daily = await VerseService.getDailyVerse();
      const more = await VerseService.getSuggestedVerses(8, daily.id);
      setDailyVerse(daily);
      setVerses(more);
    } catch (error) {
      console.error('Failed to load verses:', error);
      Alert.alert('Error', 'Failed to load verses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadVerses(true), loadFavorites()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadVerses();
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const onToggleFavorite = async (verse: VerseSearchResult) => {
    const isNowFavorite = await toggleFavorite(verse);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isNowFavorite) {
        next.add(verse.id);
      } else {
        next.delete(verse.id);
      }
      return next;
    });
  };

  const renderVerseCard = ({ item }: { item: VerseSearchResult }) => {
    const isFavorite = favoriteIds.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.verseCard, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('VerseDetail', { verseId: item.id })}
      >
        <View style={styles.verseInfo}>
          <View style={styles.verseHeader}>
            <Text style={[styles.verseReference, { color: colors.accent }]}>{item.reference}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onToggleFavorite(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isFavorite ? colors.accent : colors.icon}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.verseText, { color: colors.text }]} numberOfLines={3}>
            {item.text}
          </Text>
          {item.topics.length > 0 ? (
            <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.topics.slice(0, 3).join(' · ')}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading verses...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={colors.gradient} style={styles.header}>
        <Text style={styles.headerTitle}>Verse of the day</Text>
        <Text style={styles.headerSubtitle}>{formatToday()}</Text>
      </LinearGradient>

      <FlatList
        data={verses}
        renderItem={renderVerseCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          dailyVerse ? (
            <View>
              <TouchableOpacity
                style={[styles.dailyCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('VerseDetail', { verseId: dailyVerse.id })}
              >
                <View style={styles.dailyTop}>
                  <Text style={[styles.dailyLabel, { color: colors.accent }]}>Today</Text>
                  <TouchableOpacity
                    onPress={() => onToggleFavorite(dailyVerse)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={favoriteIds.has(dailyVerse.id) ? 'bookmark' : 'bookmark-outline'}
                      size={22}
                      color={favoriteIds.has(dailyVerse.id) ? colors.accent : colors.icon}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.dailyReference, { color: colors.text }]}>{dailyVerse.reference}</Text>
                <Text style={[styles.dailyText, { color: colors.text }]}>{dailyVerse.text}</Text>
              </TouchableOpacity>

              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>More verses</Text>
                <TouchableOpacity
                  onPress={onRefresh}
                  style={[styles.refreshButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Ionicons name="refresh" size={20} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
      />
    </View>
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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dailyCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
  },
  dailyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dailyReference: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  dailyText: {
    fontSize: 17,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
    marginLeft: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  verseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  verseInfo: {
    padding: 15,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  verseReference: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  favoriteButton: {
    padding: 4,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
