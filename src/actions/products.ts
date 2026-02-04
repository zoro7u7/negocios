"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, like, or, and, gt, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts(search?: string, filter?: "low_stock" | "available") {
  let query = db.select().from(products);

  const filters = [];
  
  if (search && search.length >= 2) {
    filters.push(
      or(
        like(products.name, `%${search}%`),
        like(products.sku, `%${search}%`)
      )
    );
  }

  if (filter === "low_stock") {
    filters.push(lte(products.stock, products.minStock));
  } else if (filter === "available") {
    filters.push(gt(products.stock, 0));
  }

  // @ts-ignore
  if (filters.length > 0) {
    // @ts-ignore
    query = query.where(and(...filters));
  }

  return await query.orderBy(products.name);
}

export async function createProduct(data: {
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
}) {
  const result = await db.insert(products).values(data).returning();
  revalidatePath("/products");
  return result[0];
}

export async function updateProduct(
  id: number,
  data: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    minStock: number;
  }
) {
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  revalidatePath("/products");
  return result[0];
}

export async function deleteProduct(id: number) {
  const result = await db.delete(products).where(eq(products.id, id)).returning();
  revalidatePath("/products");
  return result[0];
}
