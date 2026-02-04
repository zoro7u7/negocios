import { getProducts } from "@/actions/products";
import { getServices } from "@/actions/services";
import { getCollaborators } from "@/actions/collaborators";
import { getConfig } from "@/actions/config";
import { getClients } from "@/actions/clients";
import { PosCatalog } from "@/components/pos/pos-catalog";
import { CartSummary } from "@/components/pos/cart-summary";
import { SyncCartConfig } from "@/components/pos/sync-cart-config";
import { ClientSelector } from "@/components/pos/client-selector";

export default async function PosPage() {
  const [products, services, collaborators, config, clients] = await Promise.all([
    getProducts(),
    getServices(),
    getCollaborators(),
    getConfig(),
    getClients(),
  ]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden">
      <SyncCartConfig 
        bcvRate={config?.bcvRate || 1} 
        ivaRate={config?.ivaRate || 16} 
      />
      
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Punto de Venta (POS)</h1>
        <ClientSelector clients={clients} />
      </div>
      
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Catálogo de Productos y Servicios */}
        <div className="flex-[2] min-w-0">
          <PosCatalog products={products} services={services} />
        </div>

        {/* Resumen del Carrito y Pago */}
        <div className="flex-1 min-w-[350px]">
          <CartSummary collaborators={collaborators} />
        </div>
      </div>
    </div>
  );
}
