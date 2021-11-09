import React, { useEffect, useState } from 'react';

import AdList from '../components/AdList';
import { SaleStackScreenProps } from '../types';

export default function SaleScreen({ navigation }: SaleStackScreenProps<'SaleList'>) {
  const [showFilter, setShowFilter] = useState(false);

  // toggle filter
  useEffect(() => {
    const unsubscribe = navigation?.getParent()?.addListener('tabLongPress', () => {
      setShowFilter(showFilter ? false : true);
    });
  
    return unsubscribe;
  }, [navigation, showFilter]);

  return (
    <AdList advertType="sale" showFilter={showFilter}/>
  );
};
