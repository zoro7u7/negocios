"use client"

import { useState, useEffect } from "react"
import { getSalesReport, getCommissionReport } from "@/actions/reports"
import { FileText, DollarSign, UserCheck, Calendar as CalendarIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'commissions'>('sales')
  const [sales, setSales] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadData = async () => {
    setLoading(true)
    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }
    
    if (activeTab === 'sales') {
      const data = await getSalesReport(filters)
      setSales(data)
    } else {
      const data = await getCommissionReport(filters)
      setCommissions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Reportes del Sistema</h1>
          <p className="text-gray-500">Analiza el rendimiento de tus ventas y colaboraciones.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${activeTab === 'sales' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <DollarSign className="h-4 w-4" />
            Ventas
          </button>
          <button 
            onClick={() => setActiveTab('commissions')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${activeTab === 'commissions' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <UserCheck className="h-4 w-4" />
            Comisiones
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500">Fecha Inicio</label>
          <input 
            type="date" 
            className="flex h-10 w-40 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500">Fecha Fin</label>
          <input 
            type="date" 
            className="flex h-10 w-40 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
        <Button onClick={loadData} className="bg-blue-600 hover:bg-blue-700 h-10 px-6 font-bold">
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-gray-400">Cargando datos...</div>
        ) : activeTab === 'sales' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-black">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Vendedor</th>
                  <th className="px-6 py-4">Método</th>
                  <th className="px-6 py-4 text-right">Total USD</th>
                  <th className="px-6 py-4 text-right">Total Bs.</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold">#{s.id}</td>
                    <td className="px-6 py-4 font-medium text-xs">
                      {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">{s.clientName}</td>
                    <td className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">{s.userName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">${Number(s.totalUsd).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold">Bs. {Number(s.totalBs).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-black">
                <tr>
                  <th className="px-6 py-4">Colaborador</th>
                  <th className="px-6 py-4 text-center">Ventas Realizadas</th>
                  <th className="px-6 py-4 text-right">Comisiones ($)</th>
                  <th className="px-6 py-4 text-right">Referidos ($)</th>
                  <th className="px-6 py-4 text-right font-bold text-gray-900">Total a Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {commissions.map((c) => (
                  <tr key={c.collaboratorId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {c.collaboratorName[0].toUpperCase()}
                        </div>
                        <span className="font-bold">{c.collaboratorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">
                        {c.salesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">${Number(c.totalCommissions || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-500">${Number(c.totalReferrals || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-black text-green-600 text-base">
                      ${(Number(c.totalCommissions || 0) + Number(c.totalReferrals || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
