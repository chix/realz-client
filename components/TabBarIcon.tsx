import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import Colors from '../constants/Colors';

export default function TabBarIcon({ name, focused }: { name: React.ComponentProps<typeof Ionicons>['name'], focused: boolean }) {
  return (
    <Ionicons
      name={name}
      size={30}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
};
