/**
 * Google Play Store listing copy for Daily Bible Friend Offline.
 *
 * Paste these fields into Play Console → Grow → Store presence → Main store listing.
 * Title is ≤30 characters and includes unique + searchable terms (bible, daily, offline).
 *
 * Before you publish:
 * 1. Host `docs/` and set SITE_URL below to that public HTTPS origin (no trailing slash).
 * 2. Create the app in Play Console with package com.brianoksoftware.DailyBible.
 * 3. Create managed product IAP dailybible_pro (one-time / non-consumable equivalent).
 * 4. Complete Data safety to match PRIVACY.md (no account; Google Play handles payments).
 */

const SITE_URL = 'https://REPLACE_WITH_YOUR_HOSTED_DOCS';

/** ≤30 characters — Play Store title (heavily indexed) */
const title = 'Daily Bible Friend Offline';

/** ≤80 characters — short description (indexed for search) */
const shortDescription =
  'Offline daily verse, KJV search & bookmarks. Free; Pro unlocks unlimited search.';

const keywords = [
  'offline bible',
  'bible friend',
  'daily bible',
  'verse of the day',
  'offline scripture',
  'kjv',
  'devotional',
  'christian',
  'faith',
  'gospel',
  'prayer',
  'psalm',
  'jesus',
  'worship',
  'hope',
  'bible',
  'scripture',
  'verse',
];

const fullDescription = `Daily Bible Friend Offline is your companion for Scripture—even when you have no signal.

Start each day with a verse of the day, search the Bible (KJV), bookmark favorites, and keep growing in faith. Popular verses work offline from the app’s saved catalog; live search uses the internet when available.

WHAT YOU GET
• Verse of the day that stays the same all day (works offline)
• Search by word, topic, book, testament, or reference (like John 3:16)
• Bookmark verses to revisit anytime
• Share a verse with friends and family
• Light and dark themes

FREE VS PRO
Free: daily verse, browse suggestions, bookmarks, and 3 searches per day.
Bible Friend Pro (one-time purchase): unlimited search and a reading list you can check off as you go.

TEXT & TRANSLATION
Popular passages are bundled for offline reading. Live lookup uses the King James Version (KJV) through public Bible services. No account required. Your bookmarks stay on your device.

Open Daily Bible Friend Offline, read today’s verse, and keep God’s Word close—online or offline.

Search phrases: ${keywords.join(', ')}.`;

const releaseNotes = `Welcome to Daily Bible Friend Offline.

• Verse of the day on Home (works offline)
• Search Scripture by word, topic, book, or reference
• Bookmark and share verses
• Optional Bible Friend Pro for unlimited search and a reading list

Thank you for reading with us.`;

const reviewNotes = `Daily Bible Friend Offline is a Bible verse app for Android. No login or account.

FREE FEATURES TO TEST
1. Home: verse of the day and more suggested verses (offline catalog)
2. Bookmark with the bookmark icon; view them under Saved
3. Search: up to 3 free searches per day (word, topic, book, testament, or reference such as John 3:16)
4. Turn on airplane mode: daily verse and bookmarks still work; live search shows an offline message
5. Open a verse for context, related verses, and Share
6. Theme toggle on the Home header; About/Privacy/Terms via the info icon

PRO (In-App Product: dailybible_pro, one-time / managed product)
• Unlock from the paywall, from Search after the free limit, or from the Reading list tab
• Pro unlocks unlimited search and the reading list
• Use Restore Purchases on the paywall to restore a prior buy
• In Expo Go purchases are simulated; Play store builds use Google Play Billing

DATA
Bookmarks, search count, theme, and Pro status are stored on device only. Verse lookups may call bible-api.com and bolls.life for KJV text. Free tier shows AdMob banner ads on Home/Search; Pro removes ads.

SUPPORT
${SITE_URL}/
Privacy: ${SITE_URL}/privacy.html
Terms: ${SITE_URL}/terms.html
Contact: kabonyobrian@gmail.com`;

module.exports = {
  platform: 'android',
  packageName: 'com.brianoksoftware.DailyBible',
  productId: 'dailybible_pro',
  category: 'Books & Reference',
  contentRating: 'Everyone',
  contactEmail: 'kabonyobrian@gmail.com',
  copyright: '2026 Brian Onyango Kabonyo',
  siteUrl: SITE_URL,
  listing: {
    'en-US': {
      title,
      shortDescription,
      fullDescription,
      releaseNotes,
      keywords,
    },
  },
  urls: {
    marketing: `${SITE_URL}/`,
    support: `${SITE_URL}/`,
    privacyPolicy: `${SITE_URL}/privacy.html`,
    terms: `${SITE_URL}/terms.html`,
  },
  reviewNotes,
  iap: {
    productId: 'dailybible_pro',
    displayName: 'Bible Friend Pro',
    description: 'Unlimited search & reading list',
    price: '$3.99',
  },
};
