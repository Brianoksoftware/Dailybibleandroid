import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

/** Placeholder stack shown while verses load, so screens never feel blank. */
export default function VerseSkeleton({ count = 4, tall = false }: { count?: number; tall?: boolean }) {
  const { colors } = useTheme();

  return (
    <View>
      {tall ? (
        <View style={[styles.hero, { backgroundColor: colors.card }]}>
          <Skeleton height={14} width="30%" base={colors.skeleton} highlight={colors.skeletonHighlight} />
          <Skeleton
            height={24}
            width="55%"
            base={colors.skeleton}
            highlight={colors.skeletonHighlight}
            style={styles.gap}
          />
          <Skeleton height={14} base={colors.skeleton} highlight={colors.skeletonHighlight} style={styles.gap} />
          <Skeleton height={14} base={colors.skeleton} highlight={colors.skeletonHighlight} style={styles.gapSm} />
          <Skeleton
            height={14}
            width="70%"
            base={colors.skeleton}
            highlight={colors.skeletonHighlight}
            style={styles.gapSm}
          />
        </View>
      ) : null}

      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.card, { backgroundColor: colors.card }]}>
          <Skeleton height={13} width="38%" base={colors.skeleton} highlight={colors.skeletonHighlight} />
          <Skeleton height={12} base={colors.skeleton} highlight={colors.skeletonHighlight} style={styles.gap} />
          <Skeleton
            height={12}
            width="80%"
            base={colors.skeleton}
            highlight={colors.skeletonHighlight}
            style={styles.gapSm}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  gap: {
    marginTop: spacing.md,
  },
  gapSm: {
    marginTop: spacing.sm,
  },
});
