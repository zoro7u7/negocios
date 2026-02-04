"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createService, updateService } from "@/actions/services"
import { useState } from "react"

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.preprocess((val) => Number(val), z.number().min(0.01, "El precio debe ser mayor a 0")),
  status: z.enum(["active", "inactive"]),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  initialData?: any
  onSuccess: () => void
}

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      status: "active",
    },
  })

  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateService(initialData.id, data)
      } else {
        await createService(data)
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
        <Label htmlFor="name">Nombre del Servicio</Label>
        <Input
          id="name"
          placeholder="Ej. Cambio de Aceite"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Precio (USD)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price")}
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && (
          <p className="text-xs text-red-500">{errors.price.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          {...register("status")}
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Guardando..." : initialData ? "Actualizar Servicio" : "Crear Servicio"}
        </Button>
      </div>
    </form>
  )
}
