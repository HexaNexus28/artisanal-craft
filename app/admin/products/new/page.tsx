'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export default function NewProductPage() {
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameEwe, setNameEwe] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descEwe, setDescEwe] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceXof, setPriceXof] = useState('');
  const [stockNote, setStockNote] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');

  const handleSave = () => {
    alert('Connectez Supabase pour sauvegarder');
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="text-charcoal/50 hover:text-charcoal transition-colors text-sm"
        >
          ← Produits
        </Link>
        <span className="text-charcoal/30">/</span>
        <span className="text-sm text-charcoal/70">Nouveau produit</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-8">
        Nouveau produit
      </h1>

      <div className="space-y-8 max-w-3xl">
        {/* Name fields */}
        <fieldset className="bg-white rounded-xl border border-sand p-5">
          <legend className="text-sm font-semibold text-charcoal px-2">
            Nom du produit
          </legend>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Francais
              </label>
              <input
                type="text"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                placeholder="Sac a dos en perles..."
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                English
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Beaded backpack..."
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Ewe
              </label>
              <input
                type="text"
                value={nameEwe}
                onChange={(e) => setNameEwe(e.target.value)}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
          </div>
        </fieldset>

        {/* Description fields */}
        <fieldset className="bg-white rounded-xl border border-sand p-5">
          <legend className="text-sm font-semibold text-charcoal px-2">
            Description
          </legend>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Francais
              </label>
              <textarea
                value={descFr}
                onChange={(e) => setDescFr(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                English
              </label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Ewe
              </label>
              <textarea
                value={descEwe}
                onChange={(e) => setDescEwe(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-y"
              />
            </div>
          </div>
        </fieldset>

        {/* Product details */}
        <fieldset className="bg-white rounded-xl border border-sand p-5">
          <legend className="text-sm font-semibold text-charcoal px-2">
            Details
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sac-a-dos-perles"
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Categorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              >
                <option value="">— Aucune —</option>
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.fr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Prix (FCFA)
              </label>
              <input
                type="number"
                value={priceXof}
                onChange={(e) => setPriceXof(e.target.value)}
                placeholder="15000"
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 mb-1">
                Note de stock
              </label>
              <input
                type="text"
                value={stockNote}
                onChange={(e) => setStockNote(e.target.value)}
                placeholder="Ex: Delai 5-7 jours"
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
          </div>
        </fieldset>

        {/* Toggles */}
        <fieldset className="bg-white rounded-xl border border-sand p-5">
          <legend className="text-sm font-semibold text-charcoal px-2">
            Statut
          </legend>
          <div className="space-y-4 mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  isAvailable ? 'bg-forest' : 'bg-charcoal/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                    isAvailable ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-charcoal">Disponible</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  isFeatured ? 'bg-gold' : 'bg-charcoal/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                    isFeatured ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-charcoal">Produit vedette</span>
            </label>
          </div>
        </fieldset>

        {/* Images */}
        <fieldset className="bg-white rounded-xl border border-sand p-5">
          <legend className="text-sm font-semibold text-charcoal px-2">
            Images
          </legend>
          <div className="mt-2 space-y-3">
            {images.length === 0 && (
              <p className="text-sm text-charcoal/40 py-2">
                Aucune image ajoutee.
              </p>
            )}
            {images.map((img, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-cream/50 rounded-lg px-3 py-2"
              >
                <span className="flex-1 text-sm text-charcoal/70 font-mono truncate">
                  {img}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="shrink-0 text-soil hover:text-soil/80 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="URL de l'image"
                className="flex-1 rounded-lg border border-sand px-3 py-2 text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
              <button
                type="button"
                onClick={addImage}
                className="shrink-0 rounded-lg bg-charcoal/5 px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/10 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </fieldset>

        {/* Save */}
        <div className="flex items-center gap-4 pt-2 pb-8">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold/90 transition-colors"
          >
            Creer le produit
          </button>
          <Link
            href="/admin/products"
            className="text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Annuler
          </Link>
        </div>
      </div>
    </div>
  );
}
