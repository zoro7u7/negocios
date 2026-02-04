"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Check } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/useCartStore"

interface ClientSelectorProps {
  clients: any[]
}

export function ClientSelector({ clients }: ClientSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { clientId, setClient } = useCartStore()

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  )

  const handleSelect = (client: any) => {
    setClient(client.id, client.name)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
          <Search className="h-4 w-4" />
          <span>Cambiar Cliente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Seleccionar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por nombre o teléfono..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
            <button
              onClick={() => handleSelect({ id: null, name: "Cliente General" })}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-sm">Cliente General</p>
                <p className="text-xs text-gray-500">Sin datos registrados</p>
              </div>
              {!clientId && <Check className="h-4 w-4 text-green-600" />}
            </button>
            
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => handleSelect(client)}
                className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <p className="font-bold text-sm">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.phone || "Sin teléfono"}</p>
                </div>
                {clientId === client.id && <Check className="h-4 w-4 text-green-600" />}
              </button>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <UserPlus className="h-4 w-4 mr-2" />
            Registrar Nuevo Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
