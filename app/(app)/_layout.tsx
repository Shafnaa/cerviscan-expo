import { Redirect, Stack } from 'expo-router';
import React from 'react';

import Spinner from '~/components/spinner';

import { useAuth } from '~/providers/auth-provider';

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default AppLayout;
