"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import { ProductForm } from "./product-form"
import { useState } from "react"

interface ProductDialogProps {
  initialData?: any
  mode?: "create" | "edit"
}

export function ProductDialog({ initialData, mode = "create" }: ProductDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            <span>Nuevo Producto</span>
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Registrar Nuevo Producto" : `Editar Producto: ${initialData?.name}`}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          initialData={initialData} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}
