// Learn more https://docs.expo.io/guides/customizing-metro
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(config);
