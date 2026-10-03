import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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
import { consumeSearch, getSearchQuota, SearchQuota } from '../storage/searchQuota';
import { useTheme } from '../theme/ThemeContext';

interface SearchScreenProps {
  navigation: any;
}

const TESTAMENTS: Testament[] = ['Old', 'New'];

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { colors } = useTheme();
  const { isPro } = usePro();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTestament, setSelectedTestament] = useState<Testament | ''>('');
  const [searchResults, setSearchResults] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [quota, setQuota] = useState<SearchQuota | null>(null);

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

    setLoading(true);
    setHasSearched(true);

    try {
      const searchParams: SearchParams = { number: 20 };
      if (searchQuery.trim()) searchParams.query = searchQuery.trim();
      if (selectedBook) searchParams.book = selectedBook;
      if (selectedTopic) searchParams.topic = selectedTopic;
      if (selectedTestament) searchParams.testament = selectedTestament;
      setSearchResults(await VerseService.searchVerses(searchParams));
      if (!isPro) {
        setQuota(await consumeSearch());
      }
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Search error', 'Could not search verses. Please try again.');
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

  const renderFilterChip = (label: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: isSelected ? colors.accent : colors.chip,
          borderColor: isSelected ? colors.accent : colors.border,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, { color: isSelected ? '#FFFFFF' : colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderVerseCard = ({ item }: { item: VerseSearchResult }) => (
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
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.input }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search a word or John 3:16"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={performSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={performSearch} style={[styles.searchButton, { backgroundColor: colors.accent }]}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {!isPro && quota ? (
          <TouchableOpacity
            style={styles.quotaRow}
            onPress={quota.remaining <= 0 ? showLimitReached : undefined}
          >
            <Text style={[styles.quotaText, { color: quota.remaining <= 0 ? colors.accent : colors.textSecondary }]}>
              {quota.remaining <= 0
                ? 'No free searches left today · Unlock Pro'
                : `${quota.remaining} free search${quota.remaining === 1 ? '' : 'es'} left today`}
            </Text>
          </TouchableOpacity>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Topic</Text>
            {TOPICS.map((topic) => (
              <View key={topic}>
                {renderFilterChip(topic, selectedTopic === topic, () =>
                  setSelectedTopic(selectedTopic === topic ? '' : topic)
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Book</Text>
            {POPULAR_BOOKS.map((book) => (
              <View key={book}>
                {renderFilterChip(book, selectedBook === book, () =>
                  setSelectedBook(selectedBook === book ? '' : book)
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Testament</Text>
            {TESTAMENTS.map((testament) => (
              <View key={testament}>
                {renderFilterChip(
                  `${testament} Testament`,
                  selectedTestament === testament,
                  () => setSelectedTestament(selectedTestament === testament ? '' : testament)
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.chip, borderColor: colors.border }]}
          onPress={clearFilters}
        >
          <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>Clear filters</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching verses...</Text>
        </View>
      ) : (
        <FlatList
          data={hasSearched ? searchResults : []}
          renderItem={renderVerseCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                {hasSearched ? 'No verses found' : 'Search the Scriptures'}
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                {hasSearched
                  ? 'Try a different word, reference, or filter.'
                  : 'Use the search bar or filters above.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchSection: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2F6F62',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quotaRow: {
    marginBottom: 12,
  },
  quotaText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
    minWidth: 72,
  },
  filterChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginTop: 4,
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  verseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 15,
    overflow: 'hidden',
  },
  verseInfo: {
    padding: 15,
  },
  verseReference: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    paddingTop: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
});
