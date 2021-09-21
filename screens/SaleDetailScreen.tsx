import { RouteProp } from '@react-navigation/native';
import React from 'react';

import AdDetail from '../components/AdDetail';
import { SaleStackParamList } from '../types';

export default function SaleDetailScreen({ route }: { route: RouteProp<SaleStackParamList, 'SaleDetail'> }) {
  return (
    <AdDetail id={route.params.id}/>
  );
};
