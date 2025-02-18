import React from 'react';

import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { Card } from './ui/card';

import { cn } from '~/lib/utils';

type AlbumCardProps = {
  id: string;
  name: string;
  dob: string;
  prediction: boolean;
};

function AlbumCard({ id, name, dob, prediction }: AlbumCardProps) {
  return (
    <Card className="p-2">
      <Link
        href={{ pathname: `/details/[id]`, params: { id: id } }}
        className="flex flex-1 flex-row gap-2">
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/static/process/upload/${id}.jpg`,
          }}
          className="aspect-square w-24 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-base">{dob}</Text>
          <Text
            className={cn('text-base font-bold', prediction ? 'text-red-500' : 'text-green-500')}>
            {prediction ? 'Abnormal' : 'Normal'}
          </Text>
        </View>
      </Link>
    </Card>
  );
}

export default AlbumCard;
