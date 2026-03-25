# CLAUDE.md — Felicia's Bead Shop (Adodi / Lomé Craft)

## Project Identity

**Project name:** Adodi Studio (placeholder — name TBD by client)
**Tagline:** Fait à la main. Fait au Togo.
**Client:** Artisan créatrice de sacs à perles, accessoires et supports — Lomé, Togo
**Developer:** Yawo Zoglo
**Target launch:** Phase 1 in ~3 weeks

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database + Storage | Supabase (PostgreSQL + Supabase Storage) |
| Auth | Supabase Auth (admin only) |
| i18n | next-intl (FR / EN — Éwé placeholders only, native review pre-launch) |
| AI features | Claude API (claude-sonnet-4-20250514) |
| Deployment | Vercel |
| Domain | TBD |

---

## Architectural Pattern — Repository + Service Layer

This project enforces a strict 3-layer separation. **Never bypass this.**

```
[ Next.js Route / Server Component ]
          │
          ▼
   [ Service Layer ]        ← business logic, validation, orchestration
          │
          ▼
  [ Repository Layer ]      ← all Supabase calls live here, nowhere else
          │
          ▼
     [ Supabase ]           ← DB + Storage, never called directly from components or routes
```

### Layer responsibilities

**Repository** (`lib/repositories/`)
- One file per domain entity: `ProductRepository`, `OrderRepository`, `CategoryRepository`, `ConfigRepository`
- Only layer allowed to import `supabase` client
- No business logic — pure data access: `findById`, `findAll`, `create`, `update`, `softDelete`
- Returns typed domain objects, never raw Supabase responses
- All errors thrown as typed `RepositoryError`

**Service** (`lib/services/`)
- One file per domain: `ProductService`, `OrderService`, `AIService`, `WhatsAppService`
- Imports repositories, never Supabase directly
- Contains all business rules: availability checks, AI prompt building, WhatsApp URL generation, order logging
- Returns `Result<T, AppError>` — never throws to the caller
- Orchestrates multi-repository operations (e.g. create order + snapshot product atomically)

**Route / Component**
- Imports services only
- Zero data logic — only UI concerns and HTTP response shaping
- Server Components call services directly (no API round-trip when possible)
- Client Components call `/api/` routes which call services

### Concrete file map

```
lib/
├── repositories/
│   ├── base.repository.ts          # Abstract base: error handling, type mapping
│   ├── product.repository.ts       # ProductRepository
│   ├── category.repository.ts      # CategoryRepository
│   ├── order.repository.ts         # OrderRepository
│   └── config.repository.ts        # ConfigRepository (shop_config k/v)
├── services/
│   ├── product.service.ts          # ProductService: list, getBySlug, featured, search
│   ├── order.service.ts            # OrderService: createFromWhatsApp, updateStatus
│   ├── ai.service.ts               # AIService: generateWhatsAppMessage, recommendProducts
│   └── whatsapp.service.ts         # WhatsAppService: buildUrl, formatMessage
├── supabase/
│   ├── client.ts                   # Browser client (singleton)
│   ├── server.ts                   # Server client (per-request, cookies)
│   └── types.ts                    # supabase gen types output — DO NOT EDIT MANUALLY
├── types/
│   ├── domain.ts                   # Domain types: Product, Category, Order, ShopConfig
│   ├── errors.ts                   # AppError, RepositoryError, ServiceError
│   └── result.ts                   # Result<T, E> type
├── i18n/
│   └── config.ts
├── container.ts                    # DI container — single instantiation point
└── whatsapp.ts                     # Pure util: buildWhatsAppUrl (no Supabase)
```

### Repository interface contract

```typescript
// lib/types/result.ts
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

// lib/repositories/base.repository.ts
export abstract class BaseRepository {
  protected abstract tableName: string;

  protected handleError(error: unknown, context: string): never {
    throw new RepositoryError(
      `[${this.tableName}] ${context}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// lib/repositories/product.repository.ts
export class ProductRepository extends BaseRepository {
  protected tableName = 'products';

