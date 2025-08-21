import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Resume Builder',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#14b8a6",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#14b8a6"
    }
  }
};

export default config;