import { Stack } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View, Text } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '~/utils/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { cn, styles } from '~/utils/utils';

const formScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Auth() {
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function signInWithEmail(data: z.infer<typeof formScheme>) {
    console.log(data);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
  }

  async function signUpWithEmail(data: z.infer<typeof formScheme>) {
    console.log(data);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
  }

  return (
    <View className={cn(styles.screen, 'items-center justify-center')}>
      <Stack.Screen options={{ headerShown: false }} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>CerviScan</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {form.formState.errors.email && <Text>This is required.</Text>}
          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Password" secureTextEntry value={value} onChangeText={onChange} />
            )}
          />
          {form.formState.errors.password && <Text>This is required.</Text>}
          <Button
            label="Sign in"
            onPress={form.handleSubmit(signInWithEmail)}
            disabled={form.formState.isLoading}
          />
          <Button
            label="Sign up"
            onPress={form.handleSubmit(signUpWithEmail)}
            disabled={form.formState.isLoading}
          />
        </CardContent>
      </Card>
    </View>
  );
}
