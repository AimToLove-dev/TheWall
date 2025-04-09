import "dotenv/config";

export default {
  expo: {
    name: "The Wall",
    slug: "the-wall",
    privacy: "public",
    platforms: ["web", "ios", "android"],
    version: "0.19.0",
    orientation: "portrait",
    icon: "./assets/whale.svg",
    splash: {
      image: "./assets/TheWall.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    // Deep linking configuration
    scheme: "thewall",
    web: {
      favicon: "./assets/heart.png",
      assetBundlePatterns: ["**/*"],
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
