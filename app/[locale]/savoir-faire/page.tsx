import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'savoirFaire' });
  return {
    title: t('title'),
    description: t('intro'),
  };
}

export default function SavoirFairePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('savoirFaire');

  const steps = ['selection', 'design', 'assembly', 'finishing'] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-charcoal mb-2">
        {t('title')}
      </h1>
      <p className="text-gold font-display text-xl mb-8">{t('subtitle')}</p>
      <p className="text-charcoal/80 text-lg mb-12 leading-relaxed">
        {t('intro')}
      </p>

      <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
        {t('process')}
      </h2>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={step} className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-soil text-cream flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <p className="text-charcoal/80 pt-2">{t(`steps.${step}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
