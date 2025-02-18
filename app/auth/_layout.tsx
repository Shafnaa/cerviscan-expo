import React from 'react';

import { Redirect, Stack } from 'expo-router';

import Spinner from '~/components/spinner';

import { useAuth } from '~/providers/auth-provider';

function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default AuthLayout;
