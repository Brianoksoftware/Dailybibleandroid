import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { duration as timing } from './tokens';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromY?: number;
  style?: StyleProp<ViewStyle>;
};

/** Soft fade + rise entrance. */
export function FadeIn({
  children,
  delay = 0,
  duration = timing.base,
  fromY = 14,
  style,
}: FadeInProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [fromY, 0],
  });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

type ScaleInProps = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Springy entrance for badges and hero icons. */
export function ScaleIn({ children, delay = 0, style }: ScaleInProps) {
  const scale = useRef(new Animated.Value(0.82)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        delay,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: timing.base,
        delay,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, opacity, scale]);

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>{children}</Animated.View>
  );
}

type PressableScaleProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

/** Subtle press feedback for cards and buttons. */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      {...rest}
      onPressIn={(event) => {
        Animated.spring(scale, {
          toValue: scaleTo,
          useNativeDriver: true,
          speed: 40,
          bounciness: 2,
        }).start();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 8,
        }).start();
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Pops once whenever `active` flips on — used for bookmark and check toggles. */
export function PopOnChange({
  active,
  children,
  style,
}: {
  active: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(active);

  useEffect(() => {
    if (previous.current === active) return;
    previous.current = active;
    if (!active) return;

    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [active, scale]);

  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

/** Shimmering placeholder block for loading states. */
export function Skeleton({
  width,
  height,
  radius = 10,
  base,
  highlight,
  style,
}: {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  base: string;
  highlight: string;
  style?: StyleProp<ViewStyle>;
}) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <View
      style={[
        { width: width ?? '100%', height, borderRadius: radius, backgroundColor: base, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: highlight, opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.55] }) },
        ]}
      />
    </View>
  );
}

/** Animated horizontal progress fill (0–1). */
export function ProgressBar({
  value,
  trackColor,
  fillColor,
  height = 8,
}: {
  value: number;
  trackColor: string;
  fillColor: string;
  height?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: clamped,
      duration: timing.slow,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, progress]);

  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }}>
      <Animated.View
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor: fillColor,
          width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}
