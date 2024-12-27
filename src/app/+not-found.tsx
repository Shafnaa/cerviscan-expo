import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/Card';
import { cn, styles } from '~/utils/utils';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className={cn(styles.screen, 'items-center justify-center')}>
        <Card>
          <CardHeader>
            <CardTitle>This screen doesn't exist</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={'/'}>
              <Button label="Go to home screen" />
            </Link>
          </CardContent>
        </Card>
      </View>
    </>
  );
}
