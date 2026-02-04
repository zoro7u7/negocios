"use server"

import { db } from "@/db"
import { invoices, invoiceItems, collaborators, clients, users, products, services } from "@/db/schema"
import { eq, and, gte, lte, desc, sql } from "drizzle-orm"

export async function getSalesReport(filters?: { 
  startDate?: Date, 
  endDate?: Date, 
  clientId?: number 
}) {
  let query = db.select({
    id: invoices.id,
    clientName: invoices.clientNameSnapshot,
    totalUsd: invoices.totalUsd,
    totalBs: invoices.totalBs,
    paymentMethod: invoices.paymentMethod,
    createdAt: invoices.createdAt,
    userName: users.name
  })
  .from(invoices)
  .leftJoin(users, eq(invoices.userId, users.id))
  .orderBy(desc(invoices.createdAt))

  const conditions = []
  if (filters?.startDate) conditions.push(gte(invoices.createdAt, filters.startDate))
  if (filters?.endDate) conditions.push(lte(invoices.createdAt, filters.endDate))
  if (filters?.clientId) conditions.push(eq(invoices.clientId, filters.clientId))

  if (conditions.length > 0) {
    // @ts-ignore
    query = query.where(and(...conditions))
  }

  return await query
}

export async function getCommissionReport(filters?: {
  startDate?: Date,
  endDate?: Date,
  collaboratorId?: number
}) {
  let query = db.select({
    collaboratorId: collaborators.id,
    collaboratorName: collaborators.name,
    totalCommissions: sql<number>`sum(${invoiceItems.commissionAmount})`,
    totalReferrals: sql<number>`sum(${invoiceItems.referralAmount})`,
    salesCount: sql<number>`count(${invoiceItems.id})`
  })
  .from(invoiceItems)
  .innerJoin(collaborators, eq(invoiceItems.collaboratorId, collaborators.id))
  .groupBy(collaborators.id, collaborators.name)

  const conditions = []
  if (filters?.startDate) conditions.push(gte(invoiceItems.createdAt, filters.startDate))
  if (filters?.endDate) conditions.push(lte(invoiceItems.createdAt, filters.endDate))
  if (filters?.collaboratorId) conditions.push(eq(collaborators.id, filters.collaboratorId))

  if (conditions.length > 0) {
    // @ts-ignore
    query = query.where(and(...conditions))
  }

  return await query
}

export async function getInvoiceDetails(invoiceId: number) {
  const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1)
  if (!invoice[0]) return null

  const items = await db.select({
    id: invoiceItems.id,
    name: sql<string>`COALESCE(services.name, products.name)`,
    quantity: invoiceItems.quantity,
    unitPrice: invoiceItems.unitPrice,
    subtotal: invoiceItems.subtotal,
    collabName: collaborators.name,
  })
  .from(invoiceItems)
  .leftJoin(products, eq(invoiceItems.productId, products.id))
  .leftJoin(services, eq(invoiceItems.serviceId, services.id))
  .leftJoin(collaborators, eq(invoiceItems.collaboratorId, collaborators.id))
  .where(eq(invoiceItems.invoiceId, invoiceId))

  return {
    ...invoice[0],
    items
  }
}
