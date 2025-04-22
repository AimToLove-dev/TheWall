const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  // Get the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Get the SEO metadata from app.config.js
  const appConfig = require("./app.config");
  const seoMeta = appConfig.default.expo.web.meta || {};

  // Configure HtmlWebpackPlugin with our SEO metadata
  if (config.plugins && config.plugins.length) {
    const htmlPluginIndex = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
    );

    if (htmlPluginIndex !== -1) {
      const htmlPlugin = config.plugins[htmlPluginIndex];
      htmlPlugin.options.title = seoMeta.title || "The Wall";
      htmlPlugin.options.description = seoMeta.description || "";
      htmlPlugin.options.image = seoMeta.image || "";
      htmlPlugin.options.url = seoMeta.url || "";
    }
  }

  return config;
};
