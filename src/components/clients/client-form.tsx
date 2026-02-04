"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient, updateClient } from "@/actions/clients"
import { useState } from "react"

const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  birthdayDay: z.preprocess((val) => Number(val), z.number().min(0).max(31)).optional(),
  birthdayMonth: z.preprocess((val) => Number(val), z.number().min(0).max(12)).optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  initialData?: any
  onSuccess: () => void
}

export function ClientForm({ initialData, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      birthdayDay: initialData.birthdayDay || 0,
      birthdayMonth: initialData.birthdayMonth || 0,
    } : {
      name: "",
      phone: "",
      email: "",
      birthdayDay: 0,
      birthdayMonth: 0,
    },
  })

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    setLoading(true)
    try {
      const formattedData = {
        ...data,
        birthdayDay: data.birthdayDay || undefined,
        birthdayMonth: data.birthdayMonth || undefined,
      }

      if (initialData?.id) {
        await updateClient(initialData.id, formattedData)
      } else {
        await createClient(formattedData)
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
        <Label htmlFor="name">Nombre Completo</Label>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" placeholder="0412... o 0424..." {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="cliente@correo.com" {...register("email")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthdayDay">Día Cumpleaños (1-31)</Label>
          <Input id="birthdayDay" type="number" {...register("birthdayDay")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthdayMonth">Mes (1-12)</Label>
          <Input id="birthdayMonth" type="number" {...register("birthdayMonth")} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Guardando..." : initialData ? "Actualizar Cliente" : "Crear Cliente"}
        </Button>
      </div>
    </form>
  )
}
