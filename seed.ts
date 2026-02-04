import "dotenv/config";
import { db } from "./src/db";
import { users, clients, configuration } from "./src/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding started...");

  // 1. Crear Usuario Admin por defecto
  const hashedPassword = await bcrypt.hash("123456789", 10);
  await db.insert(users).values({
    name: "Administrador",
    username: "admin",
    email: "admin@sistema.com",
    password: hashedPassword,
    role: "admin",
  }).onConflictDoNothing();

  // 2. Crear Cliente General
  await db.insert(clients).values({
    name: "Cliente General",
    phone: "0000",
    email: "general@sistema.com",
  }).onConflictDoNothing();

  // 3. Crear Configuración Inicial
  await db.insert(configuration).values({
    id: 1,
    bcvRate: 0,
    ivaRate: 16,
    referralAmount: 2,
    currencySymbol: "Bs",
  }).onConflictDoUpdate({
    target: configuration.id,
    set: {
      ivaRate: 16,
      referralAmount: 2,
      currencySymbol: "Bs",
    }
  });

  console.log("Seeding finished successfully!");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
