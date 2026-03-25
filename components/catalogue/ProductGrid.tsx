import { Product, Locale } from '@/lib/types/domain';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  locale: Locale;
}

export default function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-charcoal/50 py-12">
        Aucun produit trouvé
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
