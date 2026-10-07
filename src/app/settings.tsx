import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { InfoRow, OptionRow, ScreenHeader, SettingsSection } from '@/components/specifics';
import { getDeviceLanguage, NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/i18n';
import { useSettingsStore } from '@/services';
import { usePick, type LanguagePreference, type ThemePreference } from '@/stores';

const THEME_OPTIONS = [
  { value: 'system', labelKey: 'settings.themeSystem' },
  { value: 'light', labelKey: 'settings.themeLight' },
  { value: 'dark', labelKey: 'settings.themeDark' },
] as const;

function selectionTick() {
  Haptics.selectionAsync().catch(() => {});
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, language, setTheme, setLanguage } = usePick(useSettingsStore, [
    'theme',
    'language',
    'setTheme',
    'setLanguage',
  ]);

  const chooseTheme = (value: ThemePreference) => {
    selectionTick();
    setTheme(value);
  };
  const chooseLanguage = (value: LanguagePreference) => {
    selectionTick();
    setLanguage(value);
  };

  return (
    <View className="flex-1">
      <ScreenHeader title={t('nav.settings')} />
      <ScrollView contentContainerClassName="gap-12 px-5 pb-16 pt-6">
        <SettingsSection title={t('settings.appearance')}>
          {THEME_OPTIONS.map((option) => (
            <OptionRow
              key={option.value}
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
    </View>
  );
}
