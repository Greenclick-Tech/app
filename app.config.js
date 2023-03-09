import "dotenv/config";

export default () => ({
  expo: {
    name: "Greenclick",
    slug: "greenclick",
    version: "1.0.12",
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
      bundleIdentifier: "org.name.greenclick",
      buildNumber: "30",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app uses your location to retrieve nearby hotels & unlock the greenclick lock box when you are in clock proximity.",
        NSLocationAlwaysUsageDescription: "This app requires your location to verify if you are in close proximity of the greenclick lock box.",
        NSCameraUsageDescription: "This app requires your camera accesss to confirm your rental period to be damage & liability free."
      }
    },
    android: {
      package: "org.name.greenclick",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || null,
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
