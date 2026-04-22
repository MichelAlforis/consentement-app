import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.consentement.app',
  appName: 'Consentement',
  webDir: 'out',
  ios: {
    contentInset: 'always',
    scrollEnabled: false,
  },
  android: {
    backgroundColor: '#000000',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
