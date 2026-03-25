-- Seed data for development

insert into categories (slug, name, display_order) values
  ('sacs',         '{"fr": "Sacs", "en": "Bags", "ewe": "Azetɔwo"}', 1),
  ('supports',     '{"fr": "Supports", "en": "Stands", "ewe": "Agbalẽwo"}', 2),
  ('accessoires',  '{"fr": "Accessoires", "en": "Accessories", "ewe": "Nu kpukpuiwo"}', 3);

insert into products (slug, category_id, name, description, price_xof, is_available, is_featured) values
  (
    'sac-a-dos-perles-dore',
    (select id from categories where slug = 'sacs'),
    '{"fr": "Sac à dos en perles doré", "en": "Golden beaded backpack", "ewe": "Akɔnta sika azetɔ"}',
    '{"fr": "Sac à dos entièrement fait à la main avec des perles dorées et un motif kente.", "en": "Fully handmade backpack with golden beads and kente pattern.", "ewe": "Azetɔ si wowɔ kple asi kple akɔnta sikawo kple kente nutata."}',
    25000,
    true,
    true
  ),
  (
    'pochette-perles-multicolore',
    (select id from categories where slug = 'sacs'),
    '{"fr": "Pochette en perles multicolore", "en": "Multicolor beaded clutch", "ewe": "Akɔnta amadede geɖewo azetɔ"}',
    '{"fr": "Petite pochette élégante en perles multicolores, parfaite pour les sorties.", "en": "Elegant small clutch with multicolored beads, perfect for outings.", "ewe": "Azetɔ suesue nyui si wowɔ kple akɔnta amadede geɖewo."}',
    15000,
    true,
    true
  ),
  (
    'support-telephone-perles',
    (select id from categories where slug = 'supports'),
    '{"fr": "Support téléphone en perles", "en": "Beaded phone stand", "ewe": "Akɔnta telefon agbalẽ"}',
    '{"fr": "Support de téléphone décoratif en perles, motif traditionnel.", "en": "Decorative beaded phone stand with traditional pattern.", "ewe": "Telefon agbalẽ si wowɔ kple akɔnta xoxo nutata."}',
    8000,
    true,
    false
  ),
  (
    'bracelet-perles-togo',
    (select id from categories where slug = 'accessoires'),
    '{"fr": "Bracelet en perles du Togo", "en": "Togolese bead bracelet", "ewe": "Togo akɔnta asikpɔ"}',
    '{"fr": "Bracelet artisanal en perles aux couleurs du drapeau togolais.", "en": "Handcrafted bead bracelet in Togolese flag colors.", "ewe": "Asikpɔ si wowɔ kple asi le Togo ƒlagawo me."}',
    5000,
    true,
    true
  );
