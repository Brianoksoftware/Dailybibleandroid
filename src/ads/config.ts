/**
 * AdMob unit IDs.
 *
 * 1. Create an Android app in AdMob for package com.brianoksoftware.DailyBible
 * 2. Create a Banner ad unit
 * 3. Put your App ID in app.json → plugins → react-native-google-mobile-ads
 * 4. Paste the banner unit ID below (ca-app-pub-xxxx/yyyy)
 *
 * Until then, Google test IDs are used so builds and demos stay safe.
 */
export const PRODUCTION_BANNER_UNIT_ID = '';

export const shouldUseTestAds = () => __DEV__ || !PRODUCTION_BANNER_UNIT_ID.trim();