  async findAll(locale: Locale): Promise<Product[]>
  async findBySlug(slug: string, locale: Locale): Promise<Product | null>
  async findFeatured(locale: Locale, limit?: number): Promise<Product[]>
  async findByCategory(categorySlug: string, locale: Locale): Promise<Product[]>
  async create(data: CreateProductDTO): Promise<Product>
  async update(id: string, data: UpdateProductDTO): Promise<Product>
  async softDelete(id: string): Promise<void>   // sets is_available = false, never hard deletes
}
```

### Service interface contract

```typescript
// lib/services/product.service.ts
export class ProductService {
  constructor(private repo: ProductRepository, private categoryRepo: CategoryRepository) {}

  async getFeaturedProducts(locale: Locale): Promise<Result<Product[]>>
  async getProductBySlug(slug: string, locale: Locale): Promise<Result<Product>>
  async getProductsByCategory(categorySlug: string, locale: Locale): Promise<Result<Product[]>>
}

// lib/services/order.service.ts
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository
  ) {}

  // Logs WhatsApp intent + snapshots product atomically
  async createWhatsAppOrder(productId: string, customerInfo?: Partial<OrderInput>): Promise<Result<Order>>
}

// lib/services/ai.service.ts
export class AIService {
  async generateWhatsAppMessage(product: Product, locale: Locale): Promise<Result<string>>
  async recommendProducts(occasion: string, budget: number, locale: Locale, products: Product[]): Promise<Result<RecommendationResult>>
}
```

### Dependency Injection — manual container (no framework)

```typescript
// lib/container.ts — server-side only, instantiated per request
import { createServerClient } from '@/lib/supabase/server'
import { ProductRepository } from '@/lib/repositories/product.repository'
import { ProductService } from '@/lib/services/product.service'

export function getContainer() {
  const supabase = createServerClient()

  const productRepo  = new ProductRepository(supabase)
  const categoryRepo = new CategoryRepository(supabase)
  const orderRepo    = new OrderRepository(supabase)
  const configRepo   = new ConfigRepository(supabase)

  return {
    productService:   new ProductService(productRepo, categoryRepo),
    orderService:     new OrderService(orderRepo, productRepo),
    aiService:        new AIService(),
    whatsappService:  new WhatsAppService(configRepo),
  }
}
```

**Usage in Server Component:**
```typescript
// app/[locale]/catalogue/[slug]/page.tsx
import { getContainer } from '@/lib/container'

export default async function ProductPage({ params }) {
  const { productService } = getContainer()
  const result = await productService.getProductBySlug(params.slug, params.locale)
  if (!result.success) notFound()
  return <ProductDetail product={result.data} />
}
```

**Usage in API route:**
```typescript
// app/api/ai/whatsapp-message/route.ts
import { getContainer } from '@/lib/container'

