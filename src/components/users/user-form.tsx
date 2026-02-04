"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, updateUser } from "@/actions/users"
import { useState } from "react"

const userSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["admin", "trabajador"]),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!initialData

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "trabajador",
    },
  })

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    setLoading(true)
    try {
      if (isEdit) {
        await updateUser(initialData.id, data)
      } else {
        await createUser(data)
      }
      onSuccess()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 text-gray-900">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre Real</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Usuario (Login)</Label>
          <Input id="username" {...register("username")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <select id="role" {...register("role")} className="w-full h-10 border rounded-md px-3 text-sm">
            <option value="trabajador">Trabajador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{isEdit ? "Cambiar Contraseña (opcional)" : "Contraseña"}</Label>
        <Input id="password" type="password" {...register("password")} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Guardando..." : isEdit ? "Actualizar Usuario" : "Crear Usuario"}
      </Button>
    </form>
  )
}
