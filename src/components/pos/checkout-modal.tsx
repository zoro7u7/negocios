"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Banknote, Smartphone, Split, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { processSale } from "@/actions/sales"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateInvoicePDF } from "@/lib/pdf"
import { toast } from "sonner"

const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'punto', label: 'Punto de Venta', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'pago_movil', label: 'Pago Móvil', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'mixto', label: 'Pago Mixto', icon: Split, color: 'text-orange-600', bg: 'bg-orange-50' },
]

export function CheckoutModal() {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState<'efectivo' | 'punto' | 'pago_movil' | 'mixto' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Para pago mixto
  const [mixedPayments, setMixedPayments] = useState({
    efectivo: 0,
    punto: 0,
    pago_movil: 0
  })

  const { items, clientId, clientName, ivaEnabled, ivaRate, clearCart } = useCartStore()

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const iva = ivaEnabled ? subtotal * (ivaRate / 100) : 0
  const total = subtotal + iva

  const handleProcess = async () => {
    if (!method) return
    setLoading(true)
    setError(null)
    
    try {
      const payments = []
      if (method === 'mixto') {
        if (mixedPayments.efectivo > 0) payments.push({ method: 'efectivo' as const, amountUsd: mixedPayments.efectivo })
        if (mixedPayments.punto > 0) payments.push({ method: 'punto' as const, amountUsd: mixedPayments.punto })
        if (mixedPayments.pago_movil > 0) payments.push({ method: 'pago_movil' as const, amountUsd: mixedPayments.pago_movil })
        
        const sum = payments.reduce((acc, p) => acc + p.amountUsd, 0)
        if (Math.abs(sum - total) > 0.01) {
          throw new Error(`La suma de los pagos ($${sum.toFixed(2)}) no coincide con el total ($${total.toFixed(2)})`)
        }
      } else {
        payments.push({ method: method as any, amountUsd: total })
      }

      const result = await processSale({
        clientId,
        clientName: clientName || "Cliente General",
        items: items.map(i => ({
          id: i.id,
          type: i.type,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          collaboratorId: i.collaboratorId,
          referralId: i.referralId
        })),
        paymentMethod: method,
        payments,
        ivaEnabled,
        discount: 0
      })

      if (result.success) {
        toast.success("¡Venta procesada con éxito!")
        setSuccess(true)
        
        // Generar PDF
        generateInvoicePDF({
          invoiceId: result.invoiceId,
          clientName: clientName || "Cliente General",
          items: items,
          subtotal,
          ivaAmount: iva,
          totalUsd: total,
          bcvRate: useCartStore.getState().bcvRate
        })

        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setMethod(null)
          clearCart()
        }, 2000)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={items.length === 0} 
          className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-200"
        >
          CONTINUAR AL PAGO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Finalizar Venta</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-green-100 p-4 rounded-full text-green-600 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">¡Venta Registrada!</h2>
            <p className="text-gray-500">La transacción se completó con éxito.</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div className="bg-gray-50 p-4 rounded-xl border text-center">
              <p className="text-xs uppercase font-bold text-gray-500">Monto Total a Cobrar</p>
              <h2 className="text-3xl font-black text-blue-600">${total.toFixed(2)}</h2>
            </div>

            {!method ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">Seleccione Método de Pago:</p>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:shadow-md ${m.bg}`}
                    >
                      <m.icon className={`h-8 w-8 mb-2 ${m.color}`} />
                      <span className="text-xs font-bold uppercase tracking-tight text-gray-700">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">Pago: <span className="text-blue-600 uppercase">{method.replace('_', ' ')}</span></p>
                  <Button variant="ghost" size="sm" onClick={() => setMethod(null)} className="text-xs">Cambiar</Button>
                </div>

                {method === 'mixto' && (
                  <div className="space-y-3 border p-4 rounded-xl bg-gray-50">
                    <div className="grid gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase">Efectivo ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={mixedPayments.efectivo} 
                          onChange={(e) => setMixedPayments({...mixedPayments, efectivo: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase">Punto ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={mixedPayments.punto}
                          onChange={(e) => setMixedPayments({...mixedPayments, punto: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase">Pago Móvil ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={mixedPayments.pago_movil}
                          onChange={(e) => setMixedPayments({...mixedPayments, pago_movil: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">Restante:</span>
                      <span className={`text-sm font-bold ${Math.abs((mixedPayments.efectivo + mixedPayments.punto + mixedPayments.pago_movil) - total) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(total - (mixedPayments.efectivo + mixedPayments.punto + mixedPayments.pago_movil)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  onClick={handleProcess} 
                  disabled={loading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-bold"
                >
                  {loading ? "Procesando..." : "CONFIRMAR Y PAGAR"}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
