import { RouteProp } from '@react-navigation/native';
import React from 'react';

import AdDetail from '../components/AdDetail';
import { RentStackParamList } from '../types';

export default function RentDetailScreen({ route }: { route: RouteProp<RentStackParamList, 'RentDetail'> }) {
  return (
    <AdDetail id={route.params.id}/>
  );
};
