import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import AlbumCard from '~/components/album-card';
import RecordBullet from '~/components/record-bullet';
import Spinner from '~/components/spinner';
import { Button } from '~/components/ui/button';
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

const retrainFormScheme = z.object({
  recordIds: z.array(z.string()).min(1, 'At least one record must be selected for retraining'),
});

function Detail() {
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

  const retrainForm = useForm<z.infer<typeof retrainFormScheme>>({
    resolver: zodResolver(retrainFormScheme),
    defaultValues: {
      recordIds: [],
    },
  });

  const { authAxios } = useAuth();

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

  React.useEffect(() => {
    fetchData();
    fetchRecords();
  }, []);

  const handleSubmit = async (data: z.infer<typeof retrainFormScheme>) => {
    try {
      const response = await authAxios.post(
        `/model/${id}/retrain`,
        {
          record_ids: data.recordIds,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async () => {
    try {
      const response = await authAxios.post(
        `/model/${id}/activate`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      console.log(response.data);

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <ScrollView className="flex flex-1 p-4">
        {data ? (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{data.id}</CardTitle>
              <CardDescription>
                {data.version || 'Unknown Version'} | {data.is_active ? 'Active' : 'Inactive'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-col gap-4">
              {records ? (
                records.map((record) => {
                  const selectedRecordIds = retrainForm.watch('recordIds');
                  return (
                    <RecordBullet
                      {...record}
                      selected={selectedRecordIds.includes(record.id)}
                      onChange={(checked) => {
                        if (checked) {
                          retrainForm.setValue('recordIds', [...selectedRecordIds, record.id]);
                        } else {
                          retrainForm.setValue(
                            'recordIds',
                            selectedRecordIds.filter((id) => id !== record.id)
                          );
                        }

                        retrainForm.trigger('recordIds');
                      }}
                      key={record.id}
                    />
                  );
                })
              ) : (
                <Spinner />
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                className="w-full"
                variant="default"
                onPress={retrainForm.handleSubmit(handleSubmit)}
                disabled={retrainForm.formState.isSubmitting || !retrainForm.formState.isValid}>
                {retrainForm.formState.isSubmitting ? (
                  <Spinner />
                ) : (
                  <Text className="text-primary-foreground">Retrain</Text>
                )}
              </Button>
              <Button
                className="w-full"
                variant="default"
                onPress={handleActivate}
                disabled={data.is_active}>
                <Text className="text-primary-foreground">Activate</Text>
              </Button>
            </CardFooter>
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

export default Detail;
