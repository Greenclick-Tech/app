export default () => ({
  expo: {
    name: "greenclick",
    slug: "greenclick",
    extra: {
      "GOOGLE_KEY": process.env.GOOGLE_KEY || null,
    },
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/ba4ba5d3-f0ba-4205-8be9-9f9fa9aa6854"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "org.name.greenclick"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "ba4ba5d3-f0ba-4205-8be9-9f9fa9aa6854"
      }
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
})
