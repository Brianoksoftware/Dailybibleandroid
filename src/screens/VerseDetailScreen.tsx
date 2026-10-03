import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VerseService } from '../services/verseService';
import { Verse } from '../types/Verse';
import { isFavorite as loadIsFavorite, toggleFavorite as persistFavorite } from '../storage/favorites';
import { addVerseToReadingList } from '../storage/readingList';
import { usePro } from '../pro/ProContext';
import { openPaywall } from '../navigation/openPaywall';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VerseDetailScreenProps {
  navigation: any;
  route: any;
}

export default function VerseDetailScreen({ navigation, route }: VerseDetailScreenProps) {
  const { verseId } = route.params;
  const { isPro } = usePro();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadVerseDetails();
  }, [verseId]);

  const loadVerseDetails = async () => {
    try {
      setLoading(true);
      const verseData = await VerseService.getVerseById(verseId);
      setVerse(verseData);
      setIsFavorite(await loadIsFavorite(verseId));
    } catch (error) {
      console.error('Failed to load verse details:', error);
      Alert.alert('Error', 'Failed to load this verse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!verse) return;
    const next = await persistFavorite(verse);
    setIsFavorite(next);
  };

  const addToReadingList = async () => {
    if (!verse) return;
    if (!isPro) {
      openPaywall(navigation);
      return;
    }
    const added = await addVerseToReadingList(verse);
    Alert.alert(
      added ? 'Added to reading list' : 'Already on your list',
      added ? `${verse.reference} was saved to your reading list.` : 'This verse is already on your reading list.'
    );
  };

  const shareVerse = async () => {
    if (!verse) return;

    try {
      await Share.share({
        message: `${verse.text}\n\n— ${verse.reference} (${verse.translation})`,
        title: verse.reference,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading verse...</Text>
      </View>
    );
  }

  if (!verse) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={64} color={colors.accent} />
        <Text style={[styles.errorText, { color: colors.text }]}>Verse not found</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.accent }]} onPress={loadVerseDetails}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const related = VerseService.getRelatedVerses(verse);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={colors.gradient} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroActions}>
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 0 }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareVerse}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.heroReference}>{verse.reference}</Text>
        <Text style={styles.heroTranslation}>{verse.translation} · {verse.testament} Testament</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.verseText, { color: colors.text }]}>{verse.text}</Text>

        {verse.topics.length > 0 && (
          <View style={styles.tagsContainer}>
            {verse.topics.map((topic) => (
              <View key={topic} style={[styles.tag, { backgroundColor: colors.accent }]}>
                <Text style={styles.tagText}>{topic}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={[styles.readingButton, { backgroundColor: colors.accent }]} onPress={addToReadingList}>
          <Ionicons name="book-outline" size={18} color="white" />
          <Text style={styles.readingButtonText}>
            {isPro ? 'Add to reading list' : 'Unlock reading list'}
          </Text>
        </TouchableOpacity>

        {verse.context.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>In context</Text>
            {verse.context.map((line) => (
              <View key={line.verse} style={styles.contextRow}>
                <Text style={[styles.contextNumber, { color: colors.accent }]}>{line.verse}</Text>
                <Text
                  style={[
                    styles.contextText,
                    { color: colors.textSecondary },
                    line.verse >= verse.verse && line.verse <= (verse.verseEnd || verse.verse)
                      ? [styles.contextHighlight, { color: colors.text }]
                      : null,
                  ]}
                >
                  {line.text}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {related.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Related verses</Text>
            {related.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.relatedCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.push('VerseDetail', { verseId: item.id })}
              >
                <Text style={[styles.relatedReference, { color: colors.accent }]}>{item.reference}</Text>
                <Text style={[styles.relatedText, { color: colors.textSecondary }]} numberOfLines={3}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#2F6F62',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hero: {
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  heroReference: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroTranslation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    padding: 20,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#2F6F62',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  readingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F6F62',
    borderRadius: 22,
    paddingVertical: 12,
    marginBottom: 24,
  },
  readingButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  contextNumber: {
    width: 28,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  contextText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  contextHighlight: {
    fontWeight: '600',
  },
  relatedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  relatedReference: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  relatedText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
