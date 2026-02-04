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
import { UserForm } from "./user-form"
import { useState } from "react"

export function UserDialog({ initialData, mode = "create" }: { initialData?: any, mode?: "create" | "edit" }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Registrar Usuario" : "Editar Usuario"}</DialogTitle>
        </DialogHeader>
        <UserForm initialData={initialData} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
