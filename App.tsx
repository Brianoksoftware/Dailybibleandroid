import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import VerseDetailScreen from './src/screens/VerseDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ReadingListScreen from './src/screens/ReadingListScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AboutScreen from './src/screens/AboutScreen';
import LegalScreen from './src/screens/LegalScreen';
import { AdsProvider } from './src/ads/AdsContext';
import { PRO_DISPLAY_NAME } from './src/branding';
import { ProProvider } from './src/pro/ProContext';
import AnimatedTabBar from './src/navigation/AnimatedTabBar';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import HomeHeaderActions from './src/theme/HomeHeaderActions';
import HomeTitle from './src/theme/HomeTitle';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function useStackScreenOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: {
      backgroundColor: colors.header,
    },
    headerTintColor: colors.text,
    headerShadowVisible: false,
    headerTitleStyle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700' as const,
    },
    cardStyle: { backgroundColor: colors.background },
  };
}

function HomeStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerTitle: () => <HomeTitle />,
          headerRight: () => <HomeHeaderActions />,
        }}
      />
      <Stack.Screen
        name="VerseDetail"
        component={VerseDetailScreen}
        options={{ title: 'Verse', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ title: 'Search verses' }}
      />
      <Stack.Screen
        name="VerseDetail"
        component={VerseDetailScreen}
        options={{ title: 'Verse', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ title: 'Saved' }}
      />
      <Stack.Screen
        name="VerseDetail"
        component={VerseDetailScreen}
        options={{ title: 'Verse', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ReadingStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="ReadingMain"
        component={ReadingListScreen}
        options={{ title: 'Reading list' }}
      />
      <Stack.Screen
        name="VerseDetail"
        component={VerseDetailScreen}
        options={{ title: 'Verse', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="List" component={ReadingStack} options={{ title: 'List' }} />
      <Tab.Screen name="Saved" component={FavoritesStack} />
    </Tab.Navigator>
  );
}

function ThemedNavigation() {
  const { colors, isDark } = useTheme();
  const rootScreenOptions = useStackScreenOptions();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.header,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <RootStack.Navigator screenOptions={rootScreenOptions}>
          <RootStack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{ presentation: 'modal', title: PRO_DISPLAY_NAME }}
          />
          <RootStack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
          <RootStack.Screen
            name="Privacy"
            component={LegalScreen}
            initialParams={{ kind: 'privacy' }}
            options={{ title: 'Privacy Policy' }}
          />
          <RootStack.Screen
            name="Terms"
            component={LegalScreen}
            initialParams={{ kind: 'terms' }}
            options={{ title: 'Terms of Use' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProProvider>
          <AdsProvider>
            <ThemedNavigation />
          </AdsProvider>
        </ProProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
