# Play Store search optimization — Daily Bible

Listing copy lives in `store.config.js`. Paste it into Play Console after you create the app and upload an AAB.

```bash
# 1. Edit SITE_URL in store.config.js
# 2. Host docs/ so privacy.html and terms.html are public HTTPS
# 3. eas build --platform android --profile production
# 4. eas submit --platform android --profile production
# 5. Paste title / short / full description from store.config.js into Play Console
```

## Already prepared in the repo

| Field | Value | Notes |
| --- | --- | --- |
| App name / title | Daily Bible | ≤30 chars; matches launcher name |
| Short description | Verse of the day… | ≤80; heavily indexed for Play search |
| Full description | Conversion-focused | Features, free vs Pro, KJV note + keyword phrases |
| Category | Books & Reference | Set in Play Console |
| Content rating | Everyone | Questionnaire for a Scripture reading app |
| Package name | `com.brianoksoftware.DailyBible` | In `app.json` |
| Review / tester notes | Free vs Pro walkthrough | In `store.config.js` → `reviewNotes` |

Short description (for manual paste):

```text
Verse of the day, Scripture search & bookmarks. Free to start; Pro unlocks more.
```

Search phrases woven into the full description (Play indexes description text, not a separate keyword field):

```text
verse, scripture, kjv, devotional, faith, gospel, christian, prayer, inspire, psalm, jesus, god, worship, hope, bible, daily bible, verse of the day
```

## What only you can do (Play Console / marketing)

These cannot be finished from code alone.

### 1. Host legal URLs
Upload `docs/` so these resolve over HTTPS, then set `SITE_URL` in `store.config.js`:
- Support / marketing → `…/`
- Privacy → `…/privacy.html`
- Terms → `…/terms.html`

### 2. Screenshots and optional promo video
Play needs phone screenshots (and optionally 7" / 10" tablet). Capture from a device, emulator, or internal testing track:
1. Home — verse of the day  
2. Search — results or filters  
3. Verse detail — text + bookmark  
4. Saved bookmarks  
5. Paywall or reading list (optional fifth)

Tips: large readable verse text, little UI chrome in the first frame, no competitor logos. A YouTube promo video is optional but helps conversion.

### 3. Store listing graphics
- App icon (512×512; adaptive icon already in the binary)
- Feature graphic 1024×500 (required)
- Optional promo graphic / TV banner later

### 4. In-app product listing copy
In Play Console → Monetize → In-app products → `dailybible_pro` (managed product / one-time):
- **Name**: `Daily Bible Pro`
- **Description**: `Unlimited search & reading list`
- Price ≈ $3.99 (or local equivalents)
- Activate the product before release

### 5. Data safety
Answer Data safety to match the policy: **no data collected by the developer** (no account, no analytics; Google Play Billing handles payments). Declare that the app does not collect personal data for analytics or advertising.

### 6. Availability and pricing
- Countries/regions  
- Default language: English (United States)  
- Optional extra locales when you can translate short/full description

### 7. Ratings and reviews
- Respond to reviews after launch  
- Ask happy users for ratings later if you add an in-app prompt  
- Do not buy reviews or keyword-stuff the title after approval

### 8. Search experiments over time
- A/B store listing experiments (short description, screenshots, feature graphic)  
- Watch Play Console → Grow → Store performance for search terms, then refine the short/full description  
- Never put trademarked competitor names in the listing

### 9. Testing tracks
Use internal testing (or closed testing) before production. Link Expo Go for day-to-day development; use a Play / EAS build for real billing tests.

## Quick launch order

1. Host `docs/` → set `SITE_URL`  
2. Create app + managed product `dailybible_pro` in Play Console  
3. `eas build --platform android` / `eas submit --platform android`  
4. Upload screenshots + feature graphic  
5. Paste listing copy from `store.config.js`  
6. Complete Data safety and content rating  
7. Roll out to internal testing, then production  
