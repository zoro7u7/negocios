"use server"

import { db } from "@/db"
import { invoices, invoiceItems, invoicePayments, products, collaborators, configuration } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export type SaleData = {
  clientId: number | null
  clientName: string
  clientPhone?: string
  items: {
    id: number
    type: 'product' | 'service'
    name: string
    price: number
    quantity: number
    collaboratorId?: number
    referralId?: number
  }[]
  paymentMethod: 'efectivo' | 'punto' | 'pago_movil' | 'mixto'
  payments: {
    method: 'efectivo' | 'punto' | 'pago_movil'
    amountUsd: number
  }[]
  ivaEnabled: boolean
  discount: number
}

export async function processSale(data: SaleData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autorizado")

  const userId = parseInt(session.user.id)

  return await db.transaction(async (tx) => {
    // 1. Obtener configuración actual para snapshots
    const config = await tx.select().from(configuration).limit(1)
    const currentConfig = config[0]
    const bcvRate = currentConfig?.bcvRate || 1
    const ivaRate = data.ivaEnabled ? (currentConfig?.ivaRate || 16) : 0
    const fixedReferralAmount = currentConfig?.referralAmount || 0

    // 2. Calcular totales
    const subtotalUsd = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const ivaAmount = subtotalUsd * (ivaRate / 100)
    const totalUsd = subtotalUsd + ivaAmount - data.discount
    const totalBs = totalUsd * bcvRate

    // 3. Crear cabecera de factura
    const [insertedInvoice] = await tx.insert(invoices).values({
      userId,
      clientId: data.clientId,
      clientNameSnapshot: data.clientName,
      clientPhoneSnapshot: data.clientPhone || null,
      bcvRateSnapshot: bcvRate,
      ivaRateSnapshot: ivaRate,
      totalUsd,
      totalBs,
      ivaAmount,
      discount: data.discount,
      paymentMethod: data.paymentMethod,
    }).returning()

    const invoiceId = insertedInvoice.id

    // 4. Procesar ítems
    for (const item of data.items) {
      // Obtener comisión del colaborador si existe
      let commissionPercentage = 0
      if (item.collaboratorId) {
        const collab = await tx.select().from(collaborators).where(eq(collaborators.id, item.collaboratorId)).limit(1)
        if (collab[0]) commissionPercentage = Number(collab[0].commissionPercentage)
      }

      const itemSubtotal = item.price * item.quantity
      const commissionAmount = itemSubtotal * (commissionPercentage / 100)
      const referralAmount = item.referralId ? (fixedReferralAmount * item.quantity) : 0

      // Insertar ítem
      await tx.insert(invoiceItems).values({
        invoiceId,
        productId: item.type === 'product' ? item.id : null,
        serviceId: item.type === 'service' ? item.id : null,
        collaboratorId: item.collaboratorId || null,
        referralId: item.referralId || null,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: itemSubtotal,
        commissionPercentage,
        commissionAmount,
        referralAmount,
      })

      // 5. Descontar stock si es producto
      if (item.type === 'product') {
        const currentProduct = await tx.select().from(products).where(eq(products.id, item.id)).limit(1)
        if (!currentProduct[0] || currentProduct[0].stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${item.name}`)
        }

        await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.id))
      }
    }

    // 6. Registrar pagos
    for (const payment of data.payments) {
      await tx.insert(invoicePayments).values({
        invoiceId,
        paymentMethod: payment.method,
        amountUsd: payment.amountUsd,
      })
    }

    revalidatePath("/(dashboard)/pos")
    revalidatePath("/(dashboard)/products")
    
    return { success: true, invoiceId }
  })
}
