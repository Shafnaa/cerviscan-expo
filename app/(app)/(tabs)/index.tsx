import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <View className="px-4">
                <Image
                  source={require('~/assets/icon.png')}
                  className="h-24 w-36"
                  resizeMode="contain"
                />
              </View>
            );
          },
          headerTitle: () => {
            return null;
          },
          headerRight: () => {
            return (
              <View className="flex-1 flex-row justify-end px-4">
                <Link href="/(app)/profile" className="flex">
                  <Avatar className="aspect-square h-12 w-12" alt="Profile">
                    <AvatarFallback>
                      <Ionicons name="person" size={24} />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </View>
            );
          },
        }}
      />
      <ScrollView className="p-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>About CerviScan</CardTitle>
            <CardDescription>
              CerviScan is an innovative application designed for the early detection of cervical
              cancer using Visual Inspection with Acetic Acid (VIA) images. This detection is
              powered by a machine learning model, ensuring accurate and efficient results.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <Text className="text-base text-primary">
              This project is supervised by{' '}
              <Text className="font-bold">Prof. Dr. Eng. Retno Supriyanti, S.T., M.T.</Text> and
              developed by a team of Electrical Engineering students from Universitas Jenderal
              Soedirman:
            </Text>
            <View className="flex flex-col gap-2">
              <Text className="text-base text-primary">1. M. Saujana Shafi Kehaulani</Text>
              <Text className="text-base text-primary">2. Fillipus Aditya Nugroho</Text>
              <Text className="text-base text-primary">3. Tegar Dwi Agung</Text>
              <Text className="text-base text-primary">4. M. Rizqy Maulana</Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </>
  );
}
