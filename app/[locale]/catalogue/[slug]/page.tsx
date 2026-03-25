import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/types/domain';
import { getContainer } from '@/lib/container';
import { getStaticContainer } from '@/lib/container.static';
import { locales } from '@/lib/i18n/config';
import WhatsAppButton from '@/components/ai/WhatsAppButton';
import ProductGrid from '@/components/catalogue/ProductGrid';

export async function generateStaticParams() {
  const { productService } = getStaticContainer();
  const result = await productService.getAllProducts('fr');
  const products = result.success ? result.data : [];
  return products.flatMap((product) =>
    locales.map((locale) => ({ locale, slug: product.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { productService } = getStaticContainer();
  const result = await productService.getProductBySlug(slug, locale as Locale);
  if (!result.success) return {};

  const product = result.data;
  const loc = locale as Locale;
  return {
    title: product.metaTitle?.[loc] ?? product.name[loc],
    description: product.metaDescription?.[loc] ?? product.description?.[loc],
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const loc = locale as Locale;

  const { productService } = getContainer();
  const result = await productService.getProductBySlug(slug, loc);

  if (!result.success) {
    notFound();
  }

  const product = result.data;
  const t = await getTranslations({ locale, namespace: 'product' });

  // Related products: same category, exclude current
  let related: typeof product[] = [];
  if (product.category) {
    const catResult = await productService.getProductsByCategory(product.category.slug, loc);
    if (catResult.success) {
      related = catResult.data.filter((p) => p.id !== product.id).slice(0, 3);
    }
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[loc],
    description: product.description?.[loc],
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.priceXof,
      priceCurrency: 'XOF',
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-charcoal/50 mb-8">
          <Link href={`/${locale}/catalogue`} className="hover:text-gold">
            Catalogue
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gold">{product.category.name[loc]}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span>{product.name[loc]}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-sand/30 rounded-lg overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name[loc]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sand">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-square relative bg-sand/30 rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name[loc]} — ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.category && (
              <p className="text-gold text-sm font-medium mb-2">
                {product.category.name[loc]}
              </p>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {product.name[loc]}
            </h1>

            <p className="text-3xl font-bold text-soil mb-6">
              {product.priceXof.toLocaleString()} FCFA
            </p>

            {product.stockNote && (
              <div className="bg-sand/30 border border-sand rounded-lg px-4 py-3 mb-6 text-sm text-charcoal/70">
                {product.stockNote}
              </div>
            )}

            {product.description && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-2">
                  {t('description')}
                </h2>
                <p className="text-charcoal/70 leading-relaxed">
                  {product.description[loc]}
                </p>
              </div>
            )}

            {/* WhatsApp CTA — AI powered */}
            <WhatsAppButton
              productId={product.slug}
              locale={locale}
              fallbackPhone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
            />

            <p className="text-xs text-charcoal/40 mt-3 text-center">
              {locale === 'fr'
                ? 'Un message personnalisé sera généré par IA pour faciliter votre commande'
                : locale === 'en'
                  ? 'An AI-generated personalized message will be created for your order'
                  : 'AI ata gbea ɖe wò taɖodzinu me'}
            </p>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-8">
              {t('relatedProducts')}
            </h2>
            <ProductGrid products={related} locale={loc} />
          </section>
        )}
      </div>
    </>
  );
}
