import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VerseSearchResult } from '../types/Verse';
import { FadeIn, PopOnChange, PressableScale } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, staggerDelay, typography } from '../theme/tokens';
import { cardShadow } from '../theme/ui';

type Props = {
  verse: VerseSearchResult;
  index?: number;
  bookmarked?: boolean;
  onPress: () => void;
  onToggleBookmark?: () => void;
  showTopics?: boolean;
};

export default function VerseCard({
  verse,
  index = 0,
  bookmarked = false,
  onPress,
  onToggleBookmark,
  showTopics = true,
}: Props) {
  const { colors, isDark } = useTheme();

  return (
    <FadeIn delay={staggerDelay(index)} fromY={10}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${verse.reference}`}
        style={[styles.card, { backgroundColor: colors.card }, cardShadow(isDark)]}
      >
        <View style={[styles.accentEdge, { backgroundColor: colors.accent }]} />
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={[styles.reference, { color: colors.accent }]}>{verse.reference}</Text>
            {onToggleBookmark ? (
              <TouchableOpacity
                onPress={onToggleBookmark}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark verse'}
              >
                <PopOnChange active={bookmarked}>
                  <Ionicons
                    name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={bookmarked ? colors.accent : colors.icon}
                  />
                </PopOnChange>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={[styles.text, { color: colors.text }]} numberOfLines={3}>
            {verse.text}
          </Text>

          {showTopics && verse.topics.length > 0 ? (
            <View style={styles.topicRow}>
              {verse.topics.slice(0, 2).map((topic) => (
                <View key={topic} style={[styles.topic, { backgroundColor: colors.accentSoft }]}>
                  <Text style={[styles.topicText, { color: colors.accent }]}>{topic}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </PressableScale>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentEdge: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reference: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  text: {
    ...typography.body,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.xs + 2,
  },
  topic: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  topicText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
