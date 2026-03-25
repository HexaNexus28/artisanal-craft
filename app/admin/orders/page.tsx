'use client';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
        Commandes
      </h1>
      <p className="text-charcoal/60 mb-8">
        Suivi des commandes WhatsApp.
      </p>

      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sand/30 text-3xl mb-4">
          C
        </div>
        <p className="text-charcoal/70 text-lg font-medium mb-2">
          Aucune commande pour le moment
        </p>
        <p className="text-charcoal/50 text-sm max-w-md mx-auto">
          Les commandes apparaîtront ici lorsque des clients utiliseront le bouton WhatsApp
          sur les pages produits. Connectez Supabase pour activer le suivi.
        </p>
      </div>
    </div>
  );
}
