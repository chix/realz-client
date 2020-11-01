import React from 'react';

const ExpoTokenContext = React.createContext(null);

export const ExpoTokenProvider = ExpoTokenContext.Provider;
export const ExpoTokenConsumer = ExpoTokenContext.Consumer;

export default ExpoTokenContext;
