import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-display text-xl mb-2">Adodi Studio</p>
        <p className="text-sand text-sm">{t('madeWith')}</p>
        <p className="text-sand/60 text-xs mt-4">
          &copy; {year} Adodi Studio. {t('rights')}.
        </p>
        <Link
          href="/admin/login"
          className="inline-block mt-4 text-sand/30 text-xs hover:text-sand/60 transition-colors"
        >
          Administration
        </Link>
      </div>
    </footer>
  );
}
