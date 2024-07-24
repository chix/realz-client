import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import AdDetail from '@/components/AdDetail';

export default function SaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  return (
    <AdDetail id={id as string}/>
  );
};
