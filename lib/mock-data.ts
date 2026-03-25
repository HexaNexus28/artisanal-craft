import { Product, Category } from '@/lib/types/domain';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-sacs',
    slug: 'sacs',
    name: { fr: 'Sacs', en: 'Bags', ewe: 'Azetɔwo' },
    displayOrder: 1,
  },
  {
    id: 'cat-supports',
    slug: 'supports',
    name: { fr: 'Supports', en: 'Stands', ewe: 'Agbalẽwo' },
    displayOrder: 2,
  },
  {
    id: 'cat-accessoires',
    slug: 'accessoires',
    name: { fr: 'Accessoires', en: 'Accessories', ewe: 'Nu kpukpuiwo' },
    displayOrder: 3,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'sac-a-dos-perles-dore',
    category: MOCK_CATEGORIES[0],
    name: {
      fr: 'Sac à dos en perles doré',
      en: 'Golden beaded backpack',
      ewe: 'Akɔnta sika azetɔ',
    },
    description: {
      fr: 'Sac à dos entièrement fait à la main avec des perles dorées et un motif kente. Chaque perle est soigneusement sélectionnée et assemblée pour créer un accessoire unique qui allie tradition togolaise et style contemporain.',
      en: 'Fully handmade backpack with golden beads and kente pattern. Each bead is carefully selected and assembled to create a unique accessory that combines Togolese tradition with contemporary style.',
      ewe: 'Azetɔ si wowɔ kple asi kple akɔnta sikawo kple kente nutata.',
    },
    priceXof: 25000,
    images: ['/images/mock/sac-dore-1.svg', '/images/mock/sac-dore-2.svg'],
    isAvailable: true,
    isFeatured: true,
    stockNote: 'Délai de fabrication : 5-7 jours',
    metaTitle: {
      fr: 'Sac à dos en perles doré — Adodi Studio',
      en: 'Golden beaded backpack — Adodi Studio',
      ewe: 'Akɔnta sika azetɔ — Adodi Studio',
    },
    metaDescription: {
      fr: 'Sac à dos artisanal en perles dorées, motif kente. Fait main à Lomé, Togo.',
      en: 'Handcrafted golden beaded backpack with kente pattern. Handmade in Lomé, Togo.',
      ewe: 'Azetɔ si wowɔ kple asi le Lomé, Togo.',
    },
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 'prod-2',
    slug: 'pochette-perles-multicolore',
    category: MOCK_CATEGORIES[0],
    name: {
      fr: 'Pochette en perles multicolore',
      en: 'Multicolor beaded clutch',
      ewe: 'Akɔnta amadede geɖewo azetɔ',
    },
    description: {
      fr: 'Petite pochette élégante en perles multicolores, parfaite pour les sorties. Un mélange vibrant de couleurs inspiré des marchés de Lomé.',
      en: 'Elegant small clutch with multicolored beads, perfect for outings. A vibrant mix of colors inspired by Lomé markets.',
      ewe: 'Azetɔ suesue nyui si wowɔ kple akɔnta amadede geɖewo.',
    },
    priceXof: 15000,
    images: ['/images/mock/pochette-multi-1.svg'],
    isAvailable: true,
    isFeatured: true,
    stockNote: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: 'prod-3',
    slug: 'sac-bandouliere-terre',
    category: MOCK_CATEGORIES[0],
    name: {
      fr: 'Sac bandoulière terre cuite',
      en: 'Terracotta crossbody bag',
      ewe: 'Anyigba amadede azetɔ',
    },
    description: {
      fr: 'Sac bandoulière aux tons terre cuite, inspiré des paysages togolais. Bandoulière ajustable en cuir artisanal.',
      en: 'Crossbody bag in terracotta tones, inspired by Togolese landscapes. Adjustable artisanal leather strap.',
      ewe: 'Azetɔ si le anyigba amadedewo me, Togo ƒe nɔƒewo na mɔ̃ɖoɖo.',
    },
    priceXof: 20000,
    images: ['/images/mock/sac-terre-1.svg'],
    isAvailable: true,
    isFeatured: false,
    stockNote: 'Disponible sous 3 jours',
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-08'),
    updatedAt: new Date('2026-03-08'),
  },
  {
    id: 'prod-4',
    slug: 'support-telephone-perles',
    category: MOCK_CATEGORIES[1],
    name: {
      fr: 'Support téléphone en perles',
      en: 'Beaded phone stand',
      ewe: 'Akɔnta telefon agbalẽ',
    },
    description: {
      fr: 'Support de téléphone décoratif en perles, avec motif traditionnel. Pratique et élégant sur votre bureau.',
      en: 'Decorative beaded phone stand with traditional pattern. Practical and elegant on your desk.',
      ewe: 'Telefon agbalẽ si wowɔ kple akɔnta xoxo nutata.',
    },
    priceXof: 8000,
    images: ['/images/mock/support-tel-1.svg'],
    isAvailable: true,
    isFeatured: false,
    stockNote: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  },
  {
    id: 'prod-5',
    slug: 'support-tablette-kente',
    category: MOCK_CATEGORIES[1],
    name: {
      fr: 'Support tablette motif kente',
      en: 'Kente pattern tablet stand',
      ewe: 'Kente nutata tablet agbalẽ',
    },
    description: {
      fr: 'Support de tablette robuste avec un magnifique motif kente en perles. Idéal pour la cuisine ou le salon.',
      en: 'Sturdy tablet stand with a beautiful kente bead pattern. Ideal for the kitchen or living room.',
      ewe: 'Tablet agbalẽ kple kente nutata nyui.',
    },
    priceXof: 12000,
    images: ['/images/mock/support-tablet-1.svg'],
    isAvailable: true,
    isFeatured: true,
    stockNote: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: 'prod-6',
    slug: 'bracelet-perles-togo',
    category: MOCK_CATEGORIES[2],
    name: {
      fr: 'Bracelet en perles du Togo',
      en: 'Togolese bead bracelet',
      ewe: 'Togo akɔnta asikpɔ',
    },
    description: {
      fr: 'Bracelet artisanal en perles aux couleurs du drapeau togolais. Un symbole de fierté nationale à porter au quotidien.',
      en: 'Handcrafted bead bracelet in Togolese flag colors. A symbol of national pride to wear every day.',
      ewe: 'Asikpɔ si wowɔ kple asi le Togo ƒlagawo me.',
    },
    priceXof: 5000,
    images: ['/images/mock/bracelet-togo-1.svg'],
    isAvailable: true,
    isFeatured: true,
    stockNote: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'prod-7',
    slug: 'collier-perles-or-vert',
    category: MOCK_CATEGORIES[2],
    name: {
      fr: 'Collier perles or et vert',
      en: 'Gold and green bead necklace',
      ewe: 'Sika kple gbemɔ akɔnta kɔkɔ',
    },
    description: {
      fr: 'Collier élégant en perles dorées et vertes, inspiré des couleurs de la forêt togolaise.',
      en: 'Elegant necklace with golden and green beads, inspired by the colors of Togolese forests.',
      ewe: 'Kɔkɔ nyui si le sika kple gbemɔ akɔntawo me.',
    },
    priceXof: 7500,
    images: ['/images/mock/collier-or-vert-1.svg'],
    isAvailable: true,
    isFeatured: false,
    stockNote: 'Dernière pièce disponible',
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: 'prod-8',
    slug: 'boucles-oreilles-soleil',
    category: MOCK_CATEGORIES[2],
    name: {
      fr: "Boucles d'oreilles Soleil",
      en: 'Sun earrings',
      ewe: 'Ŋdi toŋu nuwo',
    },
    description: {
      fr: "Boucles d'oreilles en forme de soleil, en perles dorées. Légères et lumineuses, parfaites pour l'été.",
      en: 'Sun-shaped earrings in golden beads. Light and luminous, perfect for summer.',
      ewe: 'Ŋdi toŋu nuwo si le ŋdi ƒe ɖoɖo me, wowɔ kple sika akɔntawo.',
    },
    priceXof: 4000,
    images: ['/images/mock/boucles-soleil-1.svg'],
    isAvailable: true,
    isFeatured: false,
    stockNote: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date('2026-03-14'),
    updatedAt: new Date('2026-03-14'),
  },
];

export function getMockProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getMockFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
}

export function getMockProductsByCategory(categorySlug: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.category?.slug === categorySlug);
}
