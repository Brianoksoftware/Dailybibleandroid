import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { VerseService } from '../services/verseService';
import { VerseSearchResult } from '../types/Verse';
import { getFavoriteIds, toggleFavorite } from '../storage/favorites';
import BannerAdSlot from '../ads/BannerAdSlot';
import VerseCard from '../components/VerseCard';
import VerseSkeleton from '../components/VerseSkeleton';
import { FadeIn, PopOnChange, PressableScale } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, typography } from '../theme/tokens';
import { cardShadow, heroShadow } from '../theme/ui';
import { isOnline } from '../utils/network';

interface HomeScreenProps {
  navigation: any;
}

const formatToday = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

function RefreshSpinner({ spinning, color }: { spinning: boolean; color: string }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spinning) {
      rotation.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotation, spinning]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Ionicons name="refresh" size={18} color={color} />
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors, isDark } = useTheme();
  const [dailyVerse, setDailyVerse] = useState<VerseSearchResult | null>(null);
  const [verses, setVerses] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [heroHeight, setHeroHeight] = useState(170);
  const scrollY = useRef(new Animated.Value(0)).current;

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
      const online = await isOnline();
      Alert.alert(
        online ? 'Could not load verses' : 'No internet connection',
        online
          ? 'Failed to load verses. Please try again.'
          : 'Some verses need an internet connection. Check your network and try again. Saved and daily verses may still work offline.'
      );
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

  const heroTranslate = scrollY.interpolate({
    inputRange: [0, 240],
    outputRange: [0, -120],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.35],
    extrapolate: 'clamp',
  });

  const dailyFavorite = dailyVerse ? favoriteIds.has(dailyVerse.id) : false;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        pointerEvents="none"
        onLayout={(event) => setHeroHeight(event.nativeEvent.layout.height)}
        style={[
          styles.heroWrap,
          { transform: [{ translateY: heroTranslate }], opacity: heroOpacity },
        ]}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, heroShadow(isDark)]}
        >
          <View style={styles.heroGlow} />
          <FadeIn fromY={8} duration={420}>
            <Text style={styles.heroEyebrow}>{greeting()}</Text>
            <Text style={styles.heroTitle}>Verse of the day</Text>
            <View style={styles.heroDateRow}>
              <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroDate}>{formatToday()}</Text>
            </View>
          </FadeIn>
        </LinearGradient>
      </Animated.View>

      {loading ? (
        <View style={[styles.skeletonWrap, { paddingTop: heroHeight + spacing.lg }]}>
          <VerseSkeleton tall count={3} />
        </View>
      ) : (
        <Animated.FlatList
          data={verses}
          renderItem={({ item, index }) => (
            <VerseCard
              verse={item}
              index={index}
              bookmarked={favoriteIds.has(item.id)}
              onPress={() => navigation.navigate('VerseDetail', { verseId: item.id })}
              onToggleBookmark={() => onToggleFavorite(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressViewOffset={heroHeight}
            />
          }
          contentContainerStyle={[styles.listContainer, { paddingTop: heroHeight }]}
          ListHeaderComponent={
            dailyVerse ? (
              <View>
                <FadeIn delay={70} fromY={16}>
                  <PressableScale
                    style={[styles.dailyCard, { backgroundColor: colors.card }, cardShadow(isDark)]}
                    onPress={() => navigation.navigate('VerseDetail', { verseId: dailyVerse.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`Read ${dailyVerse.reference} in full`}
                  >
                    <Text style={[styles.quoteGlyph, { color: colors.accentSoft }]}>“</Text>

                    <View style={styles.dailyTop}>
                      <View style={[styles.todayPill, { backgroundColor: colors.accentSoft }]}>
                        <Ionicons name="sunny" size={12} color={colors.accent} />
                        <Text style={[styles.dailyLabel, { color: colors.accent }]}>Today</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onToggleFavorite(dailyVerse)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityRole="button"
                        accessibilityLabel={dailyFavorite ? 'Remove bookmark' : 'Bookmark verse'}
                      >
                        <PopOnChange active={dailyFavorite}>
                          <Ionicons
                            name={dailyFavorite ? 'bookmark' : 'bookmark-outline'}
                            size={22}
                            color={dailyFavorite ? colors.accent : colors.icon}
                          />
                        </PopOnChange>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.dailyReference, { color: colors.text }]}>
                      {dailyVerse.reference}
                    </Text>
                    <Text style={[styles.dailyText, { color: colors.text }]}>{dailyVerse.text}</Text>

                    <View style={[styles.dailyFooter, { borderTopColor: colors.border }]}>
                      <Text style={[styles.openHint, { color: colors.accent }]}>Read full verse</Text>
                      <Ionicons name="arrow-forward" size={15} color={colors.accent} />
                    </View>
                  </PressableScale>
                </FadeIn>

                <FadeIn delay={150}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={[styles.sectionEyebrow, { color: colors.textMuted }]}>
                        Keep reading
                      </Text>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>More verses</Text>
                    </View>
                    <TouchableOpacity
                      onPress={onRefresh}
                      accessibilityRole="button"
                      accessibilityLabel="Shuffle verses"
                      style={[
                        styles.refreshButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                      ]}
                    >
                      <RefreshSpinner spinning={refreshing} color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                </FadeIn>
              </View>
            ) : null
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
  heroWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl + spacing.md,
    paddingHorizontal: spacing.xl + 2,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -70,
    right: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: 'rgba(255,255,255,0.78)',
    marginBottom: spacing.xs + 2,
  },
  heroTitle: {
    ...typography.display,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  heroDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  skeletonWrap: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg + 2,
    paddingBottom: spacing.xxl,
  },
  dailyCard: {
    borderRadius: radius.xl,
    padding: spacing.xl + 2,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  quoteGlyph: {
    position: 'absolute',
    top: -22,
    right: spacing.lg,
    fontSize: 110,
    fontWeight: '800',
  },
  dailyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dailyLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dailyReference: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  dailyText: {
    ...typography.verse,
    fontStyle: 'italic',
  },
  dailyFooter: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openHint: {
    ...typography.label,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionEyebrow: {
    ...typography.eyebrow,
    marginBottom: 3,
  },
  sectionTitle: {
    ...typography.section,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
