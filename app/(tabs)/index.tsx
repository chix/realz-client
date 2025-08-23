import React, { useEffect, useState } from 'react';

import AdList from '@/components/AdList';
import { useNavigation } from 'expo-router';
import { AdvertTypeEnum } from '@/types';

export default function SaleScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const navigation = useNavigation();

  // toggle filter
  useEffect(() => {
    const unsubscribe = navigation?.addListener('tabLongPress' as never, () => {
      setShowFilter(showFilter ? false : true);
    });
  
    return unsubscribe;
  }, [navigation, showFilter]);

  return (
    <AdList advertType={AdvertTypeEnum.sale} showFilter={showFilter}/>
  );
};
