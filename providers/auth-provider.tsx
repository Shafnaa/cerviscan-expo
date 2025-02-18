import { useContext, createContext, type PropsWithChildren } from 'react';
import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

import { useStorageState } from '~/hooks/use-storage-state';

type AuthContextType = {
  signIn: ({ username, password }: { username: string; password: string }) => void;
  signUp: ({
    username,
    password,
    confirmPassword,
  }: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => void;
  signOut: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isAuthenticated: boolean;
  publicAxios: AxiosInstance;
  authAxios: AxiosInstance;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  getAccessToken: () => null,
  getRefreshToken: () => null,
  isAuthenticated: false,
  publicAxios: axios.create(),
  authAxios: axios.create(),
  isLoading: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const publicAxios = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
  });

  const authAxios = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getAccessToken = () => {
    if (!session) {
      return null;
    }

    try {
      const { accessToken } = JSON.parse(session);

      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);

      return null;
    }
  };

  const getRefreshToken = () => {
    if (!session) {
      return null;
    }

    try {
      const { refreshToken } = JSON.parse(session);

      return refreshToken;
    } catch (error) {
      console.error('Error getting refresh token:', error);

      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({ username, password }: { username: string; password: string }) => {
          try {
            const formData = new FormData();

            formData.append('username', username);
            formData.append('password', password);

            const response = await publicAxios.post('/auth/login', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
              },
            });

            const { access_token, refresh_token } = response.data.data;

            setSession(
              JSON.stringify({
                accessToken: access_token,
                refreshToken: refresh_token,
              })
            );
          } catch (error) {
            console.error('Error signing in:', error);
          }
        },
        signUp: async ({
          username,
          password,
          confirmPassword,
        }: {
          username: string;
          password: string;
          confirmPassword: string;
        }) => {
          try {
            const formData = new FormData();

            formData.append('username', username);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);

            const response = await publicAxios.post('/auth/register', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
              },
            });

            const { access_token, refresh_token } = response.data.data;

            setSession(
              JSON.stringify({
                accessToken: access_token,
                refreshToken: refresh_token,
              })
            );
          } catch (error) {
            console.error('Error signing up:', error);
          }
        },
        signOut: () => {
          setSession(null);
        },
        getAccessToken,
        getRefreshToken,
        isAuthenticated: !!session,
        publicAxios,
        authAxios,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
