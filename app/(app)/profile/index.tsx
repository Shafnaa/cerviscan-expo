import React from 'react';

import { Stack } from 'expo-router';
import { ScrollView, Text } from 'react-native';

import { Button } from '~/components/ui/button';

import { useAuth } from '~/providers/auth-provider';

export default function Home() {
  const { signOut } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView className="flex flex-1 flex-col gap-4 p-4">
        <Button
          onPress={() => {
            signOut();
          }}>
          <Text className="text-primary-foreground">Sign Out</Text>
        </Button>
      </ScrollView>
    </>
  );
}
