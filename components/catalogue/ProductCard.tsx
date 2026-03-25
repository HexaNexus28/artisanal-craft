import Image from 'next/image';
import Link from 'next/link';
import { Product, Locale } from '@/lib/types/domain';

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const name = product.name[locale];
  const price = product.priceXof.toLocaleString();
  const image = product.images[0];

  return (
    <Link
      href={`${locale === 'fr' ? '' : `/${locale}`}/catalogue/${product.slug}`}
      className="group block bg-cream rounded-lg overflow-hidden border border-sand/50 hover:border-gold/50 transition-colors"
    >
      <div className="aspect-square relative bg-sand/30 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sand">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-charcoal group-hover:text-soil transition-colors">
          {name}
        </h3>
        {product.category && (
          <p className="text-xs text-gold mt-1">{product.category.name[locale]}</p>
        )}
        <p className="mt-2 text-soil font-bold">{price} FCFA</p>
      </div>
    </Link>
  );
}
