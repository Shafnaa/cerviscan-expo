import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { Card } from './ui/card';

import { cn } from '~/lib/utils';

type ModelCardProps = {
  id: string;
  is_active: boolean;
  metrics:
    | {
        error: string;
      }
    | {
        specificity: number;
        recall: number;
        precision: number;
        accuracy: number;
        f1_score: number;
      }
    | null;
  parent_model_id: string | null;
  version: number;
};

function ModelCard({ id, is_active, metrics, parent_model_id, version }: ModelCardProps) {
  return (
    <Card className="p-2">
      <Link
        href={{ pathname: `/model/detail/[id]`, params: { id } }}
        className="flex flex-1 flex-row gap-2">
        <View className="flex-1">
          <Text className="text-lg font-bold">{id}</Text>
          <Text className="text-base">
            {version || 'Unknown Version'} {is_active && '(Active)'}
          </Text>
        </View>
      </Link>
    </Card>
  );
}

export default ModelCard;
