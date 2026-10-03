import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../theme/motion';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import { heroShadow } from '../theme/ui';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  tone?: 'accent' | 'warm';
  style?: StyleProp<ViewStyle>;
};

export default function GradientButton({
  label,
  onPress,
  icon,
  loading = false,
  disabled = false,
  tone = 'accent',
  style,
}: Props) {
  const { colors, isDark } = useTheme();
  const gradient = tone === 'warm' ? colors.gradientWarm : colors.gradient;
  const inactive = disabled || loading;

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[style, inactive ? styles.inactive : null]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, heroShadow(isDark)]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.row}>
            {icon ? <Ionicons name={icon} size={18} color="#FFFFFF" style={styles.icon} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  inactive: {
    opacity: 0.6,
  },
});
