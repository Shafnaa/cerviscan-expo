import React, { useEffect, useState } from 'react';

import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import AlbumCard from '~/components/album-card';
import Spinner from '~/components/spinner';

import { useAuth } from '~/providers/auth-provider';

export default function Album() {
  const { authAxios } = useAuth();

  const [records, setRecords] = useState<
    | {
        id: string;
        name: string;
        dob: string;
        prediction: boolean;
      }[]
    | null
  >(null);

  useEffect(() => {
    const fetchAlbum = async () => {
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
    };

    fetchAlbum();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Album' }} />
      <ScrollView className="flex flex-1 flex-col gap-4 p-4">
        {records ? records.map((record) => <AlbumCard {...record} key={record.id} />) : <Spinner />}
      </ScrollView>
    </>
  );
}
