import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import Spinner from '~/components/spinner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Combobox } from '~/components/ui/combobox';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { useAuth } from '~/providers/auth-provider';

type Patient = {
  id: string;
  name: string;
};

const scanFormScheme = z.object({
  patientId: z.string().min(3, 'Please select a patient from the list'),
  imageExist: z.boolean().refine((v) => v === true, 'Image is required'),
});

export default function Scan() {
  const { authAxios } = useAuth();
  const [result, setResult] = useState<{
    id: string;
    prediction: boolean;
  } | null>(null);
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [patients, setPatients] = useState<Patient[] | null>(null);

  const scanForm = useForm({
    resolver: zodResolver(scanFormScheme),
    defaultValues: {
      patientId: '',
      imageExist: false,
    },
  });

  const patientItems = React.useMemo(
    () => patients?.map((p) => ({ value: p.id, label: p.name })) ?? [],
    [patients]
  );

  const patientId = scanForm.watch('patientId');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await authAxios.get('/user');
        setPatients(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (data: z.infer<typeof scanFormScheme>) => {
    try {
      const formData = new FormData();

      formData.append('patient_id', data.patientId);

      if (!imageFile) {
        scanForm.setError('root', {
          message: 'Please select an image to upload.',
        });
        return;
      }

      const localUri = imageFile.uri;
      const fileName = imageFile.fileName ?? localUri.split('/').pop() ?? 'upload.jpeg';
      const fileType = imageFile.mimeType || 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'android' ? localUri : localUri.replace('file://', ''),
        name: fileName,
        type: fileType,
      } as any);

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
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageFile(result.assets[0]);
      scanForm.setValue('imageExist', true);
      scanForm.trigger('imageExist');
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
            <View className="flex-col gap-2">
              <Label nativeID="patientId">Patient</Label>
              <Combobox
                items={patientItems}
                value={patientId}
                disabled={!patients}
                placeholder="Search patient by name..."
                onValueChange={(v) => scanForm.setValue('patientId', v, { shouldValidate: true })}
              />
              {scanForm.formState.errors.patientId && (
                <Text className="text-red-500">{scanForm.formState.errors.patientId.message}</Text>
              )}
            </View>
            <Controller
              name="imageExist"
              control={scanForm.control}
              render={({ field: { value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="image">
                    VIA Image
                  </Label>
                  <Pressable onPress={pickImage}>
                    {value ? (
                      <Image
                        source={{ uri: imageFile?.uri }}
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
                  {scanForm.formState.errors.imageExist && (
                    <Text className="text-red-500">
                      {scanForm.formState.errors.imageExist.message}
                    </Text>
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
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/upload/${result.id}.jpeg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Mask Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/mask/${result.id}.jpeg`,
                  }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col gap-2">
                <Label className="">Segmented Image</Label>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/segmented/${result.id}.jpeg`,
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
