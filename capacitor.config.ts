import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ericanderson.kidspointstracker',
  appName: 'kids-points-app',
  webDir: 'build',
  plugins: {
    App: {
      androidBackButton: {
        enabled: true
      }
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;