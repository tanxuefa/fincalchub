export const locales = ['en', 'es', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

export const defaultLocale: Locale = 'en';

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first as Locale)) return first as Locale;
  return defaultLocale;
}
