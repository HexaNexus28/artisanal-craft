'use client';

import { useTranslations } from 'next-intl';

interface CategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

const categories = ['sacs', 'supports', 'accessoires'] as const;

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const t = useTranslations('catalogue');

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          activeCategory === null
            ? 'bg-soil text-cream'
            : 'bg-sand/50 text-charcoal hover:bg-sand'
        }`}
      >
        {t('allCategories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            activeCategory === cat
              ? 'bg-soil text-cream'
              : 'bg-sand/50 text-charcoal hover:bg-sand'
          }`}
        >
          {t(`categories.${cat}`)}
        </button>
      ))}
    </div>
  );
}
