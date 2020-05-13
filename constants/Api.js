import Constants from 'expo-constants';

const apiHost = (typeof Constants.manifest.packagerOpts === 'object') && Constants.manifest.packagerOpts.dev
    ? 'http://'+Constants.manifest.debuggerHost.split(':').shift().concat(':3044')
    : 'https://realz.martinkuric.cz';

export default {
  host: apiHost
};
