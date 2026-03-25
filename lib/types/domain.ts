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
