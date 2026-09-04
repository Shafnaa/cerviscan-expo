import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import AlbumCard from '~/components/album-card';
import Spinner from '~/components/spinner';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/auth-provider';

export default function Album() {
  const { authAxios } = useAuth();
  const { colorScheme } = useColorScheme();

  const [records, setRecords] = useState<
    | {
        id: string;
        patient: {
          name: string;
        };
        model: {
          version: string;
        };
        result_system: boolean;
        result_verification: boolean | null;
      }[]
    | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlbum = useCallback(async () => {
    try {
      const response = await authAxios.get('/record', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      setRecords(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [authAxios]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAlbum();
    } finally {
      setRefreshing(false);
    }
  }, [fetchAlbum]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  return (
    <>
      <Stack.Screen options={{ title: 'Album' }} />
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
        {records ? records.map((record) => <AlbumCard {...record} key={record.id} />) : <Spinner />}
      </ScrollView>
    </>
  );
}
