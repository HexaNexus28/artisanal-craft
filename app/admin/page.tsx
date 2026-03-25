'use client';

import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function AdminDashboard() {
  const productCount = MOCK_PRODUCTS.length;
  const featuredCount = MOCK_PRODUCTS.filter((p) => p.isFeatured).length;
  const orderCount = 0;

  const stats = [
    {
      label: 'Produits',
      value: productCount,
      href: '/admin/products',
      color: 'bg-gold/10 text-gold border-gold/20',
    },
    {
      label: 'Produits vedettes',
      value: featuredCount,
      href: '/admin/products',
      color: 'bg-forest/10 text-forest border-forest/20',
    },
    {
      label: 'Commandes',
      value: orderCount,
      href: '/admin/orders',
      color: 'bg-soil/10 text-soil border-soil/20',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
        Tableau de bord
      </h1>
      <p className="text-charcoal/60 mb-8">
        Bienvenue dans l&apos;espace d&apos;administration Adodi Studio.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`block rounded-xl border p-6 transition-shadow hover:shadow-md ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-charcoal mb-4">
        Actions rapides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 rounded-xl border border-sand bg-white p-5 hover:border-gold transition-colors"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold text-lg">
            +
          </span>
          <div>
            <p className="font-semibold text-charcoal">Ajouter un produit</p>
            <p className="text-sm text-charcoal/60">
              Nouveau sac, accessoire ou support
            </p>
          </div>
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-3 rounded-xl border border-sand bg-white p-5 hover:border-gold transition-colors"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10 text-forest text-lg">
            L
          </span>
          <div>
            <p className="font-semibold text-charcoal">Voir les produits</p>
            <p className="text-sm text-charcoal/60">
              {productCount} produits dans le catalogue
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