export async function POST(req: Request) {
  const { productId, locale } = await req.json()
  const { productService, aiService, orderService } = getContainer()

  const productResult = await productService.getProductBySlug(productId, locale)
  if (!productResult.success) return Response.json({ error: 'Not found' }, { status: 404 })

  const messageResult = await aiService.generateWhatsAppMessage(productResult.data, locale)
  if (!messageResult.success) return Response.json({ error: 'AI unavailable' }, { status: 503 })

  // Fire and forget — non-blocking
  orderService.createWhatsAppOrder(productId).catch(console.error)

  return Response.json({ message: messageResult.data })
}
```

---

## Project Structure

```
/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                        # Home — SSG
│   │   ├── catalogue/
│   │   │   ├── page.tsx                    # Catalogue — SSR with filters
│   │   │   └── [slug]/page.tsx             # Product detail — SSG + ISR
│   │   ├── savoir-faire/page.tsx           # Artisan story — static
│   │   ├── contact/page.tsx                # Contact + WhatsApp CTA
│   │   └── layout.tsx
│   ├── api/
│   │   ├── products/route.ts
│   │   ├── ai/
│   │   │   ├── whatsapp-message/route.ts
│   │   │   └── recommend/route.ts
│   │   └── orders/route.ts
│   └── admin/
│       ├── products/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       └── layout.tsx                      # Auth guard
├── components/
│   ├── ui/
│   ├── catalogue/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── CategoryFilter.tsx
│   ├── ai/
│   │   ├── RecommendationWidget.tsx        # 'use client'
│   │   └── WhatsAppButton.tsx              # 'use client'
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LocaleSwitcher.tsx
├── lib/                                    # See Architecture section above
├── messages/
│   ├── fr.json                             # Source of truth
│   ├── en.json
│   └── ewe.json                            # Placeholders — pending native review
├── public/images/
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql
└── CLAUDE.md
```

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- 001_initial_schema.sql

create table categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,   -- 'sacs' | 'supports' | 'accessoires'
  name          jsonb not null,         -- { "fr": "Sacs", "en": "Bags", "ewe": "" }
  display_order integer default 0
);

create table products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  category_id      uuid references categories(id) on delete set null,
  name             jsonb not null,       -- { fr, en, ewe }
  description      jsonb,
  price_xof        integer not null,
  images           text[] not null default '{}',
  is_available     boolean default true,
  is_featured      boolean default false,
  stock_note       text,
  meta_title       jsonb,
  meta_description jsonb,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create table orders (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references products(id) on delete set null,
  product_snapshot jsonb not null,       -- snapshot survives product edits
  customer_name    text,
  customer_phone   text,
  note             text,
  status           text default 'pending'
    check (status in ('pending','confirmed','in_progress','delivered','cancelled')),
  created_at       timestamptz default now()
);

create table shop_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

insert into shop_config (key, value) values
  ('whatsapp_number',       '+22890000000'),
  ('availability_note',     'Je prends actuellement des commandes. Délai moyen : 7 jours.'),
  ('shop_name',             'Adodi Studio'),
  ('max_concurrent_orders', '5');

-- RLS
alter table products    enable row level security;
alter table categories  enable row level security;
alter table orders      enable row level security;
alter table shop_config enable row level security;

create policy "Public read products"   on products    for select using (true);
create policy "Public read categories" on categories  for select using (true);
create policy "Public read config"     on shop_config for select using (true);

create policy "Admin all products"     on products    for all using (auth.role() = 'authenticated');
create policy "Admin all categories"   on categories  for all using (auth.role() = 'authenticated');
create policy "Admin all orders"       on orders      for all using (auth.role() = 'authenticated');
create policy "Admin all config"       on shop_config for all using (auth.role() = 'authenticated');

create policy "Public insert orders"   on orders      for insert with check (true);
```

---

## Domain Types

```typescript
// lib/types/domain.ts

export type Locale = 'fr' | 'en' | 'ewe';

export type LocalizedString = { fr: string; en: string; ewe: string };

export type Category = {
  id: string;
  slug: 'sacs' | 'supports' | 'accessoires';
  name: LocalizedString;
  displayOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  category: Category | null;
  name: LocalizedString;
  description: LocalizedString | null;
  priceXof: number;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  stockNote: string | null;
  metaTitle: LocalizedString | null;
  metaDescription: LocalizedString | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  productId: string | null;
  productSnapshot: Product;
  customerName: string | null;
  customerPhone: string | null;
  note: string | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';
  createdAt: Date;
};

export type ShopConfig = {
  whatsappNumber: string;
  availabilityNote: string;
  shopName: string;
  maxConcurrentOrders: number;
};

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'> & {
  categoryId: string | null;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export type OrderInput = Pick<Order, 'customerName' | 'customerPhone' | 'note'>;
```

---

## AI Features

### 1. Smart WhatsApp Message Generator
**Endpoint:** `POST /api/ai/whatsapp-message`
**Input:** `{ productId: string, locale: Locale }`
**Fallback:** if Claude API fails → return pre-written message from `messages/{locale}.json` key `whatsapp.fallback_message`

```typescript
// AIService — system + user prompt
const systemPrompt = `
Tu es l'assistante de ${shopName}, artisane togolaise qui fabrique des produits à la main à Lomé.
Génère uniquement le message WhatsApp — aucun commentaire autour.
Ton : chaleureux, simple, humain. Max 3 phrases.
`;

const userPrompt = `
Produit : "${product.name[locale]}"
Prix : ${product.priceXof.toLocaleString()} FCFA
${product.stockNote ? `Note : ${product.stockNote}` : ''}
Langue cible : ${locale}
Le client doit mentionner le produit et demander la disponibilité.
`;
```

