import { getProducts } from "@/actions/products";
import { getServices } from "@/actions/services";
import { getConfig } from "@/actions/config";
import { getDashboardStats } from "@/actions/dashboard";
import { getSalesReport } from "@/actions/reports";
import {
  TrendingUp,
  Package,
  Briefcase,
  AlertCircle,
  Banknote,
  ShoppingCart,
  Users,
  Search
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const lowStockProducts = await getProducts("", "low_stock");
  const activeServices = await getServices("", true);
  const config = await getConfig();
  const dbStats = await getDashboardStats();
  const recentSales = await getSalesReport();

  const stats = [
    { name: "Ventas de Hoy", value: `$${Number(dbStats.todaySalesUsd).toFixed(2)}`, subValue: `Eq. Bs ${Number(dbStats.todaySalesBs).toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },

    { name: "Clientes Totales", value: dbStats.totalClients.toString(), subValue: "Base de datos activa", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Alertas Stock", value: dbStats.lowStockCount.toString(), subValue: "Productos por debajo de 5", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Tasa BCV", value: `${config?.bcvRate || 0}`, subValue: `${config?.currencySymbol} por Dólar`, icon: Banknote, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Panel de Control</h1>
          <p className="text-gray-500">Resumen operativo del sistema POS.</p>
        </div>
        <Link
          href="/pos"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" />
          NUEVA VENTA
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">{item.name}</p>
                <p className="text-2xl font-black text-gray-900">{item.value}</p>
                <p className="text-[11px] font-medium text-gray-500 mt-1">{item.subValue}</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-600" />
              Alertas de Inventario
            </h2>
            <Link href="/products" className="text-[10px] font-black text-blue-600 hover:underline uppercase">Ver Todo</Link>
          </div>
          <div className="divide-y flex-1">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900 text-sm uppercase">{product.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tight">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-600 font-black text-[10px]">
                    {product.stock} EN TIENDA
                  </div>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <Package className="h-10 w-10 mb-2 opacity-10" />
                <p className="text-xs font-bold uppercase">Sin alertas críticas</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              Ventas Recientes
            </h2>
            <Link href="/reports" className="text-[10px] font-black text-blue-600 hover:underline uppercase">Historial</Link>
          </div>
          <div className="divide-y flex-1">
            {recentSales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900 text-sm uppercase">{sale.clientName}</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tight">#{sale.id} - {new Date(sale.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-sm">${Number(sale.totalUsd).toFixed(2)}</p>
                  <p className="text-[10px] text-blue-600 font-bold tracking-tighter uppercase whitespace-nowrap">Bs {Number(sale.totalBs).toFixed(2)}</p>

                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <ShoppingCart className="h-10 w-10 mb-2 opacity-10" />
                <p className="text-xs font-bold uppercase">Esperando primera venta</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
