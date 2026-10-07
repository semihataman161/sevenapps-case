import '@/global.css';

import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type ErrorBoundaryProps,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorScreen } from '@/components/specifics';
import { queryClient, useThemeColors } from '@/lib';
import { initPreferences, registerCssInterop, sweepOrphanedFilesIfDue } from '@/setup';
import { usePick, useVideoStore } from '@/stores';

registerCssInterop();
initPreferences();
SplashScreen.preventAutoHideAsync();

export const unstable_settings = { anchor: 'index' };

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorScreen onRetry={retry} />;
}

export default function RootLayout() {
  const { status, hydrate } = usePick(useVideoStore, ['status', 'hydrate']);
  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const fontsReady = fontsLoaded || !!fontError;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (fontsReady && (status === 'ready' || status === 'error')) SplashScreen.hideAsync();
  }, [fontsReady, status]);

  useEffect(() => {
    if (status !== 'ready') return;
    sweepOrphanedFilesIfDue().catch((error) =>
      console.warn('Could not clean up orphaned files', error),
    );
  }, [status]);

  if (!fontsReady) return null;

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
  const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...baseTheme,
        colors: { ...baseTheme.colors, primary: colors.text, background: colors.background },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="videos/[id]/edit" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
