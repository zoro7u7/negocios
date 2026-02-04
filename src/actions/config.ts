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
export async function syncBcvRate() {
  // En una implementación real, aquí se usaría un scraper del BCV.
  // Por ahora, simularemos que obtenemos una tasa actualizada.
  // Podríamos usar una API externa si estuviera disponible.
  const mockNewRate = 50.25; // Ejemplo de tasa actualizada

  const result = await db
    .update(configuration)
    .set({
      bcvRate: mockNewRate,
      updatedAt: new Date(),
    })
    .where(eq(configuration.id, 1))
    .returning();

  revalidatePath("/settings");
  revalidatePath("/");
  return result[0];
}
