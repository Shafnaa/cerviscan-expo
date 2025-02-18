import React from 'react';

import { Link, Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

import Spinner from '~/components/spinner';

import { useAuth } from '~/providers/auth-provider';

const loginFormScheme = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(8, 'Password is required'),
  confirmPassword: z.string().min(8, 'Confirm Password is required'),
});

export default function Login() {
  const { signUp } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginFormScheme),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof loginFormScheme>) => {
    try {
      if (data.password !== data.confirmPassword) {
        loginForm.setError('confirmPassword', {
          message: 'Passwords do not match',
        });

        return;
      }

      signUp(data);
    } catch (error) {
      console.log('Handle Submit Error:', error);

      loginForm.setError('root', {
        message: 'Something went wrong',
      });

      return;
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
            <CardTitle>Register</CardTitle>
            <CardDescription>Register to your account</CardDescription>
          </CardHeader>
          <CardContent className="flex-col gap-4">
            <Controller
              control={loginForm.control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="username">
                    Username
                  </Label>
                  <Input
                    placeholder="Usename"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="username"
                  />
                  {loginForm.formState.errors.username && (
                    <Text className="text-red-500">
                      {loginForm.formState.errors.username.message}
                    </Text>
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
            <Controller
              control={loginForm.control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2">
                  <Label className="" nativeID="confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    placeholder="********"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="confirm-password"
                  />
                  {loginForm.formState.errors.confirmPassword && (
                    <Text className="text-red-500">
                      {loginForm.formState.errors.confirmPassword.message}
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
              <Text>Already have an account?</Text>
              <Link href="/auth" className="text-blue-500 underline">
                Login
              </Link>
            </View>
          </CardFooter>
        </Card>
      </View>
    </>
  );
}
