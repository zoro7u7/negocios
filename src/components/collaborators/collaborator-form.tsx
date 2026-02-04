"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCollaborator, updateCollaborator } from "@/actions/collaborators"
import { useState } from "react"

const collaboratorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  area: z.string().optional(),
  commissionPercentage: z.preprocess((val) => Number(val), z.number().min(0).max(100, "Porcentaje inválido")),
  active: z.boolean(),
})

type CollaboratorFormValues = z.infer<typeof collaboratorSchema>

interface CollaboratorFormProps {
  initialData?: any
  onSuccess: () => void
}

export function CollaboratorForm({ initialData, onSuccess }: CollaboratorFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: initialData || {
      name: "",
      area: "",
      commissionPercentage: 0,
      active: true,
    },
  })

  const onSubmit: SubmitHandler<CollaboratorFormValues> = async (data) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateCollaborator(initialData.id, data)
      } else {
        await createCollaborator(data)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 text-gray-900">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Colaborador</Label>
        <Input
          id="name"
          placeholder="Juan Pérez"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Área / Especialidad</Label>
        <Input
          id="area"
          placeholder="Mecánica, Estética, etc."
          {...register("area")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commissionPercentage">Porcentaje de Comisión (%)</Label>
        <Input
          id="commissionPercentage"
          type="number"
          step="0.01"
          {...register("commissionPercentage")}
          className={errors.commissionPercentage ? "border-red-500" : ""}
        />
        {errors.commissionPercentage && (
          <p className="text-xs text-red-500">{errors.commissionPercentage.message as string}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          id="active"
          type="checkbox"
          {...register("active")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="active">Estado Activo</Label>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Guardando..." : initialData ? "Actualizar Colaborador" : "Crear Colaborador"}
        </Button>
      </div>
    </form>
  )
}
