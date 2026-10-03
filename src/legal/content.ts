export const LEGAL_UPDATED = '26 September 2026';
export const CONTACT_NAME = 'Brian Onyango Kabonyo';
export const CONTACT_EMAIL = 'kabonyobrian@gmail.com';
export const APP_NAME = 'Daily Bible';

export type LegalSection = {
  title: string;
  body: string;
};

export const PRIVACY_INTRO =
  'This Privacy Policy explains what information Daily Bible (“the App”) handles, how that information is used, and what choices you have. Daily Bible is a Bible verse app. It does not require an account.';

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: '1. Information we collect',
    body: 'Daily Bible does not require you to create an account and does not ask for your name, email address, phone number, password, or location.\n\nWe do not operate our own servers that store your verses, bookmarks, or reading list. We do not use advertising, analytics, crash-reporting, or tracking SDKs.',
  },
  {
    title: '2. Information stored on your device',
    body: 'The App stores a small amount of data on your device so its features work. This may include:\n\n• Bookmarked verses (reference, text, and related details)\n• Reading-list items if you unlock Pro\n• How many free searches you have used today\n• Your light or dark theme preference\n• Whether Pro has been unlocked on this device\n\nThis information stays on the device. We do not receive a copy of it. You can remove bookmarks and reading-list items in the App. Deleting the App removes this locally stored data, subject to how your device normally works.',
  },
  {
    title: '3. Purchases',
    body: 'If you buy Daily Bible Pro, the purchase is processed by Google through Google Play Billing. We do not collect, see, or store your card number, Google account password, or other payment details.\n\nGoogle may handle information needed to complete the purchase, prevent fraud, and restore what you bought. That handling is governed by Google’s privacy policy.\n\nThe App only stores a local record that Pro is unlocked on this device so unlimited search and the reading list keep working. You can restore a previous purchase with the Restore Purchases control. Restoring uses Google Play purchase records, not an account in Daily Bible.',
  },
  {
    title: '4. Information received by third-party Bible services',
    body: 'Some verses are bundled in the App. When you browse more passages, open a verse for surrounding context, or run a live search, the App may request text from public Bible services, including bible-api.com and bolls.life.\n\nThose requests can include the passage or search terms you asked for, plus ordinary technical information such as your IP address and the time of the request. We do not send your bookmarks, reading list, or Pro status to those services.\n\nbible-api.com and bolls.life operate their own servers and decide how they handle information. Daily Bible does not control their practices. Please review their policies:\n\nbible-api.com — https://bible-api.com/\nbolls.life — https://bolls.life/',
  },
  {
    title: '5. Sharing',
    body: 'If you use Share, your device opens the system share sheet. You choose where the verse goes. Daily Bible does not receive a copy of what you share unless you separately send it to us (for example by email). The app or service you share with has its own privacy policy.',
  },
  {
    title: '6. Information we do not collect',
    body: 'Daily Bible does not ask for or directly collect:\n\n• Name, email, or phone number (except if you choose to email us)\n• Precise location\n• Contacts, photos, camera, or microphone\n• Payment card details\n• Advertising identifiers for tracking\n\nThe App does not include ads, analytics SDKs, or other tracking SDKs. We do not sell personal information. We do not use your information for cross-app or cross-website tracking or personalized advertising.',
  },
  {
    title: '7. Internet access',
    body: 'The daily verse and many popular passages can appear from text stored in the App. An internet connection is used for additional verses, surrounding context, and live search.\n\nIf the App is offline, features that need the network may not work. Your internet provider and the Bible services you reach may process technical information such as your IP address under their own policies.',
  },
  {
    title: '8. Children',
    body: 'Daily Bible is a general-audience Scripture app. It is not directed at children under 13, and we do not knowingly collect personal information from children under 13.\n\nBecause the App does not require an account and does not collect personal information from users, we do not keep a database of children’s information. If you believe a child has sent us personal information by email, contact us and we will delete it.',
  },
  {
    title: '9. Retention and deletion',
    body: 'We do not keep a server-side copy of your bookmarks, search history, or reading list.\n\nYou can remove bookmarks and reading-list items in the App. Search counts reset each local calendar day. Deleting the App removes locally stored App data, subject to your operating system.\n\nGoogle retains purchase records according to Google’s policies. Information handled by bible-api.com or bolls.life follows those services’ own retention practices.',
  },
  {
    title: '10. Security',
    body: 'We limit what the App handles to what its features need. Data stored on your device also depends on your device’s security. No method of storage or internet transmission is completely secure.',
  },
  {
    title: '11. Changes',
    body: 'We may update this policy if the App’s features, data practices, or third-party services change. When we do, we will update the “Last updated” date. Please review this policy from time to time.',
  },
  {
    title: '12. Contact',
    body: `If you have questions about this Privacy Policy or Daily Bible, contact:\n\n${CONTACT_NAME}\n${CONTACT_EMAIL}`,
  },
];

export const TERMS_INTRO =
  'These Terms of Use govern your use of Daily Bible. By using the App, you agree to these terms.';

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: '1. The app',
    body: 'Daily Bible provides Bible verses for personal reading, including a verse of the day, search, bookmarks, and an optional reading list. It is for personal, non-commercial use. It is not a substitute for pastoral care, counseling, or professional advice.',
  },
  {
    title: '2. Bible text',
    body: 'Verse text shown in the App is from public-domain editions (including the King James Version) and from public Bible services. Daily Bible does not claim ownership of Scripture. Trademarks and names of third-party services belong to their owners.',
  },
  {
    title: '3. Free and Pro features',
    body: 'The free App includes the daily verse, suggested verses, bookmarks, sharing, theme options, and a limited number of searches each day (currently three).\n\nDaily Bible Pro is a one-time In-App Purchase that unlocks unlimited search and the reading list on the device where you buy or restore it. The price is shown in the App by Google Play before you confirm.',
  },
  {
    title: '4. Purchases and restore',
    body: 'Payments are charged to your Google account through Google Play. All billing, refunds, and purchase records are handled by Google under Google Play’s terms.\n\nIf you reinstall the App or use a new device signed in with the same Google account, use Restore Purchases to unlock Pro again. Daily Bible does not keep a separate user account for purchases.',
  },
  {
    title: '5. Acceptable use',
    body: 'You agree not to misuse the App, attempt to break its security, overload the Bible services it calls, or use it in a way that violates applicable law.',
  },
  {
    title: '6. Availability',
    body: 'Some verses need an internet connection and third-party services. Those services may be unavailable, slow, or changed without notice. We do not guarantee that every search or passage will always load.',
  },
  {
    title: '7. Disclaimer',
    body: 'The App is provided “as is.” To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. We are not liable for lost data on your device, service interruptions, or decisions you make based on the App’s content.',
  },
  {
    title: '8. Changes',
    body: 'We may update the App and these terms. Continued use after an update means you accept the revised terms. The “Last updated” date will change when we revise them.',
  },
  {
    title: '9. Contact',
    body: `Questions about these terms: ${CONTACT_NAME}, ${CONTACT_EMAIL}.`,
  },
];
