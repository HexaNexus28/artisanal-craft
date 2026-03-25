'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import type { Locale, Product } from '@/lib/types/domain';

type RecommendationState = 'idle' | 'open' | 'loading' | 'results';

export default function RecommendationWidget() {
  const locale = useLocale() as Locale;
  const [state, setState] = useState<RecommendationState>('idle');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [recommended, setRecommended] = useState<Product[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          budget: parseInt(budget, 10),
          locale,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { message: string; productIds: string[] };
        setAiMessage(data.message);
        const products = data.productIds
          .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);
        setRecommended(products.length > 0 ? products : MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 3));
      } else {
        // Fallback: featured products
        setAiMessage(
          locale === 'fr'
            ? 'Voici nos créations les plus populaires :'
            : locale === 'en'
              ? 'Here are our most popular creations:'
              : 'Mía nuwo si dzi dzɔ ŋutɔ :'
        );
        setRecommended(MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 3));
      }
      setState('results');
    } catch {
      setAiMessage(
        locale === 'fr'
          ? 'Voici nos créations les plus populaires :'
          : 'Here are our most popular creations:'
      );
      setRecommended(MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 3));
      setState('results');
    }
  }

  const labels = {
    fr: {
      trigger: 'Je cherche un cadeau...',
      title: 'Trouvez le cadeau parfait',
      subtitle: 'Notre IA vous aide à choisir',
      occasionLabel: 'Pour quelle occasion ?',
      occasionPlaceholder: 'Ex: anniversaire, mariage, fête des mères...',
      budgetLabel: 'Budget (FCFA)',
      budgetPlaceholder: 'Ex: 15000',
      submit: 'Trouver des idées',
      loading: 'Notre IA réfléchit...',
      back: 'Nouvelle recherche',
      close: 'Fermer',
    },
    en: {
      trigger: "I'm looking for a gift...",
      title: 'Find the perfect gift',
      subtitle: 'Our AI helps you choose',
      occasionLabel: 'What occasion?',
      occasionPlaceholder: 'E.g.: birthday, wedding, mother\'s day...',
      budgetLabel: 'Budget (FCFA)',
      budgetPlaceholder: 'E.g.: 15000',
      submit: 'Find ideas',
      loading: 'Our AI is thinking...',
      back: 'New search',
      close: 'Close',
    },
    ewe: {
      trigger: 'Mele nunana dim...',
      title: 'Di nunana nyui',
      subtitle: 'Mía AI kpɔ ɖe wò ta',
      occasionLabel: 'Ɖe nuka ta?',
      occasionPlaceholder: 'Kpɔɖeŋu: dzigbeze, srɔ̃ɖoɖo...',
      budgetLabel: 'Ga si le asi (FCFA)',
      budgetPlaceholder: 'Kpɔɖeŋu: 15000',
      submit: 'Di susuwo',
      loading: 'Mía AI le susu wɔm...',
      back: 'Didi yeye',
      close: 'Tu',
    },
  };

  const l = labels[locale];

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        className="fixed bottom-6 right-6 z-40 bg-gold text-charcoal px-5 py-3 rounded-full shadow-lg hover:bg-gold/90 transition-all hover:scale-105 font-bold flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {l.trigger}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] bg-cream border-2 border-gold rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-soil text-cream px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold">{l.title}</p>
          <p className="text-cream/70 text-xs">{l.subtitle}</p>
        </div>
        <button
          onClick={() => {
            setState('idle');
            setOccasion('');
            setBudget('');
            setAiMessage('');
            setRecommended([]);
          }}
          className="text-cream/70 hover:text-cream"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto">
        {state === 'open' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {l.occasionLabel}
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder={l.occasionPlaceholder}
                required
                className="w-full px-3 py-2 border border-sand rounded-lg bg-cream text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {l.budgetLabel}
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={l.budgetPlaceholder}
                required
                min={1000}
                className="w-full px-3 py-2 border border-sand rounded-lg bg-cream text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold text-charcoal font-bold py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
            >
              {l.submit}
            </button>
          </form>
        )}

        {state === 'loading' && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
            <p className="text-charcoal/70 text-sm">{l.loading}</p>
          </div>
        )}

        {state === 'results' && (
          <div className="space-y-4">
            {aiMessage && (
              <p className="text-charcoal/80 text-sm bg-sand/30 rounded-lg p-3 leading-relaxed">
                {aiMessage}
              </p>
            )}
            <div className="space-y-3">
              {recommended.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/catalogue/${product.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-sand/50 hover:border-gold transition-colors group"
                >
                  <div className="w-14 h-14 flex-shrink-0 bg-sand/30 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal text-sm truncate group-hover:text-soil transition-colors">
                      {product.name[locale]}
                    </p>
                    <p className="text-soil text-sm font-bold">
                      {product.priceXof.toLocaleString()} FCFA
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                setState('open');
                setAiMessage('');
                setRecommended([]);
              }}
              className="w-full text-center text-sm text-gold hover:text-soil transition-colors py-2"
            >
              {l.back}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
