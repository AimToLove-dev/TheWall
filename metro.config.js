// Learn more at https://docs.expo.dev/guides/using-firebase/#configure-metro
const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = {
  ...defaultConfig,
  watchFolders: [
    // Add any additional watch folders here
    __dirname,
  ],
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
  },
};
