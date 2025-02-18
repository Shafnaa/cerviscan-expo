import React from 'react';

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
          paddingBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Information',
          tabBarIcon: ({ color }) => <Ionicons name="information-circle" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan/index"
        options={{
          title: 'Go Scan',
          tabBarIcon: ({ color }) => <Ionicons name="scan-circle" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="album/index"
        options={{
          title: 'Albums',
          tabBarIcon: ({ color }) => <Ionicons name="albums" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
