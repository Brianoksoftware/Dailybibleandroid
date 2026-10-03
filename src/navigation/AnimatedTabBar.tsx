import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import { cardShadow } from '../theme/ui';

const ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Home: ['home', 'home-outline'],
  Search: ['search', 'search-outline'],
  List: ['book', 'book-outline'],
  Saved: ['bookmark', 'bookmark-outline'],
};

function TabItem({
  label,
  routeName,
  focused,
  onPress,
  onLongPress,
}: {
  label: string;
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [focused, progress]);

  const [activeIcon, inactiveIcon] = ICONS[routeName] ?? ICONS.Home;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: colors.accentSoft,
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Ionicons
          name={focused ? activeIcon : inactiveIcon}
          size={22}
          color={focused ? colors.accent : colors.textMuted}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: focused ? colors.accent : colors.textMuted },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        cardShadow(isDark),
        {
          backgroundColor: colors.header,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        return (
          <TabItem
            key={route.key}
            label={label}
            routeName={route.name}
            focused={state.index === index}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (state.index !== index && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            onLongPress={() =>
              navigation.emit({ type: 'tabLongPress', target: route.key })
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  pill: {
    position: 'absolute',
    top: 0,
    width: 54,
    height: 32,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
});
