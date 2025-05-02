const path = require('node:path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');


/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    // Necessary for it to resolve the fika-collect-survey-schema module
    path.resolve(__dirname, '..', 'packages'),

    // Necessary for it to resolve zod as used by fika-collect-survey-schema
    path.resolve(__dirname, '..', 'node_modules')
  ]
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
