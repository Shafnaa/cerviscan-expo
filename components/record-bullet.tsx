import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from './ui/card';

import { cn } from '~/lib/utils';

type RecordBulletProps = {
  id: string;
  patient: {
    name: string;
  } | null;
  model: {
    version: string;
  } | null;
  result_system: boolean;
  result_verification: boolean | null;
  selected: boolean;
  onChange: (selected: boolean) => void;
};

function RecordBullet({
  id,
  patient,
  model,
  result_system,
  result_verification,
  selected,
  onChange,
}: RecordBulletProps) {
  function handlePress() {
    onChange(!selected);
  }

  return (
    <Pressable onPress={handlePress}>
      <Card
        className={cn('flex-row items-center gap-3 p-2', selected && 'border-2 border-primary')}>
        {/* Checkbox */}
        <View
          className={cn(
            'h-6 w-6 items-center justify-center rounded border',
            selected && 'border-primary bg-primary'
          )}>
          {selected && <Check size={16} color="white" />}
        </View>

        {/* Content */}
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
      </Card>
    </Pressable>
  );
}

export default RecordBullet;
