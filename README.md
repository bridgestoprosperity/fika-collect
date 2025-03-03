# fika-collect

React Native implementation of our Fika Collect application.

## Getting started

To get started, follow the docs in [getting-started.md](./docs/getting-started.md).

## Building

To build for Android/iOS:

```bash
npx react-native build-android --mode=release
```

```bash
npx react-native build-ios --mode=Release
```

Android outputs may be found in `android/app/build/outputs/apk/release`. All APKs should be sent to Google Play store.

## To do

- [x] write lambda to generate pre-signed S3 URLs
- [ ] deploy lambda to AWS
- [ ] integrate camera utility into survey
- [ ] implement state management for uploads
- [ ] iterate on survey questions

## License

&copy; 2025 Bridges To Prosperity. MIT License.
