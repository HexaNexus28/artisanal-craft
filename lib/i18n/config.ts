export const locales = ['fr', 'en', 'ewe'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';
