"use client"

import { useCartStore } from "@/store/useCartStore"
import { Trash2, Plus, Minus, Users, Star, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutModal } from "./checkout-modal"
import { motion, AnimatePresence } from "framer-motion"

interface CartSummaryProps {
  collaborators: any[]
}

export function CartSummary({ collaborators }: CartSummaryProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    assignCollaborator,
    assignReferral,
    bcvRate,
    ivaEnabled,
    ivaRate,
    toggleIva,
    clientName
  } = useCartStore()

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const iva = ivaEnabled ? subtotal * (ivaRate / 100) : 0
  const total = subtotal + iva

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border shadow-sm text-gray-900 overflow-hidden">
      <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-gray-400 leading-none">Cliente</span>
            <span className="font-bold text-sm truncate max-w-[150px]">{clientName}</span>
          </div>
        </div>
        <div className="text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black tracking-wider uppercase">
          TASA: {bcvRate.toFixed(2)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 bg-gray-50/20">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 p-8 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest italic leading-relaxed">Arrastra o elige productos del catálogo</p>
            </motion.div>
          ) : (
            items.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={`${item.type}-${item.id}`}
                className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-gray-900 text-sm uppercase leading-tight tracking-tight">{item.name}</h4>
                    <p className="text-[11px] text-blue-600 font-bold">${item.price.toFixed(2)} p/u</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.type)}
                    className="h-7 w-7 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-gray-400 flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> Colaborador
                    </label>
                    <select
                      className="w-full text-xs border border-gray-100 rounded-lg p-2 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer"
                      value={item.collaboratorId || ""}
                      onChange={(e) => assignCollaborator(item.id, item.type, Number(e.target.value))}
                    >
                      <option value="">(Ninguno)</option>
                      {collaborators.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-gray-400 flex items-center gap-1.5">
                      <Star className="h-3 w-3" /> Referidos
                    </label>
                    <select
                      className="w-full text-xs border border-gray-100 rounded-lg p-2 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer"
                      value={item.referralId || ""}
                      onChange={(e) => assignReferral(item.id, item.type, Number(e.target.value))}
                    >
                      <option value="">(Ninguno)</option>
                      {collaborators.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center border border-gray-100 rounded-lg bg-white hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center border border-gray-100 rounded-lg bg-white hover:bg-gray-50 active:scale-95 transition-all text-blue-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-black text-sm text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span className="uppercase tracking-widest">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={toggleIva}
              className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest transition-all ${ivaEnabled ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-gray-100 text-gray-400'}`}
            >
              IVA (16%) {ivaEnabled ? 'ACTIVO' : 'INACTIVO'}
            </button>
            {ivaEnabled && <span className="text-sm font-black text-orange-600 animate-in slide-in-from-right-2">${iva.toFixed(2)}</span>}
          </div>
        </div>

        <div className="pt-4 border-t-2 border-dashed border-gray-100">
          <div className="flex justify-between items-center bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest leading-none">Inversión Final</p>
              <h3 className="text-3xl font-black text-blue-600 tracking-tighter leading-none">${total.toFixed(2)}</h3>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Referencia Bs.</p>
              <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none">{(total * bcvRate).toFixed(2)}</h4>
            </div>
          </div>
        </div>


        <CheckoutModal />
      </div>
    </div>
  )
}
