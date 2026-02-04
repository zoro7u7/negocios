"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProduct, updateProduct } from "@/actions/products"
import { useState } from "react"

const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  sku: z.string().min(2, "El SKU debe tener al menos 2 caracteres"),
  price: z.preprocess((val) => Number(val), z.number().min(0.01, "El precio debe ser mayor a 0")),
  stock: z.preprocess((val) => Number(val), z.number().min(0, "El stock no puede ser negativo")),
  minStock: z.preprocess((val) => Number(val), z.number().min(0, "El stock mínimo no puede ser negativo")),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  onSuccess: () => void
}

export function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      sku: initialData.sku || "",
      price: initialData.price || 0,
      stock: initialData.stock || 0,
      minStock: initialData.minStock || 0,
    } : {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      minStock: 0,
    },
  })

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateProduct(initialData.id, data)
      } else {
        await createProduct(data)
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
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          placeholder="Ej. Lubricante 10W-40"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU / Código</Label>
        <Input
          id="sku"
          placeholder="LUB-001"
          {...register("sku")}
          className={errors.sku ? "border-red-500" : ""}
        />
        {errors.sku && (
          <p className="text-xs text-red-500">{errors.sku.message as string}</p>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Actual</Label>
          <Input id="stock" type="number" {...register("stock")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Stock Mínimo (Alerta)</Label>
          <Input id="minStock" type="number" {...register("minStock")} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Guardando..." : initialData ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </div>
    </form>
  )
}
