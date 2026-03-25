'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import '../globals.css';

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: 'D' },
  { href: '/admin/products', label: 'Produits', icon: 'P' },
  { href: '/admin/orders', label: 'Commandes', icon: 'C' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setChecking(false);

      if (!session?.user && !isLoginPage) {
        router.replace('/admin/login');
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user && !isLoginPage) {
          router.replace('/admin/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const fontLinks = (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#C9901A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Adodi Admin" />
    </>
  );

  // Login page — clean layout, no auth check needed
  if (isLoginPage) {
    return (
      <html lang="fr">
        <head>{fontLinks}</head>
        <body className="font-body antialiased">{children}</body>
      </html>
    );
  }

  // Checking auth — show loading
  if (checking) {
    return (
      <html lang="fr">
        <head>{fontLinks}</head>
        <body className="min-h-screen bg-charcoal font-body antialiased flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
            <p className="text-white/50 text-sm">Vérification...</p>
          </div>
        </body>
      </html>
    );
  }

  // Not authenticated — redirect happening, show nothing
  if (!user) {
    return (
      <html lang="fr">
        <head>{fontLinks}</head>
        <body className="min-h-screen bg-charcoal font-body antialiased" />
      </html>
    );
  }

  // Authenticated — full admin layout
  return (
    <html lang="fr">
      <head>{fontLinks}</head>
      <body className="min-h-screen bg-cream text-charcoal font-body antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-64 md:flex-col bg-charcoal text-white">
            <div className="flex h-16 items-center px-6 border-b border-white/10">
              <Link href="/admin" className="text-gold font-bold text-xl tracking-wide">
                Adodi Admin
              </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-gold/20 text-gold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-xs font-bold">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-white/10 space-y-2">
              <p className="px-3 text-xs text-white/30 truncate">{user.email}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/50 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
              >
                Se déconnecter
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                &larr; Retour au site
              </Link>
            </div>
          </aside>

          {/* Mobile header */}
          <div className="flex flex-1 flex-col">
            <header className="md:hidden flex items-center justify-between h-14 px-4 bg-charcoal text-white">
              <Link href="/admin" className="text-gold font-bold text-lg">
                Adodi Admin
              </Link>
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-xs font-medium ${
                        isActive(item.href) ? 'text-gold' : 'text-white/70'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <button
                  onClick={handleLogout}
                  className="text-xs text-white/40 hover:text-red-400 transition-colors"
                >
                  Sortir
                </button>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
