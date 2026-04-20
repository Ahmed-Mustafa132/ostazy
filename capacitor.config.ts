import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.osama.ostazy',
  appName: 'أستاذي',
  webDir: 'dist',  // ← غيرناها من out لـ dist
  bundledWebRuntime: false
};

export default config;