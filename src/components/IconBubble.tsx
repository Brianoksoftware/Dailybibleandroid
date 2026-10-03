import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  tone?: 'accent' | 'muted' | 'success';
  style?: StyleProp<ViewStyle>;
};

/** Rounded icon chip used in empty states, paywall, and about rows. */
export default function IconBubble({ name, size = 56, tone = 'accent', style }: Props) {
  const { colors } = useTheme();

  const background =
    tone === 'success' ? colors.successSoft : tone === 'muted' ? colors.chip : colors.accentSoft;
  const color = tone === 'success' ? colors.success : tone === 'muted' ? colors.textMuted : colors.accent;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size * 0.45} color={color} />
    </View>
  );
}
