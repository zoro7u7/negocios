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
import { ServiceForm } from "./service-form"
import { useState } from "react"

interface ServiceDialogProps {
  initialData?: any
  mode?: "create" | "edit"
}

export function ServiceDialog({ initialData, mode = "create" }: ServiceDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            <span>Nuevo Servicio</span>
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
            {mode === "create" ? "Registrar Nuevo Servicio" : `Editar Servicio: ${initialData?.name}`}
          </DialogTitle>
        </DialogHeader>
        <ServiceForm 
          initialData={initialData} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}
