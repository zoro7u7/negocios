"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getServices(search?: string, onlyActive = false) {
  let query = db.select().from(services);

  const filters = [];
  if (search && search.length >= 2) {
    filters.push(like(services.name, `%${search}%`));
  }
  if (onlyActive) {
    filters.push(eq(services.status, "active"));
  }

  // @ts-ignore
  if (filters.length > 0) {
    // @ts-ignore
    query = query.where(filters.length > 1 ? and(...filters) : filters[0]);
  }

  return await query.orderBy(services.name);
}

export async function createService(data: {
  name: string;
  price: number;
  status: "active" | "inactive";
}) {
  const result = await db.insert(services).values(data).returning();
  revalidatePath("/services");
  return result[0];
}

export async function updateService(
  id: number,
  data: {
    name: string;
    price: number;
    status: "active" | "inactive";
  }
) {
  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning();
  revalidatePath("/services");
  return result[0];
}

export async function deleteService(id: number) {
  const result = await db.delete(services).where(eq(services.id, id)).returning();
  revalidatePath("/services");
  return result[0];
}
