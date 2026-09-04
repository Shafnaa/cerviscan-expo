import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';
import { z } from 'zod';

import Spinner from '~/components/spinner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useAuth } from '~/providers/auth-provider';

const loginFormScheme = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password is required'),
});

export default function Login() {
  const { signIn } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginFormScheme),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof loginFormScheme>) => {
    try {
      signIn(data);
    } catch (error) {
      console.log('Handle Submit Error:', error);

      loginForm.setError('root', {
        message: 'Something went wrong',
      });
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <View className="flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex-col items-center justify-center gap-4">
            <Image
              source={require('~/assets/icon.png')}
              className="h-16 w-full"
              resizeMode="contain"
            />
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>
          <CardContent className="flex-col gap-4">
            <Controller
              control={loginForm.control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="email">
                    Email
                  </Label>
                  <Input
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="email"
                  />
                  {loginForm.formState.errors.email && (
                    <Text className="text-red-500">{loginForm.formState.errors.email.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={loginForm.control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="password">
                    Password
                  </Label>
                  <Input
                    placeholder="********"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="password"
                  />
                  {loginForm.formState.errors.password && (
                    <Text className="text-red-500">
                      {loginForm.formState.errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Button
              className="w-full"
              variant="default"
              onPress={loginForm.handleSubmit(handleSubmit)}
              disabled={loginForm.formState.isSubmitting || !loginForm.formState.isValid}>
              {loginForm.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <Text className="text-primary-foreground">Login</Text>
              )}
            </Button>
            {loginForm.formState.errors.root && (
              <Text className="text-red-500">{loginForm.formState.errors.root.message}</Text>
            )}
          </CardContent>
          <CardFooter>
            <View className="flex-1 flex-row items-center justify-between">
              <Text>Don't have an account?</Text>
              <Link href="/auth/register" className="text-blue-500 underline">
                Register
              </Link>
            </View>
          </CardFooter>
        </Card>
      </View>
    </>
  );
}
