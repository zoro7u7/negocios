"use server";

import { db } from "@/db";
import { configuration } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getConfig() {
  const result = await db.select().from(configuration).where(eq(configuration.id, 1)).limit(1);
  return result[0];
}

export async function updateConfig(data: {
  bcvRate?: number;
  currencySymbol?: string;
  referralAmount?: number;
  ivaRate?: number;
}) {
  const result = await db
    .update(configuration)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(configuration.id, 1))
    .returning();
  revalidatePath("/settings");
  revalidatePath("/"); // Dashboard might use this
  return result[0];
}
