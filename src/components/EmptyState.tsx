import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from './GradientButton';
import IconBubble from './IconBubble';
import { FadeIn, ScaleIn } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { spacing, typography } from '../theme/tokens';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'accent' | 'muted';
};

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  tone = 'accent',
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <ScaleIn>
        <IconBubble name={icon} size={76} tone={tone} />
      </ScaleIn>
      <FadeIn delay={90}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      </FadeIn>
      {actionLabel && onAction ? (
        <FadeIn delay={150} style={styles.action}>
          <GradientButton label={actionLabel} onPress={onAction} />
        </FadeIn>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: 48,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
});
