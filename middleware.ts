import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    // Match all pathnames except Next.js internals and static files
    '/((?!api|_next|_vercel|admin|.*\\..*).*)',
  ],
};
