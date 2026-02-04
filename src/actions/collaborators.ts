"use server";

import { db } from "@/db";
import { collaborators } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCollaborators(search?: string, onlyActive = false) {
  let query = db.select().from(collaborators);

  const filters = [];
  if (search && search.length >= 2) {
    filters.push(like(collaborators.name, `%${search}%`));
  }
  if (onlyActive) {
    filters.push(eq(collaborators.active, true));
  }

  // @ts-ignore
  if (filters.length > 0) {
    // @ts-ignore
    query = query.where(filters.length > 1 ? and(...filters) : filters[0]);
  }

  return await query.orderBy(collaborators.name);
}

export async function createCollaborator(data: {
  name: string;
  area?: string;
  commissionPercentage: number;
  active: boolean;
}) {
  const result = await db.insert(collaborators).values(data).returning();
  revalidatePath("/collaborators");
  return result[0];
}

export async function updateCollaborator(
  id: number,
  data: {
    name: string;
    area?: string;
    commissionPercentage: number;
    active: boolean;
  }
) {
  const result = await db
    .update(collaborators)
    .set(data)
    .where(eq(collaborators.id, id))
    .returning();
  revalidatePath("/collaborators");
  return result[0];
}

export async function deleteCollaborator(id: number) {
  const result = await db
    .delete(collaborators)
    .where(eq(collaborators.id, id))
    .returning();
  revalidatePath("/collaborators");
  return result[0];
}
