import React from 'react';

import { Image, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';

import Spinner from '~/components/spinner';

import { cn } from '~/lib/utils';

import { useAuth } from '~/providers/auth-provider';

function Details() {
  const { id } = useLocalSearchParams();
  const [data, setData] = React.useState<{
    id: string;
    name: string;
    dob: string;
    prediction: boolean;
  } | null>(null);

  const { authAxios } = useAuth();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxios.get(`/record/${id}`);

        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <ScrollView className="flex flex-1 p-4">
        {data ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
              <CardDescription>{data.dob}</CardDescription>
              <CardDescription>
                The result is{' '}
                <Text
                  className={cn('font-bold', data.prediction ? 'text-red-500' : 'text-green-500')}>
                  {data.prediction ? 'Abnormal' : 'Normal'}
                </Text>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-col gap-4">
              <View className="flex-col gap-2">
                <Label className="">VIA Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/upload/${data.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Gray Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/gray/${data.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Mask Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/mask/${data.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Segmented Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/segmented/${data.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ) : (
          <View className="flex flex-1 items-center justify-center">
            <Spinner />
          </View>
        )}
      </ScrollView>
    </>
  );
}

export default Details;
