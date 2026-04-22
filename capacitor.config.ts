import type { CapacitorConfig } from '@capacitor/cli';

const isAdultVariant = process.env.APP_VARIANT === 'adult';

const config: CapacitorConfig = {
  appId: isAdultVariant ? 'fr.consentement.explicit' : 'fr.consentement.app',
  appName: isAdultVariant ? 'Consentement Adultes' : 'Consentement',
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
