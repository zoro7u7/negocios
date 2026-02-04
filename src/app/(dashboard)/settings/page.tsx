import { getConfig } from "@/actions/config";
import { Settings, RefreshCcw, Save } from "lucide-react";

export default async function SettingsPage() {
  const config = await getConfig();

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
      </div>

      <div className="grid gap-6">
        <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Tasas y Moneda
            </h2>
          </div>
          <div className="p-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tasa BCV (Bs/$)</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  defaultValue={config?.bcvRate}
                  className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                />
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <RefreshCcw className="h-4 w-4" />
                  <span>BCV</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tasa IVA (%)</label>
              <input
                type="number"
                defaultValue={config?.ivaRate}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Símbolo de Moneda</label>
              <input
                type="text"
                defaultValue={config?.currencySymbol}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monto Fijo Referido (USD)</label>
              <input
                type="number"
                step="0.01"
                defaultValue={config?.referralAmount}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="h-5 w-5" />
              Guardar Cambios
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl border shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-900">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Mantenimiento</h2>
            <p className="text-sm text-gray-500">Gestiona los respaldos de la base de datos y exporta tus datos.</p>
          </div>
          <div className="flex gap-3 text-gray-900">
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Respaldar DB
            </button>
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Exportar CSV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
