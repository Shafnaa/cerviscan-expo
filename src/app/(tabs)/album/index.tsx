import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { cn, styles } from '~/utils/utils';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Album' }} />
      <ScrollView className={cn(styles.screen, 'gap-8')}>
        <ScreenContent path="app/(tabs)/album/index.tsx" title="Albums" />
      </ScrollView>
    </>
  );
}
