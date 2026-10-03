import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
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
import EmptyState from '../components/EmptyState';
import VerseSkeleton from '../components/VerseSkeleton';
import { FadeIn, PopOnChange, PressableScale, ScaleIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow, heroShadow } from '../theme/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isOnline } from '../utils/network';

interface VerseDetailScreenProps {
  navigation: any;
  route: any;
}

export default function VerseDetailScreen({ navigation, route }: VerseDetailScreenProps) {
  const { verseId } = route.params;
  const { isPro } = usePro();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [onList, setOnList] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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
      const online = await isOnline();
      Alert.alert(
        online ? 'Could not load verse' : 'No internet connection',
        online
          ? 'Failed to load this verse. Please try again.'
          : 'This verse needs an internet connection to load. Check your network and try again.'
      );
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
    setOnList(true);
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
      <View style={[styles.stateContainer, { backgroundColor: colors.background, paddingTop: insets.top + spacing.xl }]}>
        <VerseSkeleton tall count={2} />
      </View>
    );
  }

  if (!verse) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.plainBack, { backgroundColor: colors.chip }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <EmptyState
          icon="cloud-offline-outline"
          title="Verse unavailable"
          message="This passage may need an internet connection. Check your network and try again."
          actionLabel="Try again"
          onAction={loadVerseDetails}
        />
      </View>
    );
  }

  const related = VerseService.getRelatedVerses(verse);

  const heroScale = scrollY.interpolate({
    inputRange: [-120, 0],
    outputRange: [1.18, 1],
    extrapolateRight: 'clamp',
  });
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <Animated.View style={{ transform: [{ scale: heroScale }] }}>
          <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, heroShadow(isDark), { paddingTop: insets.top + spacing.md }]}
          >
            <View style={styles.heroGlow} />
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={21} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionSpacing]}
                  onPress={toggleFavorite}
                  accessibilityRole="button"
                  accessibilityLabel={isFavorite ? 'Remove bookmark' : 'Bookmark verse'}
                >
                  <PopOnChange active={isFavorite}>
                    <Ionicons
                      name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                      size={21}
                      color="#FFFFFF"
                    />
                  </PopOnChange>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionSpacing]}
                  onPress={shareVerse}
                  accessibilityRole="button"
                  accessibilityLabel="Share verse"
                >
                  <Ionicons name="share-social-outline" size={21} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScaleIn delay={60}>
              <Text style={styles.heroReference}>{verse.reference}</Text>
              <View style={styles.heroMetaRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{verse.translation}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{verse.testament} Testament</Text>
                </View>
              </View>
            </ScaleIn>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          <FadeIn delay={80} fromY={16}>
            <View style={[styles.verseCard, { backgroundColor: colors.card }, cardShadow(isDark)]}>
              <Text style={[styles.quoteGlyph, { color: colors.accentSoft }]}>“</Text>
              <Text style={[styles.verseText, { color: colors.text }]}>{verse.text}</Text>
            </View>

            {verse.topics.length > 0 && (
              <View style={styles.tagsContainer}>
                {verse.topics.map((topic) => (
                  <View
                    key={topic}
                    style={[styles.tag, { backgroundColor: colors.accentSoft }]}
                  >
                    <Ionicons name="pricetag" size={10} color={colors.accent} />
                    <Text style={[styles.tagText, { color: colors.accent }]}>{topic}</Text>
                  </View>
                ))}
              </View>
            )}

            <PressableScale
              onPress={addToReadingList}
              accessibilityRole="button"
              accessibilityLabel={isPro ? 'Add to reading list' : 'Unlock reading list'}
            >
              <LinearGradient
                colors={colors.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.readingButton, heroShadow(isDark)]}
              >
                <Ionicons
                  name={isPro ? (onList ? 'checkmark-circle' : 'add-circle-outline') : 'lock-open-outline'}
                  size={19}
                  color="#FFFFFF"
                />
                <Text style={styles.readingButtonText}>
                  {isPro ? (onList ? 'On your reading list' : 'Add to reading list') : 'Unlock reading list'}
                </Text>
              </LinearGradient>
            </PressableScale>
          </FadeIn>

          {verse.context.length > 0 ? (
            <FadeIn delay={150}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>In context</Text>
                <View style={[styles.contextCard, { backgroundColor: colors.card }, cardShadow(isDark)]}>
                  {verse.context.map((line) => {
                    const highlighted =
                      line.verse >= verse.verse && line.verse <= (verse.verseEnd || verse.verse);
                    return (
                      <View
                        key={line.verse}
                        style={[
                          styles.contextRow,
                          highlighted
                            ? { backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md }
                            : null,
                        ]}
                      >
                        <Text style={[styles.contextNumber, { color: colors.accent }]}>{line.verse}</Text>
                        <Text
                          style={[
                            styles.contextText,
                            { color: highlighted ? colors.text : colors.textSecondary },
                            highlighted ? styles.contextHighlight : null,
                          ]}
                        >
                          {line.text}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </FadeIn>
          ) : null}

          {related.length > 0 ? (
            <FadeIn delay={210}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Related verses</Text>
                {related.map((item, index) => (
                  <FadeIn key={item.id} delay={staggerDelay(index, 40, 160)} fromY={8}>
                    <PressableScale
                      style={[styles.relatedCard, { backgroundColor: colors.card }, cardShadow(isDark)]}
                      onPress={() => navigation.push('VerseDetail', { verseId: item.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${item.reference}`}
                    >
                      <View style={styles.relatedHeader}>
                        <Text style={[styles.relatedReference, { color: colors.accent }]}>
                          {item.reference}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                      </View>
                      <Text style={[styles.relatedText, { color: colors.textSecondary }]} numberOfLines={3}>
                        {item.text}
                      </Text>
                    </PressableScale>
                  </FadeIn>
                ))}
              </View>
            </FadeIn>
          ) : null}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  plainBack: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.lg,
    marginTop: spacing.md,
  },
  hero: {
    paddingBottom: spacing.xxl + spacing.sm,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    bottom: -90,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: radius.pill,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSpacing: {
    marginLeft: spacing.md,
  },
  heroReference: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
  content: {
    padding: spacing.xl,
  },
  verseCard: {
    borderRadius: radius.xl,
    padding: spacing.xl + 2,
    marginTop: -spacing.xxl - spacing.sm,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  quoteGlyph: {
    position: 'absolute',
    top: -26,
    right: spacing.lg,
    fontSize: 120,
    fontWeight: '800',
  },
  verseText: {
    fontSize: 21,
    lineHeight: 33,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  readingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxl,
  },
  readingButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.section,
    marginBottom: spacing.md,
  },
  contextCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contextNumber: {
    width: 26,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  contextText: {
    flex: 1,
    fontSize: 15.5,
    lineHeight: 24,
  },
  contextHighlight: {
    fontWeight: '600',
  },
  relatedCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  relatedReference: {
    fontSize: 15,
    fontWeight: '700',
  },
  relatedText: {
    ...typography.body,
  },
});
