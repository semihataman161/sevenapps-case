import { Ionicons } from '@expo/vector-icons';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useUpperCase } from '@/i18n/useUpperCase';
import { useThemeColors } from '@/lib/theme';

type IconName = keyof typeof Ionicons.glyphMap;

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  const upper = useUpperCase();
  const rows = Children.toArray(children);
  return (
    <View>
      <Text className="mb-2 ml-4 text-xs font-semibold tracking-wider text-ink-muted">
        {upper(title)}
      </Text>
      <View className="overflow-hidden rounded-3xl bg-surface-muted dark:bg-surface-dark-muted">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View className="ml-4 h-px bg-black/5 dark:bg-white/10" /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

type OptionRowProps = {
  label: string;
  hint?: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
};

export function OptionRow({ label, hint, icon, selected, onPress }: OptionRowProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityHint={hint}
      className="min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-black/5 dark:active:bg-white/5"
    >
      {icon ? <Ionicons name={icon} size={20} color={colors.accent} /> : null}
      <View className="flex-1">
        <Text className="text-base text-ink dark:text-white">{label}</Text>
        {hint ? <Text className="mt-0.5 text-xs text-ink-muted">{hint}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
    </Pressable>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-h-14 flex-row items-center justify-between px-4 py-3">
      <Text className="text-base text-ink dark:text-white">{label}</Text>
      <Text className="text-base text-ink-muted">{value}</Text>
    </View>
  );
}
