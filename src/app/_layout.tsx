import { useEffect } from 'react';
import '../../global.css';

import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { useSession } from '~/utils/atom';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(tabs)/index',
};

export default function RootLayout() {
  const [session, setSession] = useSession();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!session) {
      if (router.canGoBack()) router.dismissAll();
      router.replace('/auth');
    } else {
      if (router.canGoBack()) router.dismissAll();
      router.replace('/(tabs)');
    }
  }, [session]);

  useFocusEffect(() => {
    if (!session) {
      if (router.canGoBack()) router.dismissAll();
      router.push('/auth');
    }
  });

  return (
    <JotaiProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </JotaiProvider>
  );
}
