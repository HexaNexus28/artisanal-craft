'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  // Only prefix non-default locales (fr is default, as-needed)
  const prefix = locale === 'fr' ? '' : `/${locale}`;

  const links = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/catalogue`, label: t('catalogue') },
    { href: `${prefix}/savoir-faire`, label: t('savoirFaire') },
    { href: `${prefix}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`${prefix}/`} className="font-display text-2xl font-bold text-soil">
          Adodi Studio
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-charcoal hover:text-gold transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-charcoal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-cream border-t border-sand px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-charcoal hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <LocaleSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
