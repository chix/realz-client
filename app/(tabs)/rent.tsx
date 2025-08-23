import React from 'react';

import AdList from '@/components/AdList';
import { AdvertTypeEnum } from '@/types';

export default function SaleScreen() {
  return (
    <AdList advertType={AdvertTypeEnum.rent}/>
  );
};
