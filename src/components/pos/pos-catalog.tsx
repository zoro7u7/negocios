"use client"

import { useCartStore } from "@/store/useCartStore"
import { Search, Package, Briefcase, Plus } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

interface CatalogProps {
  products: any[]
  services: any[]
}

export function PosCatalog({ products, services }: CatalogProps) {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<'all' | 'products' | 'services'>('all')
  const addItem = useCartStore((state) => state.addItem)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase())
  )

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  const showProducts = tab === 'all' || tab === 'products'
  const showServices = tab === 'all' || tab === 'services'

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border shadow-sm overflow-hidden text-gray-900">
      <div className="p-4 border-b space-y-4 bg-gray-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nombre o SKU..." 
            className="pl-10 h-11 bg-white border-gray-200 focus:ring-blue-500 rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-xl text-sm">
          {['all', 'products', 'services'].map((t) => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 py-2 rounded-lg transition-all uppercase text-[10px] font-black tracking-widest ${tab === t ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t === 'all' ? 'Todos' : t === 'products' ? 'Productos' : 'Servicios'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-h-0">
        <AnimatePresence mode="popLayout">
          {showProducts && filteredProducts.map(p => (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={`p-${p.id}`}
              onClick={() => addItem({ id: p.id, type: 'product', name: p.name, price: p.price, stock: p.stock })}
              disabled={p.stock <= 0}
              className="flex flex-col p-4 rounded-xl border border-gray-100 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left relative group disabled:opacity-40"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-blue-100/50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Package className="h-4 w-4" />
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${p.stock <= p.minStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {p.stock} EN STOCK
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm truncate w-full mb-1">{p.name}</h4>
              <div className="mt-auto pt-3 flex items-center justify-between border-t border-dashed border-gray-100">
                <span className="text-gray-900 font-black text-base">${Number(p.price).toFixed(2)}</span>
                <div className="bg-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white p-1.5 rounded-lg transition-all">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </motion.button>
          ))}

          {showServices && filteredServices.map(s => (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={`s-${s.id}`}
              onClick={() => addItem({ id: s.id, type: 'service', name: s.name, price: s.price })}
              className="flex flex-col p-4 rounded-xl border border-gray-100 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-purple-100/50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-purple-100 text-purple-700">
                  Servicio
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm truncate w-full mb-1">{s.name}</h4>
              <div className="mt-auto pt-3 flex items-center justify-between border-t border-dashed border-gray-100">
                <span className="text-gray-900 font-black text-base">${Number(s.price).toFixed(2)}</span>
                <div className="bg-gray-100 text-gray-400 group-hover:bg-purple-600 group-hover:text-white p-1.5 rounded-lg transition-all">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {(filteredProducts.length === 0 && filteredServices.length === 0) && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-gray-400">
            <Search className="h-12 w-12 mb-4 opacity-10" />
            <p className="text-sm font-bold uppercase italic">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  )
}