### 2. Product Recommendation Widget
**Endpoint:** `POST /api/ai/recommend`
**Input:** `{ occasion: string, budget: number, locale: Locale }`
**Flow:** loads all available products via ProductService → passes as context to AIService (no extra DB call)
**Output:** `{ message: string, productIds: string[] }`
**Fallback:** return top 3 featured products

### 3. Availability Badge (no AI)
**Source:** `ShopConfig.availabilityNote` via ConfigRepository
**Cache:** `next: { revalidate: 3600 }` on the fetch — max 1 reload/hour
**Display:** static badge on every product card

---

## SEO

```typescript
// generateMetadata pattern — product pages
export async function generateMetadata({ params }): Promise<Metadata> {
  const { productService } = getContainer()
  const result = await productService.getProductBySlug(params.slug, params.locale)
  if (!result.success) return {}
  const p = result.data
  return {
    title: p.metaTitle?.[params.locale] ?? p.name[params.locale],
    description: p.metaDescription?.[params.locale] ?? p.description?.[params.locale],
    openGraph: { images: p.images[0] ? [{ url: p.images[0] }] : [] },
  }
}

// JSON-LD — injected in product page <head>
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name[locale],
  "image": product.images,
  "offers": {
    "@type": "Offer",
    "price": product.priceXof,
    "priceCurrency": "XOF",
    "availability": product.isAvailable
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock"
  }
}
```

**Target keywords (FR):** `sacs à perles Togo`, `bijoux artisanaux Lomé`, `artisanat togolais fait main`, `cadeau africain original`, `commander sac perles Lomé WhatsApp`

---

## Design System

```css
:root {
  --color-soil:     #8B4513;
  --color-gold:     #C9901A;
  --color-cream:    #F5EDD6;
  --color-forest:   #2D5016;
  --color-charcoal: #1A1A1A;
  --color-sand:     #E8D5A3;
}
```

**Typography:** Cormorant Garamond (display) + DM Sans (body) + Noto Sans (Éwé character support)

**Rules:** mobile-first 375px, no pure white backgrounds, kente geometric separators, scroll fade-ins only, `prefers-reduced-motion` respected.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

---

## Phase Roadmap

### Phase 1 — MVP (Weeks 1–3)
- [ ] Next.js scaffold + Tailwind + next-intl + strict tsconfig
- [ ] `lib/types/` — domain types, Result, errors
- [ ] Repository scaffold: Base + Product + Category + Config (read-only first)
- [ ] Service scaffold: ProductService + WhatsAppService
- [ ] Supabase migration + seed
- [ ] Home page (hero, featured, story teaser)
- [ ] Catalogue page (grid, category filter)
- [ ] Product detail page (gallery, WhatsApp CTA)
- [ ] AIService: WhatsApp message generator + fallback
- [ ] OrderService: createWhatsAppOrder
- [ ] Savoir-faire page
- [ ] SEO: generateMetadata + JSON-LD + sitemap + robots
- [ ] Vercel deploy + custom domain

### Phase 2 — E-commerce (if traction)
- [ ] OrderRepository: full CRUD + status transitions
- [ ] Admin UI: product management + order dashboard
- [ ] Payment: Stripe (diaspora) + Kkiapay / Paydunya (Togo)
- [ ] AIService: recommendation widget
- [ ] Email notifications (Resend)
- [ ] Éwé translations: native speaker review

---

## Coding Rules for Claude Code

1. **Never call Supabase outside a Repository** — `supabase.from(...)` in a component, service, or route is a hard violation
2. **Never throw from a Service** — always return `Result<T, AppError>`
3. **No `any` types** — TypeScript strict mode throughout
4. **Repositories return domain types** — never expose raw Supabase row shapes outside `lib/repositories/`
5. **Server Components by default** — `'use client'` only for event handlers and hooks
6. **Audit before fix** — report what will change and why before writing code
7. **No hard deletes** — `is_available = false` for products, `status = 'cancelled'` for orders
8. **One migration per change** — never modify existing migration files
9. **`supabase gen types` after every migration** — never edit `lib/supabase/types.ts` manually
10. **All AI calls require fallback** — if API unavailable, degrade gracefully, never crash

---

*Last updated: March 2026 — Yawo Zoglo*