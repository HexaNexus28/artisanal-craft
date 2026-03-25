'use client';

import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function AdminProductsPage() {
  const products = MOCK_PRODUCTS;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            Produits
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {products.length} produits au total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold/90 transition-colors"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-sand overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-charcoal/5 text-charcoal/70 text-left">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Categorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium text-center">Disponible</th>
              <th className="px-4 py-3 font-medium text-center">Vedette</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-3 font-medium text-charcoal">
                  {product.name.fr}
                </td>
                <td className="px-4 py-3 text-charcoal/70">
                  <span className="inline-flex items-center rounded-full bg-sand/50 px-2.5 py-0.5 text-xs font-medium text-charcoal/80">
                    {product.category?.name.fr ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/80">
                  {product.priceXof.toLocaleString()} FCFA
                </td>
                <td className="px-4 py-3 text-center">
                  {product.isAvailable ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-forest/10 text-forest text-xs">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-soil/10 text-soil text-xs">
                      ✗
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {product.isFeatured && (
                    <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                      Vedette
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex items-center rounded-md bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-charcoal/10 transition-colors"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="block bg-white rounded-xl border border-sand p-4 hover:border-gold transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal truncate">
                  {product.name.fr}
                </p>
                <p className="text-sm text-charcoal/60 mt-0.5">
                  {product.category?.name.fr ?? '—'} — {product.priceXof.toLocaleString()} FCFA
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {product.isFeatured && (
                  <span className="inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                    Vedette
                  </span>
                )}
                {product.isAvailable ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-forest" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-soil" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
