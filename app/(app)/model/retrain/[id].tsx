import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import AlbumCard from '~/components/album-card';
import Spinner from '~/components/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { useAuth } from '~/providers/auth-provider';

function Retrain() {
  const { id } = useLocalSearchParams();
  const [records, setRecords] = React.useState<
    | {
        id: string;
        patient: {
          name: string;
        } | null;
        model: {
          version: string;
        } | null;
        result_system: boolean;
        result_verification: boolean | null;
      }[]
    | null
  >(null);
  const [data, setData] = React.useState<{
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
  } | null>(null);

  const { authAxios } = useAuth();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxios.get(`/model/${id}`);

        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRecords = async () => {
      try {
        const response = await authAxios.get(`/record`);

        setRecords(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchRecords();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <ScrollView className="flex flex-1 p-4">
        {data ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{data.is_active ? 'Active' : 'Inactive'}</CardTitle>
              <CardDescription>{data.version || 'Unknown Version'}</CardDescription>
            </CardHeader>
            <CardContent className="flex-col gap-4">
              {records ? (
                records.map((record) => <AlbumCard {...record} key={record.id} />)
              ) : (
                <Spinner />
              )}
            </CardContent>
            <CardFooter />
          </Card>
        ) : (
          <View className="flex flex-1 items-center justify-center">
            <Spinner />
          </View>
        )}
      </ScrollView>
    </>
  );
}

export default Retrain;
