import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { Card } from './ui/card';

import { cn } from '~/lib/utils';

type AlbumCardProps = {
  id: string;
  patient: {
    name: string;
  } | null;
  model: {
    version: string;
  } | null;
  result_system: boolean;
  result_verification: boolean | null;
};

function AlbumCard({ id, patient, model, result_system, result_verification }: AlbumCardProps) {
  return (
    <Card className="p-2">
      <Link
        href={{ pathname: `/record/detail/[id]`, params: { id } }}
        className="flex flex-1 flex-row gap-2">
        <View className="flex-1">
          <Text className="text-lg font-bold">{patient?.name || id}</Text>
          <Text className="text-base">{model?.version || 'Unknown Model'}</Text>
          <View className="flex-row items-center gap-2">
            <Text
              className={cn(
                'text-base font-bold',
                result_system ? 'text-red-500' : 'text-green-500'
              )}>
              {result_system ? 'Abnormal' : 'Normal'}
            </Text>
            {result_verification !== null && (
              <>
                <Text className="text-base font-bold">|</Text>
                <Text
                  className={cn(
                    'text-base font-bold',
                    result_verification ? 'text-red-500' : 'text-green-500'
                  )}>
                  {result_verification ? 'Abnormal' : 'Normal'}
                </Text>
              </>
            )}
          </View>
        </View>
      </Link>
    </Card>
  );
}

export default AlbumCard;
