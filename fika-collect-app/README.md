# fika-collect

React Native implementation of our Fika Collect application.

## Getting started

To configure your environment and get started, follow the React Native template docs in [getting-started.md](./docs/getting-started.md).


## Assets

Assets (for example, [src/assets/locations.json](./src/assets/locations.json)) are configured with [react-native-asset](https://github.com/unimonkiez/react-native-asset). They are specified in [react-native.config.js](./react-native.config.js) and updated with the `react-native-asset` command.

## Building

To build for iOS and Android, respectively:

```bash
npx react-native build-ios --mode=Release
```

An analogous command for Android works, but it builds an APK. What we really want is an AAB. You can build this using the following command:

```bash
cd android
./gradlew buildRelease
./gradlew assembleRelease
```

The resulting build may be found in `android/app/build/outputs/bundle/release/`.


## License

&copy; 2025 Bridges To Prosperity. MIT License.