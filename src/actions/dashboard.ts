"use server"

import { db } from "@/db"
import { invoices, clients, products } from "@/db/schema"
import { sql, gte } from "drizzle-orm"

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [salesResult] = await db.select({
    totalUsd: sql<number>`COALESCE(sum(${invoices.totalUsd}), 0)`,
    totalBs: sql<number>`COALESCE(sum(${invoices.totalBs}), 0)`,
    count: sql<number>`count(${invoices.id})`
  })
    .from(invoices)
    .where(gte(invoices.createdAt, today))

  const [totalClients] = await db.select({
    count: sql<number>`count(${clients.id})`
  }).from(clients)

  const [lowStock] = await db.select({
    count: sql<number>`count(${products.id})`
  })
    .from(products)
    .where(sql`${products.stock} <= 5`)

  return {
    todaySalesUsd: salesResult.totalUsd,
    todaySalesBs: salesResult.totalBs,
    todaySalesCount: salesResult.count,
    totalClients: totalClients.count,
    lowStockCount: lowStock.count
  }
}
