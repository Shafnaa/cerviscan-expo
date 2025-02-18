import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

import * as ImagePicker from 'expo-image-picker';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import Spinner from '~/components/spinner';

import { cn } from '~/lib/utils';

import { useAuth } from '~/providers/auth-provider';

const scanFormScheme = z.object({
  name: z.string().min(3, 'Name is required'),
  dob: z.string().min(3, 'Date of birth is required'),
  image: z.string().min(3, 'Image is required'),
});

export default function Scan() {
  const { authAxios } = useAuth();
  const [result, setResult] = useState<{
    id: string;
    prediction: boolean;
  } | null>(null);

  const scanForm = useForm({
    resolver: zodResolver(scanFormScheme),
    defaultValues: {
      name: '',
      dob: '',
      image: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof scanFormScheme>) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('dob', data.dob);
      formData.append('image', data.image);

      const response = await authAxios.post('/record/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      });

      const { id, prediction } = response.data.data;

      setResult({ id, prediction });

      scanForm.reset();
    } catch (error) {
      console.log(error);

      setResult(null);

      scanForm.setError('root', {
        message: 'An error occurred while processing the image. Please try again.',
      });
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0 && result.assets[0].base64) {
      scanForm.setValue('image', result.assets[0].base64);
    } else {
      alert('No image selected!');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Go Scan' }} />
      <ScrollView className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Scan Form</CardTitle>
            <CardDescription>Upload the VIA image here to be processed.</CardDescription>
          </CardHeader>
          <CardContent className="flex-col gap-4">
            <Controller
              name="name"
              control={scanForm.control}
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="name">
                    Patient Name
                  </Label>
                  <Input
                    placeholder="Patient Name"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="name"
                  />
                  {scanForm.formState.errors.name && (
                    <Text className="text-red-500">{scanForm.formState.errors.name.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              name="dob"
              control={scanForm.control}
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="dob">
                    Date of Birth
                  </Label>
                  <Input
                    placeholder="Patient Name"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="dob"
                  />
                  {scanForm.formState.errors.dob && (
                    <Text className="text-red-500">{scanForm.formState.errors.dob.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              name="image"
              control={scanForm.control}
              render={({ field: { value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="image">
                    VIA Image
                  </Label>
                  <Pressable onPress={pickImage}>
                    {value.length > 3 ? (
                      <Image
                        source={{ uri: 'data:image/jpeg;base64,' + value }}
                        className="aspect-square w-full rounded-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex h-60 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                        <Ionicons name="camera" size={100} color="#5081E2" />
                        <Text className="text-base text-gray-500">Upload Image</Text>
                      </View>
                    )}
                  </Pressable>
                  {scanForm.formState.errors.image && (
                    <Text className="text-red-500">{scanForm.formState.errors.image.message}</Text>
                  )}
                </View>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              className="w-full"
              variant="default"
              onPress={scanForm.handleSubmit(handleSubmit)}
              disabled={scanForm.formState.isSubmitting || !scanForm.formState.isValid}>
              {scanForm.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <Text className="text-primary-foreground">Go Scan</Text>
              )}
            </Button>
            {scanForm.formState.errors.root && (
              <Text className="text-red-500">{scanForm.formState.errors.root.message}</Text>
            )}
          </CardFooter>
        </Card>
        {result && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
              <CardDescription>
                The image has been processed. The result is{' '}
                <Text
                  className={cn(
                    'font-bold',
                    result.prediction ? 'text-red-500' : 'text-green-500'
                  )}>
                  {result.prediction ? 'Abnormal' : 'Normal'}
                </Text>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-col gap-4">
              <View className="flex-col gap-2">
                <Label className="">VIA Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/upload/${result.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Gray Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/gray/${result.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Mask Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/mask/${result.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Segmented Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/segmented/${result.id}.jpg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </>
  );
}
