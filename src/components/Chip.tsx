import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { PressableScale } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export default function Chip({ label, selected = false, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.93}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.chip,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? colors.accentOn : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});
