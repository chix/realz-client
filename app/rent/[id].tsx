import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import AdDetail from '@/components/AdDetail';

export default function RentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  return (
    <AdDetail id={id as string}/>
  );
};
