import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getContainer } from '@/lib/container';
import ProductGrid from '@/components/catalogue/ProductGrid';
import type { Locale } from '@/lib/types/domain';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: `Adodi Studio — ${t('heroTitle')}`,
    description: t('heroSubtitle'),
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  
  // Get featured products using the real service
  const { productService } = getContainer();
  const featuredResult = await productService.getFeaturedProducts(locale as Locale);
  
  // Handle the Result<T, E> pattern
  const featured = featuredResult.success ? featuredResult.data : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-soil text-cream py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            Fait à la main. Fait au Togo.
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Créations uniques en perles artisanales
          </h1>
          <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Découvrez nos sacs, accessoires et supports fabriqués avec passion à Lomé
          </p>
          <Link
            href={`${locale === 'fr' ? '' : `/${locale}`}/catalogue`}
            className="inline-block bg-gold text-charcoal font-bold py-3 px-8 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Voir le catalogue
          </Link>
        </div>

        {/* Kente-inspired geometric separator */}
        <div className="absolute bottom-0 left-0 right-0 h-4 flex">
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-forest" />
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-soil" />
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-forest" />
          <div className="flex-1 bg-gold" />
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-charcoal text-center mb-12">
          Créations mises en avant
        </h2>
        {featured.length > 0 ? (
          <ProductGrid products={featured} locale={locale as Locale} />
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal/60">
              Aucun produit disponible pour le moment. Revenez nous voir bientôt !
            </p>
            <Link
              href={`${locale === 'fr' ? '' : `/${locale}`}/catalogue`}
              className="inline-block mt-4 text-gold hover:text-gold/80 underline"
            >
              Voir tous les produits
            </Link>
          </div>
        )}
      </section>

      {/* Story teaser */}
      <section className="bg-sand/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-4">
            Notre savoir-faire
          </h2>
          <p className="text-charcoal/70 text-lg mb-8">
            Chaque pièce est créée à la main dans notre atelier de Lomé, 
            alliant tradition et modernité pour des créations uniques.
          </p>
          <Link
            href={`${locale === 'fr' ? '' : `/${locale}`}/savoir-faire`}
            className="inline-block border-2 border-soil text-soil font-bold py-2 px-6 rounded-lg hover:bg-soil hover:text-cream transition-colors"
          >
            Découvrir notre histoire
          </Link>
        </div>
      </section>
    </div>
  );
}
