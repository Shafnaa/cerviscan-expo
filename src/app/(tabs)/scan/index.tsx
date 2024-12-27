import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '~/components/ui/Button';
import * as ImagePicker from 'expo-image-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/Card';

import { cn, fetchBlob, styles } from '~/utils/utils';
import { z } from 'zod';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

export default function Scan() {
  const [imageUri, setImageUri] = React.useState<string>();
  const [grayImage, setGrayImage] = React.useState<string>();
  const [segmentedImage, setSegmentedImage] = React.useState<string>();

  const processImage = async () => {
    console.log('Processing image...');

    if (!imageUri) {
      alert('Please upload an image first!');
      return;
    }

    const data = new FormData();

    data.append('file', imageUri);

    console.log('Uploading image...');

    try {
      const fileReaderInstance = new FileReader();

      // const grayResult = await fetchBlob('http://192.168.1.12:5000/api/preprocessing', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: data,
      // });
      const [grayResult, segmentResult] = await Promise.all([
        fetchBlob('http://192.168.1.12:5000/api/preprocessing', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        }),
        fetchBlob('http://192.168.1.12:5000/api/segmentation', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        }),
      ]);

      fileReaderInstance.readAsDataURL(grayResult);

      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        console.log(base64data);
        setGrayImage(base64data?.toString());
      };

      fileReaderInstance.readAsDataURL(segmentResult);

      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        console.log(base64data);
        setSegmentedImage(base64data?.toString());
      };

      // setGrayImage(URL.createObjectURL(grayResult));
      // setSegmentedImage(URL.createObjectURL(segmentResult));
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    console.log('Image processed!');
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
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Go Scan' }} />
      <ScrollView className={cn(styles.screen, 'gap-8')}>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Scan</CardTitle>
            <CardDescription>Upload the VIA image here to be processed.</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <Pressable onPress={pickImage}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
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
          </CardContent>
          <CardFooter className="flex-1 justify-end">
            <Button
              label="Process Image"
              onPress={() => {
                processImage();
              }}
            />
          </CardFooter>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              The result of the image processing will be displayed here.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex flex-col gap-2">
              <Text className="text-lg font-bold text-primary">Grayscale Image</Text>
              {grayImage ? (
                <Image
                  source={{ uri: grayImage }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex h-60 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                  <Ionicons name="camera" size={100} color="#5081E2" />
                  <Text className="text-base text-gray-500">No Image</Text>
                </View>
              )}
            </View>
            <View className="flex flex-col gap-2">
              <Text className="text-lg font-bold text-primary">Segmented Image</Text>
              {segmentedImage ? (
                <Image
                  source={{ uri: segmentedImage }}
                  className="aspect-square w-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex h-60 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                  <Ionicons name="camera" size={100} color="#5081E2" />
                  <Text className="text-base text-gray-500">No Image</Text>
                </View>
              )}
            </View>
            <View className="flex flex-col gap-2">
              <Text className="text-lg font-bold text-primary">Result</Text>
              <Text className="text-base text-gray-500">The result will be displayed here.</Text>
            </View>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Fill out the information of the patient to save the result.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4"></CardContent>
          <CardFooter className="flex-1 justify-end">
            <Button label="Save Result" onPress={processImage} />
          </CardFooter>
        </Card>
      </ScrollView>
    </>
  );
}
