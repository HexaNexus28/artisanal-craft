'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/lib/i18n/config';

const localeLabels: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  ewe: 'Éwé',
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    // Replace current locale prefix in path
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as typeof locales[number])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/'));
  }

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            locale === loc
              ? 'bg-gold text-cream font-bold'
              : 'text-charcoal hover:text-gold'
          }`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
