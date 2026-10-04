import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, Text } from 'react-native';

import { useThemeColors } from '@/lib/theme';
import { useCropDraftStore } from '@/store/cropDraftStore';

export default function CropLayout() {
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
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'New clip',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              accessibilityRole="button"
              style={{ marginRight: Platform.OS === 'android' ? 16 : 0 }}
            >
              <Text style={{ color: colors.accent, fontSize: 17 }}>Cancel</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="trim" options={{ title: 'Choose 5 seconds' }} />
      <Stack.Screen name="details" options={{ title: 'Add details' }} />
    </Stack>
  );
}
