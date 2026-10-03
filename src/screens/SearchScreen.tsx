import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { POPULAR_BOOKS, TOPICS } from '../data/verses';
import { VerseService } from '../services/verseService';
import { SearchParams, Testament, VerseSearchResult } from '../types/Verse';
import { usePro } from '../pro/ProContext';
import { openPaywall } from '../navigation/openPaywall';
import BannerAdSlot from '../ads/BannerAdSlot';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import VerseCard from '../components/VerseCard';
import VerseSkeleton from '../components/VerseSkeleton';
import { consumeSearch, getSearchQuota, SearchQuota } from '../storage/searchQuota';
import { FadeIn, PressableScale, ProgressBar } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, typography } from '../theme/tokens';
import { cardShadow } from '../theme/ui';
import { confirmOfflineLimited, isOnline } from '../utils/network';

interface SearchScreenProps {
  navigation: any;
}

const TESTAMENTS: Testament[] = ['Old', 'New'];
const FREE_SEARCHES_PER_DAY = 3;

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { colors, isDark } = useTheme();
  const { isPro } = usePro();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTestament, setSelectedTestament] = useState<Testament | ''>('');
  const [searchResults, setSearchResults] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [quota, setQuota] = useState<SearchQuota | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters = [selectedTopic, selectedBook, selectedTestament].filter(Boolean).length;

  useFocusEffect(
    useCallback(() => {
      getSearchQuota().then(setQuota);
    }, [])
  );

  const showLimitReached = () => {
    Alert.alert(
      'Daily search limit',
      'Free search is limited to 3 times a day. Unlock Pro for unlimited search.',
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'See Pro', onPress: () => openPaywall(navigation) },
      ]
    );
  };

  const performSearch = async () => {
    if (!searchQuery.trim() && !selectedBook && !selectedTopic && !selectedTestament) {
      Alert.alert('Search required', 'Enter a search term or choose a filter.');
      return;
    }

    if (!isPro) {
      const current = quota ?? (await getSearchQuota());
      if (current.remaining <= 0) {
        setQuota(current);
        showLimitReached();
        return;
      }
    }

    const online = await isOnline();
    if (!online) {
      const continueOffline = await confirmOfflineLimited('Search');
      if (!continueOffline) return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const searchParams: SearchParams = { number: 20 };
      if (searchQuery.trim()) searchParams.query = searchQuery.trim();
      if (selectedBook) searchParams.book = selectedBook;
      if (selectedTopic) searchParams.topic = selectedTopic;
      if (selectedTestament) searchParams.testament = selectedTestament;
      const results = await VerseService.searchVerses(searchParams);
      setSearchResults(results);
      if (!isPro) {
        setQuota(await consumeSearch());
      }
      if (results.length === 0 && !online) {
        Alert.alert(
          'No offline matches',
          'No matching verses were found in the app’s saved catalog. Connect to the internet for full Scripture search.'
        );
      }
    } catch (error) {
      console.error('Search failed:', error);
      const stillOnline = await isOnline();
      Alert.alert(
        stillOnline ? 'Search error' : 'No internet connection',
        stillOnline
          ? 'Could not search verses. Please try again.'
          : 'Search needs an internet connection for live results. Check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBook('');
    setSelectedTopic('');
    setSelectedTestament('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const filterRow = (
    label: string,
    options: readonly string[],
    isSelected: (option: string) => boolean,
    onToggle: (option: string) => void,
    formatLabel?: (option: string) => string
  ) => (
    <View style={styles.filterGroup}>
      <Text style={[styles.filterLabel, { color: colors.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterChips}>
          {options.map((option) => (
            <Chip
              key={option}
              label={formatLabel ? formatLabel(option) : option}
              selected={isSelected(option)}
              onPress={() => onToggle(option)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const used = quota ? Math.max(0, FREE_SEARCHES_PER_DAY - quota.remaining) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FadeIn fromY={6}>
        <View
          style={[
            styles.searchSection,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
            cardShadow(isDark),
          ]}
        >
          <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search a word or verse"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={performSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Clear search text"
              >
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
            <PressableScale
              onPress={performSearch}
              scaleTo={0.9}
              accessibilityRole="button"
              accessibilityLabel="Search"
              style={[styles.searchButton, { backgroundColor: colors.accent }]}
            >
              <Ionicons name="arrow-forward" size={18} color={colors.accentOn} />
            </PressableScale>
          </View>

          <View style={styles.controlRow}>
            <PressableScale
              onPress={() => setFiltersOpen((open) => !open)}
              scaleTo={0.95}
              accessibilityRole="button"
              accessibilityLabel={filtersOpen ? 'Hide filters' : 'Show filters'}
              style={[styles.controlButton, { backgroundColor: colors.chip, borderColor: colors.border }]}
            >
              <Ionicons name="options-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.controlText, { color: colors.textSecondary }]}>Filters</Text>
              {activeFilters > 0 ? (
                <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.countBadgeText, { color: colors.accentOn }]}>{activeFilters}</Text>
                </View>
              ) : (
                <Ionicons
                  name={filtersOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={colors.textMuted}
                />
              )}
            </PressableScale>

            {activeFilters > 0 || searchQuery.length > 0 || hasSearched ? (
              <TouchableOpacity onPress={clearFilters} accessibilityRole="button">
                <Text style={[styles.clearText, { color: colors.accent }]}>Clear all</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {filtersOpen ? (
            <FadeIn fromY={6} duration={220} style={styles.filtersPanel}>
              {filterRow(
                'Topic',
                TOPICS,
                (topic) => selectedTopic === topic,
                (topic) => setSelectedTopic(selectedTopic === topic ? '' : topic)
              )}
              {filterRow(
                'Book',
                POPULAR_BOOKS,
                (book) => selectedBook === book,
                (book) => setSelectedBook(selectedBook === book ? '' : book)
              )}
              {filterRow(
                'Testament',
                TESTAMENTS,
                (testament) => selectedTestament === testament,
                (testament) =>
                  setSelectedTestament(
                    selectedTestament === testament ? '' : (testament as Testament)
                  ),
                (testament) => `${testament} Testament`
              )}
            </FadeIn>
          ) : null}

          {!isPro && quota ? (
            <TouchableOpacity
              style={styles.quotaBlock}
              onPress={quota.remaining <= 0 ? showLimitReached : () => openPaywall(navigation)}
              accessibilityRole="button"
              accessibilityLabel="Free search allowance"
            >
              <View style={styles.quotaHeader}>
                <Text
                  style={[
                    styles.quotaText,
                    { color: quota.remaining <= 0 ? colors.accent : colors.textSecondary },
                  ]}
                >
                  {quota.remaining <= 0
                    ? 'No free searches left today'
                    : `${quota.remaining} of ${FREE_SEARCHES_PER_DAY} free searches left`}
                </Text>
                <Text style={[styles.quotaCta, { color: colors.accent }]}>Go unlimited</Text>
              </View>
              <ProgressBar
                value={used / FREE_SEARCHES_PER_DAY}
                trackColor={colors.input}
                fillColor={quota.remaining <= 0 ? colors.accent : colors.accentAlt}
                height={5}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </FadeIn>

      {loading ? (
        <View style={styles.skeletonWrap}>
          <VerseSkeleton count={5} />
        </View>
      ) : (
        <FlatList
          data={hasSearched ? searchResults : []}
          renderItem={({ item, index }) => (
            <VerseCard
              verse={item}
              index={index}
              showTopics={false}
              onPress={() => navigation.navigate('VerseDetail', { verseId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <EmptyState
              icon={hasSearched ? 'search-outline' : 'sparkles-outline'}
              title={hasSearched ? 'No verses found' : 'Search the Scriptures'}
              message={
                hasSearched
                  ? 'Try a different word, reference, or filter.'
                  : 'Type a word or a reference like John 3:16, or open filters to browse by topic.'
              }
            />
          }
        />
      )}
      <BannerAdSlot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15.5,
  },
  searchButton: {
    borderRadius: radius.pill,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  controlText: {
    ...typography.label,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  clearText: {
    ...typography.label,
  },
  filtersPanel: {
    marginTop: spacing.md,
  },
  filterGroup: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    ...typography.eyebrow,
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
  },
  quotaBlock: {
    marginTop: spacing.md,
  },
  quotaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  quotaText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  quotaCta: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  skeletonWrap: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
