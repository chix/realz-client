const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: 'realz',
  description: 'Realz client app.',
  slug: 'realz-client',
  platforms: [
    'android'
  ],
  version: '1.0.0',
  githubUrl: 'https://github.com/chix/realz-client',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'realz',
  userInterfaceStyle: 'light',
  primaryColor: '#ffffff',
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'cz.martinkuric.realz.dev' : 'cz.martinkuric.realz'
  },
  android: {
    package: IS_DEV ? 'cz.martinkuric.realz.dev' : 'cz.martinkuric.realz',
    googleServicesFile: './google-services.json'
  },
  androidStatusBar: {
    barStyle: 'dark-content',
    backgroundColor: '#ffffff',
    translucent: false
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/icon.png'
  },
  plugins: [
    'expo-router',
    'expo-asset',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/images/icon.png',
        resizeMode: 'contain',
        dark: {
          backgroundColor: '#000000'
        },
        imageWidth: 200
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: '4fd42320-cf0c-11e8-857b-911781e3251d'
    }
  },
  newArchEnabled: true
};
