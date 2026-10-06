import type { AppLanguage } from './types';

export type * from './types';

export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ['en', 'tr', 'de', 'es'];

export const FALLBACK_LANGUAGE: AppLanguage = 'en';

export const NATIVE_LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  es: 'Español',
};

export function isSupportedLanguage(code: string | null | undefined): code is AppLanguage {
  return !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

export function pickSupportedLanguage(codes: readonly (string | null | undefined)[]): AppLanguage {
  return codes.map((code) => code?.toLowerCase()).find(isSupportedLanguage) ?? FALLBACK_LANGUAGE;
}
