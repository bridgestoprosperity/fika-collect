# Admin locations

This directory contains a script to turn a CSV list of locations into a nested location "database". This works well up to Admin Level 2, but it does not work well for Admin Level 3 since there's just too much data for JSON to parse efficiently. Fortunately, Admin Level 2 seems sufficient for now, but if this were to change, it would probably need a different strategy like either a proper SQLite database or chunking and async loading. But for now, we avoid this complexity.

To build,

```sh
npm install
npm run build:json
npm run build:asset
```

To integrate into the React Native app, we use [react-native-asset](https://www.npmjs.com/package/react-native-asset). Note that `react-native-asset` is *not* a runtime dependency of the app. Instead, it is just a script that puts assets in the correct location to be integrated into the app build correctly.

The asset manifest is listed in [react-native.config.js](./react-native.config.js).
