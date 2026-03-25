import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const validLocale = locales.includes(requested as typeof locales[number])
    ? (requested as typeof locales[number])
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
