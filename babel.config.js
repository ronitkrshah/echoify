module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-syntax-import-attributes", { deprecatedAssertSyntax: true }],
      "@babel/plugin-transform-export-namespace-from",
      "babel-plugin-transform-typescript-metadata",
      "react-native-paper/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
