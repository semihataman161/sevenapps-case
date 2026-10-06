import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { InfoRow, OptionRow, SettingsSection } from '@/components';
import { getDeviceLanguage, NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/i18n';
import { useSettingsStore, type LanguagePreference, type ThemePreference } from '@/store';

const THEME_OPTIONS = [
  { value: 'system', icon: 'phone-portrait-outline', labelKey: 'settings.themeSystem' },
  { value: 'light', icon: 'sunny-outline', labelKey: 'settings.themeLight' },
  { value: 'dark', icon: 'moon-outline', labelKey: 'settings.themeDark' },
] as const;

function selectionTick() {
  Haptics.selectionAsync().catch(() => {});
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const chooseTheme = (value: ThemePreference) => {
    selectionTick();
    setTheme(value);
  };
  const chooseLanguage = (value: LanguagePreference) => {
    selectionTick();
    setLanguage(value);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-8 px-5 pb-12 pt-4"
    >
      <SettingsSection title={t('settings.appearance')}>
        {THEME_OPTIONS.map((option) => (
          <OptionRow
            key={option.value}
            icon={option.icon}
            label={t(option.labelKey)}
            hint={option.value === 'system' ? t('settings.themeSystemHint') : undefined}
            selected={theme === option.value}
            onPress={() => chooseTheme(option.value)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title={t('settings.language')}>
        <OptionRow
          label={t('settings.languageSystem')}
          hint={t('settings.languageSystemHint', {
            language: NATIVE_LANGUAGE_NAMES[getDeviceLanguage()],
          })}
          selected={language === 'system'}
          onPress={() => chooseLanguage('system')}
        />
        {SUPPORTED_LANGUAGES.map((code) => {
          const nativeName = NATIVE_LANGUAGE_NAMES[code];
          const localizedName = t(`languages.${code}`);
          return (
            <OptionRow
              key={code}
              label={nativeName}
              hint={localizedName !== nativeName ? localizedName : undefined}
              selected={language === code}
              onPress={() => chooseLanguage(code)}
            />
          );
        })}
      </SettingsSection>

      <SettingsSection title={t('settings.about')}>
        <InfoRow label={t('settings.version')} value={Constants.expoConfig?.version ?? '—'} />
      </SettingsSection>
    </ScrollView>
  );
}
