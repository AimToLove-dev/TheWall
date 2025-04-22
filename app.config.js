import "dotenv/config";
import path from "path";

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
      favicon: "./assets/favicon.png",
      assetBundlePatterns: ["**/*"],
      // SEO metadata that will be injected at build time
      meta: {
        title: "The Wall - A Holy Revolution for the LGBTQ+ Community",
        description:
          "The Wall is a holy revolution that provides a place to love, pray for, and evangelize the LGBTQ+ community through our Wailing Wall and Testimony Wall initiatives.",
        image: "https://your-domain.com/assets/TheWall.png", // Replace with your actual domain
        url: "https://your-domain.com", // Replace with your actual domain
      },
      // Custom HTML template
      build: {
        templatePath: "./web-build-template/index.html",
      },
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
