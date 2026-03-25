import { unstable_setRequestLocale } from 'next-intl/server';
import { getContainer } from '@/lib/container';
import CatalogueClient from './CatalogueClient';
import type { Locale } from '@/lib/types/domain';

export default async function CataloguePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // Load all products using the real service
  const { productService } = getContainer();
  const productsResult = await productService.getAllProducts(locale as Locale);

  const products = productsResult.success ? productsResult.data : [];

  return <CatalogueClient initialProducts={products} locale={locale as Locale} />;
}
