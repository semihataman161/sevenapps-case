import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useUpperCase() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return useCallback((text: string) => text.toLocaleUpperCase(language), [language]);
}
