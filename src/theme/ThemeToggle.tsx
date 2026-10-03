import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './motion';
import { useTheme } from './ThemeContext';
import { radius } from './tokens';

export default function ThemeToggle() {
  const { isDark, colors, toggleTheme } = useTheme();
  const spin = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(spin, {
      toValue: isDark ? 1 : 0,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isDark, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <PressableScale
      onPress={toggleTheme}
      scaleTo={0.88}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={[styles.button, { backgroundColor: colors.accentSoft, borderColor: colors.border }]}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.accent} />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
