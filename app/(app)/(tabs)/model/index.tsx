import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import ModelCard from '~/components/model-card';
import Spinner from '~/components/spinner';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/auth-provider';

export default function Model() {
  const { authAxios } = useAuth();
  const { colorScheme } = useColorScheme();

  const [models, setModels] = useState<
    | {
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
        selected: boolean;
      }[]
    | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchModels = useCallback(async () => {
    try {
      const response = await authAxios.get('/model', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      setModels(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [authAxios]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchModels();
    } finally {
      setRefreshing(false);
    }
  }, [fetchModels]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return (
    <>
      <Stack.Screen options={{ title: 'Models' }} />
      <ScrollView
        className="flex flex-1 flex-col gap-4 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={NAV_THEME[colorScheme].primary}
            colors={[NAV_THEME[colorScheme].primary]}
          />
        }>
        {models ? models.map((model) => <ModelCard {...model} key={model.id} />) : <Spinner />}
      </ScrollView>
    </>
  );
}
