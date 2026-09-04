import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Button } from '~/components/ui/button';
import { useAuth } from '~/providers/auth-provider';

export default function Home() {
  const { signOut, authAxios } = useAuth();

  const [user, setUser] = React.useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAxios.get('/user/me', {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });

        setUser(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView className="flex flex-1 flex-col gap-4 p-4">
        <View className="items-center gap-4">
          <Text className="text-lg font-bold">Your QR Code</Text>

          {user?.id && <QRCode value={user.id} />}

          <Text className="text-center">{user?.id}</Text>

          <Button onPress={signOut}>
            <Text className="text-primary-foreground">Sign Out</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
