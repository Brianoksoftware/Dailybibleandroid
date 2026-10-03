# Daily Bible Friend Offline

A daily Bible verse app built with React Native and Expo for Android (Expo Go). It keeps the same structure as the previous recipe app: home, search, saved bookmarks, a Pro reading list, sharing, and light/dark theme.

## Features

- **Verse of the day** that stays the same all day, plus more suggested verses
- **Search** by word, reference (`John 3:16`), topic, book, or testament
- **Bookmarks** saved on the device
- **Reading list** (Pro) to check verses off as you read
- **Share** any verse from the detail screen
- **Light and dark theme**

## Setup

```bash
npm install
npm start
```

Then open the project in Expo Go on Android (`npm run android` opens the Android Expo Go client when available).

## Notes

Popular verses are bundled in the app so Home still works offline. Live lookup and keyword search use public Bible APIs (bible-api.com and bolls.life) with the King James Version.

## Play Store listing

Optimized title, short/full description, keywords, and review notes are in `store.config.js`. Human checklist for screenshots, in-app product text, and Data safety: [docs/PLAY_STORE.md](docs/PLAY_STORE.md).

```bash
# After hosting docs/ and editing SITE_URL in store.config.js:
eas build --platform android --profile production
eas submit --platform android --profile production
# Then paste listing fields from store.config.js into Play Console
```
