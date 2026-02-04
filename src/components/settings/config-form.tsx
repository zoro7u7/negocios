"use client"

import { useState } from "react"
import { updateConfig, syncBcvRate } from "@/actions/config"

import { Settings, RefreshCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ConfigForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    bcvRate: initialData?.bcvRate || 0,
    ivaRate: initialData?.ivaRate || 16,
    currencySymbol: initialData?.currencySymbol || "Bs",
    referralAmount: initialData?.referralAmount || 0,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateConfig(data)
      toast.success("Configuración actualizada correctamente")
    } catch (e) {
      console.error(e)
      toast.error("Error al actualizar la configuración")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-xl border shadow-sm overflow-hidden text-gray-900">
      <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Tasas y Moneda
        </h2>
      </div>
      <div className="p-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bold">Tasa BCV (Bs/$)</label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              step="0.01"
              value={data.bcvRate}
              onChange={(e) => setData({ ...data, bcvRate: Number(e.target.value) })}
              className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            />
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await syncBcvRate();
                  if (result) {
                    setData({ ...data, bcvRate: result.bcvRate });
                    toast.success("Tasa BCV sincronizada");
                  }
                } catch (e) {
                  toast.error("Error al sincronizar tasa");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>BCV</span>
            </button>

          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bold">Tasa IVA (%)</label>
          <input
            type="number"
            value={data.ivaRate}
            onChange={(e) => setData({ ...data, ivaRate: Number(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bold">Símbolo de Moneda</label>
          <input
            type="text"
            value={data.currencySymbol}
            onChange={(e) => setData({ ...data, currencySymbol: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bold">Monto Fijo Referido (USD)</label>
          <input
            type="number"
            step="0.01"
            value={data.referralAmount}
            onChange={(e) => setData({ ...data, referralAmount: Number(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>
      <div className="p-6 bg-gray-50 border-t flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="h-5 w-5" />
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </section>
  )
}
