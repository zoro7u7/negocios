"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClients(search?: string) {
  if (search && search.length >= 2) {
    return await db
      .select()
      .from(clients)
      .where(
        or(
          like(clients.name, `%${search}%`),
          like(clients.phone, `%${search}%`)
        )
      )
      .orderBy(clients.name);
  }
  return await db.select().from(clients).orderBy(clients.name);
}

export async function createClient(data: {
  name: string;
  phone?: string;
  email?: string;
  birthdayDay?: number;
  birthdayMonth?: number;
}) {
  const result = await db.insert(clients).values(data).returning();
  revalidatePath("/clients");
  return result[0];
}

export async function updateClient(
  id: number,
  data: {
    name: string;
    phone?: string;
    email?: string;
    birthdayDay?: number;
    birthdayMonth?: number;
  }
) {
  const result = await db
    .update(clients)
    .set(data)
    .where(eq(clients.id, id))
    .returning();
  revalidatePath("/clients");
  return result[0];
}

export async function deleteClient(id: number) {
  const result = await db.delete(clients).where(eq(clients.id, id)).returning();
  revalidatePath("/clients");
  return result[0];
}
