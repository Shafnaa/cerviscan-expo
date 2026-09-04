import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import Spinner from '~/components/spinner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { useAuth } from '~/providers/auth-provider';

const verificationFormScheme = z.object({
  result_verification: z.boolean(),
  note: z.string().optional(),
});

function Details() {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const [data, setData] = React.useState<{
    id: string;
    patient: {
      id: string;
      name: string;
    } | null;
    model: {
      id: string;
      version: string;
    } | null;
    result_system: boolean;
    result_verification: boolean | null;
    note: string | null;
    images: {
      original: string;
      mask: string;
      segmented: string;
    };
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { authAxios } = useAuth();

  const verificationForm = useForm<z.infer<typeof verificationFormScheme>>({
    resolver: zodResolver(verificationFormScheme),
    defaultValues: {
      result_verification: false,
      note: '',
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await authAxios.get(`/record/${id}`);

      setData(response.data.data);
      verificationForm.reset({
        result_verification: response.data.data.result_verification ?? false,
        note: response.data.data.note ?? '',
      });
    } catch (error) {
      console.error(error);
    }
  }, [authAxios, id, verificationForm]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data: z.infer<typeof verificationFormScheme>) => {
    try {
      const formData = new FormData();

      formData.append('result_verification', data.result_verification.toString());
      if (data.note) {
        formData.append('note', data.note);
      }

      const response = await authAxios.post(`/record/${id}/verify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <ScrollView
        className="flex flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={NAV_THEME[colorScheme].primary}
            colors={[NAV_THEME[colorScheme].primary]}
          />
        }>
        {data ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{data.patient?.name || id}</CardTitle>
              <CardDescription>{data.model?.version || 'Unknown Model'}</CardDescription>
              <CardDescription>
                The result is{' '}
                <Text
                  className={cn(
                    'font-bold',
                    data.result_system ? 'text-red-500' : 'text-green-500'
                  )}>
                  {data.result_system ? 'Abnormal' : 'Normal'}
                </Text>
                .
                {data.result_verification !== null && (
                  <>
                    {' '}
                    The verification result is{' '}
                    <Text
                      className={cn(
                        'font-bold',
                        data.result_verification ? 'text-red-500' : 'text-green-500'
                      )}>
                      {data.result_verification ? 'Abnormal' : 'Normal'}
                    </Text>
                    .
                  </>
                )}
              </CardDescription>
              {data.note && (
                <CardDescription className="mt-2 italic">Note: {data.note}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-col gap-4">
              <View className="flex-col gap-2">
                <Label className="">VIA Image</Label>
                <Image
                  source={{
                    uri: data.images?.original,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Mask Image</Label>
                <Image
                  source={{
                    uri: data.images?.mask,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Segmented Image</Label>
                <Image
                  source={{
                    uri: data.images?.segmented,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <View className="w-full flex-col gap-2">
                <Label>Verification Result</Label>
                <View className="flex-row gap-2">
                  <Button
                    className="flex-1"
                    variant={verificationForm.watch('result_verification') ? 'default' : 'outline'}
                    onPress={() => verificationForm.setValue('result_verification', true)}>
                    <Text
                      className={
                        verificationForm.watch('result_verification')
                          ? 'text-primary-foreground'
                          : ''
                      }>
                      Abnormal
                    </Text>
                  </Button>
                  <Button
                    className="flex-1"
                    variant={!verificationForm.watch('result_verification') ? 'default' : 'outline'}
                    onPress={() => verificationForm.setValue('result_verification', false)}>
                    <Text
                      className={
                        !verificationForm.watch('result_verification')
                          ? 'text-primary-foreground'
                          : ''
                      }>
                      Normal
                    </Text>
                  </Button>
                </View>
              </View>

              <View className="w-full flex-col gap-2">
                <Label>Verification Note (optional)</Label>
                <Input
                  placeholder="Add a note..."
                  value={verificationForm.watch('note')}
                  onChangeText={(text) => verificationForm.setValue('note', text)}
                />
              </View>

              <Button
                className="w-full"
                variant="default"
                onPress={() => verificationForm.handleSubmit(handleSubmit)()}
                disabled={verificationForm.formState.isSubmitting}>
                {verificationForm.formState.isSubmitting ? (
                  <Spinner />
                ) : (
                  <Text className="text-primary-foreground">Save</Text>
                )}
              </Button>
            </CardFooter>
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
