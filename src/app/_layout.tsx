import '@/global.css';
import '@/lib/interop';

import { QueryClientProvider, useIsMutating } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/lib/queryClient';
import { useThemeColors } from '@/lib/theme';
import { useVideoStore } from '@/store/videoStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const status = useVideoStore((s) => s.status);
  const hydrate = useVideoStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status === 'ready' || status === 'error') SplashScreen.hideAsync();
  }, [status]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const isCropping = useIsMutating({ mutationKey: ['videos', 'crop'] }) > 0;
  const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...baseTheme,
        colors: { ...baseTheme.colors, primary: colors.accent, background: colors.background },
      }}
    >
      <Stack
        screenOptions={{
          headerTintColor: colors.accent,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Video Diary',
            headerLargeTitle: true,
            headerLargeTitleShadowVisible: false,
          }}
        />
        <Stack.Screen name="video/[id]/index" options={{ title: '', headerBackTitle: 'Diary' }} />
        <Stack.Screen
          name="video/[id]/edit"
          options={{ presentation: 'modal', title: 'Edit details' }}
        />
        <Stack.Screen
          name="crop"
          options={{ presentation: 'modal', headerShown: false, gestureEnabled: !isCropping }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
