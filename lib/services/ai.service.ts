import Anthropic from '@anthropic-ai/sdk';
import { Product } from '@/lib/types/domain';
import { Result, ok, err } from '@/lib/types/result';
import { AppError } from '@/lib/types/errors';
import type { Locale } from '@/lib/i18n/config';

export class AIService {
  private client: Anthropic | null = null;

  private getClient(): Anthropic | null {
    if (!process.env.ANTHROPIC_API_KEY) return null;
    if (!this.client) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    return this.client;
  }

  async generateWhatsAppMessage(
    product: Product,
    locale: Locale,
    shopName: string = 'Adodi Studio'
  ): Promise<Result<string>> {
    const client = this.getClient();
    if (!client) {
      return ok(this.getFallbackMessage(product, locale));
    }

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: `Tu es l'assistante de ${shopName}, artisane togolaise qui fabrique des produits à la main à Lomé.\nGénère uniquement le message WhatsApp — aucun commentaire autour.\nTon : chaleureux, simple, humain. Max 3 phrases.`,
        messages: [
          {
            role: 'user',
            content: `Produit : "${product.name[locale]}"\nPrix : ${product.priceXof.toLocaleString()} FCFA\n${product.stockNote ? `Note : ${product.stockNote}` : ''}\nLangue cible : ${locale}\nLe client doit mentionner le produit et demander la disponibilité.`,
          },
        ],
      });

      const text = message.content[0];
      if (text.type === 'text') {
        return ok(text.text.trim());
      }

      return ok(this.getFallbackMessage(product, locale));
    } catch (e) {
      console.error('AI WhatsApp message generation failed:', e);
      return ok(this.getFallbackMessage(product, locale));
    }
  }

  async recommendProducts(
    occasion: string,
    budget: number,
    locale: Locale,
    products: Product[]
  ): Promise<Result<{ message: string; productIds: string[] }>> {
    const client = this.getClient();

    // Fallback: return top 3 featured or first 3
    if (!client) {
      const featured = products.filter((p) => p.isFeatured).slice(0, 3);
      const fallback = featured.length > 0 ? featured : products.slice(0, 3);
      return ok({
        message: '',
        productIds: fallback.map((p) => p.id),
      });
    }

    try {
      const productList = products
        .map((p) => `- ID: ${p.id} | ${p.name[locale]} | ${p.priceXof} FCFA | ${p.category?.name[locale] ?? ''}`)
        .join('\n');

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `Tu es l'assistante d'une artisane togolaise. Recommande des produits en fonction de l'occasion et du budget. Réponds en JSON: { "message": "...", "productIds": ["id1", "id2"] }. Max 3 produits. Message en ${locale}, 2-3 phrases max.`,
        messages: [
          {
            role: 'user',
            content: `Occasion: ${occasion}\nBudget: ${budget} FCFA\n\nProduits disponibles:\n${productList}`,
          },
        ],
      });

      const text = message.content[0];
      if (text.type === 'text') {
        const parsed = JSON.parse(text.text) as { message: string; productIds: string[] };
        return ok(parsed);
      }

      return err(new AppError('Unexpected AI response format'));
    } catch (e) {
      console.error('AI recommendation failed:', e);
      const fallback = products.filter((p) => p.isFeatured).slice(0, 3);
      return ok({
        message: '',
        productIds: (fallback.length > 0 ? fallback : products.slice(0, 3)).map((p) => p.id),
      });
    }
  }

  private getFallbackMessage(product: Product, locale: Locale): string {
    const name = product.name[locale];
    const price = product.priceXof.toLocaleString();

    switch (locale) {
      case 'fr':
        return `Bonjour ! Je suis intéressé(e) par "${name}" à ${price} FCFA. Est-il encore disponible ?`;
      case 'en':
        return `Hello! I'm interested in "${name}" at ${price} FCFA. Is it still available?`;
      case 'ewe':
        return `Aloha! Me dzi dzɔ le "${name}" ŋu, eƒe nuxɔa enye ${price} FCFA. Esia ke le asi me?`;
    }
  }
}
