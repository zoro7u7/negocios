import { getProducts } from "@/actions/products";
import { getServices } from "@/actions/services";
import { getConfig } from "@/actions/config";
import { 
  TrendingUp, 
  Package, 
  Briefcase, 
  AlertCircle,
  Banknote,
  ShoppingCart
} from "lucide-react";

export default async function DashboardPage() {
  const lowStockProducts = await getProducts("", "low_stock");
  const activeServices = await getServices("", true);
  const config = await getConfig();

  const stats = [
    { name: "Ventas del Día", value: "$0.00", icon: TrendingUp, color: "text-green-600" },
    { name: "Productos con Stock Bajo", value: lowStockProducts.length.toString(), icon: AlertCircle, color: "text-orange-600" },
    { name: "Servicios Activos", value: activeServices.length.toString(), icon: Briefcase, color: "text-blue-600" },
    { name: "Tasa BCV", value: `${config?.bcvRate || 0} ${config?.currencySymbol}`, icon: Banknote, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-500">Bienvenido al sistema POS. Aquí tienes un resumen de hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-gray-50 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.name}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Alertas de Stock Bajo
            </h2>
            <a href="/products?f=low_stock" className="text-xs font-medium text-blue-600 hover:underline">Ver todos</a>
          </div>
          <div className="divide-y">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{product.stock} disponibles</p>
                  <p className="text-xs text-gray-400">Mín: {product.minStock}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500 italic">
                No hay alertas de stock por el momento.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Últimas Ventas
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8 text-center">
            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Aún no se han registrado ventas hoy.</p>
            <p className="text-xs mt-1">Inicia una venta en el módulo POS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
