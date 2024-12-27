import { Link, Redirect, Stack, Tabs } from 'expo-router';

import { HeaderButton } from '~/components/HeaderButton';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView className='flex-1'>
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
            tabBarIcon: ({ color }) => (
              <Ionicons name="information-circle" size={30} color={color} />
            ),
            headerRight: () => (
              <Link href="/profile" asChild>
                <HeaderButton />
              </Link>
            ),
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
    </SafeAreaView>
  );
}
