import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CLIP_DURATION, useThemeColors } from '@/lib';
import { useCropDraftStore } from '@/store';

export default function CropLayout() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const reset = useCropDraftStore((s) => s.reset);

  useEffect(() => reset, [reset]);

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerBackTitle: t('common.back'),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('nav.newClip'),
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              accessibilityRole="button"
              style={Platform.OS === 'android' ? { marginRight: 16 } : { paddingHorizontal: 6 }}
            >
              <Text style={{ color: colors.accent, fontSize: 17 }}>{t('common.cancel')}</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="trim"
        options={{ title: t('nav.chooseSeconds', { seconds: CLIP_DURATION }) }}
      />
      <Stack.Screen name="details" options={{ title: t('nav.addDetails') }} />
    </Stack>
  );
}
