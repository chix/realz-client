import Constants from 'expo-constants';

const apiHost = __DEV__
    ? 'http://'+Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':3044')
    : 'https://realz.martinkuric.cz';

export default {
  host: apiHost
};
