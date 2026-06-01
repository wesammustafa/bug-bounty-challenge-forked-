# Bug Bounty Challenge

Solutions to the issues listed on the app's home screen, plus the optional countdown and language tasks.

## What was fixed

- **Console `key` warning:** the Home issues list is keyed by a stable, unique value.
- **Bold "known" in the intro:** rendered via react-i18next's `<Trans>` so the existing `<b>` markup applies. The i18n text is unchanged and no `dangerouslySetInnerHTML` is used.
- **Missing avatar:** corrected a MobX store typo so the fetched user lands in the observable, and wrapped `AvatarMenu` in `forwardRef` so MUI's `<Grow>` can attach its ref (the hinted "second bug").
- **Countdown (optional):** derived from a fixed deadline with interval cleanup, clamped at zero, ending in a localized "time's up" state.
- **Language switch EN/DE (optional):** an app-bar selector plus full i18n coverage (issues list and avatar menu included) and a complete German locale.

Minor cleanups: removed stray debug logs and an unused import, and replaced a deprecated string API.

## Notes

- Every change carries an inline JSDoc fix-record (`@symptom`, `@rootCause`, `@fix`, `@tradeoff`, `@verify`) so the reasoning sits next to the code.
- This is a Create React App (react-scripts 4) project; on Node 17+ run it with Node 16 (or `NODE_OPTIONS=--openssl-legacy-provider`) because of Webpack 4 and OpenSSL 3.
