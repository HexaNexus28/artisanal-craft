import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/container';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      occasion?: string;
      budget?: number;
      locale?: string;
    };

    const { occasion, budget, locale } = body;

    if (!occasion || typeof occasion !== 'string') {
      return NextResponse.json({ error: 'occasion required' }, { status: 400 });
    }
    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json({ error: 'valid budget required' }, { status: 400 });
    }

    const validLocale: Locale = locales.includes(locale as Locale)
      ? (locale as Locale)
      : 'fr';

    const { productService, aiService } = getContainer();

    const productsResult = await productService.getAllProducts(validLocale);
    if (!productsResult.success) {
      return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }

    const result = await aiService.recommendProducts(
      occasion,
      budget,
      validLocale,
      productsResult.data
    );

    if (!result.success) {
      return NextResponse.json({ error: 'Recommendation failed' }, { status: 503 });
    }

    return NextResponse.json(result.data);
  } catch (e) {
    console.error('Recommendation route error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
