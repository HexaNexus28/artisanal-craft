import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/container';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { productId?: string; locale?: string };
    const { productId, locale } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const validLocale: Locale = locales.includes(locale as Locale)
      ? (locale as Locale)
      : 'fr';

    const { productService, aiService, whatsappService, orderService } = getContainer();

    const productResult = await productService.getProductBySlug(productId, validLocale);
    if (!productResult.success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const configResult = await whatsappService.getConfig();
    const shopName = configResult.success ? configResult.data.shopName : 'Adodi Studio';

    const messageResult = await aiService.generateWhatsAppMessage(
      productResult.data,
      validLocale,
      shopName
    );

    if (!messageResult.success) {
      return NextResponse.json({ error: 'AI unavailable' }, { status: 503 });
    }

    const urlResult = await whatsappService.getWhatsAppUrl(messageResult.data);
    if (!urlResult.success) {
      return NextResponse.json({ error: 'Failed to build URL' }, { status: 500 });
    }

    // Fire and forget — log the WhatsApp intent
    orderService.createWhatsAppOrder(productId).catch(console.error);

    return NextResponse.json({
      message: messageResult.data,
      url: urlResult.data,
    });
  } catch (e) {
    console.error('WhatsApp message route error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
