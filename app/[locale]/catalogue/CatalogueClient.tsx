'use client';

import { useState } from 'react';
import CategoryFilter from '@/components/catalogue/CategoryFilter';
import ProductGrid from '@/components/catalogue/ProductGrid';
import RecommendationWidget from '@/components/ai/RecommendationWidget';
import type { Locale, Product } from '@/lib/types/domain';

interface CatalogueClientProps {
  initialProducts: Product[];
  locale: Locale;
}

export default function CatalogueClient({ initialProducts, locale }: CatalogueClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? initialProducts.filter((p) => p.category?.slug === activeCategory)
    : initialProducts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-charcoal mb-8">
        Catalogue
      </h1>
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProductGrid products={filtered} locale={locale} />
      {filtered.length === 0 && (
        <p className="text-center text-charcoal/50 py-12">Aucun produit trouvé dans cette catégorie.</p>
      )}

      {/* AI Recommendation Widget */}
      <RecommendationWidget />
    </div>
  );
}
