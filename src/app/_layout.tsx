import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HeaderBackButton } from '@/components/specifics';
import { queryClient, useThemeColors } from '@/lib';
import { initPreferences, registerCssInterop } from '@/setup';
import { useVideoStore } from '@/store';

registerCssInterop();
initPreferences();
SplashScreen.preventAutoHideAsync();

export const unstable_settings = { anchor: 'index' };

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
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = useThemeColors();
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
          headerBackTitle: t('common.back'),
          headerLeft:
            Platform.OS === 'android'
              ? ({ canGoBack }) => <HeaderBackButton canGoBack={canGoBack} />
              : undefined,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: t('nav.diary'), headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="videos/[id]/index" options={{ title: '' }} />
        <Stack.Screen
          name="videos/[id]/edit"
          options={{
            presentation: 'modal',
            title: t('nav.editDetails'),
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: '' }} />
        <Stack.Screen
          name="settings"
          options={{
            title: t('nav.settings'),
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
