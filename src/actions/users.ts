"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { auth } from "@/auth"

export async function getUsers() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Acceso denegado")
  
  return await db.select({
    id: users.id,
    name: users.name,
    username: users.username,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt
  }).from(users)
}

export async function createUser(data: any) {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Acceso denegado")

  const hashedPassword = await bcrypt.hash(data.password, 10)
  
  const [newUser] = await db.insert(users).values({
    ...data,
    password: hashedPassword,
  }).returning()

  revalidatePath("/(dashboard)/settings/users")
  return newUser
}

export async function updateUser(id: number, data: any) {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Acceso denegado")

  const updateData: any = { ...data }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10)
  } else {
    delete updateData.password
  }

  const [updatedUser] = await db.update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning()

  revalidatePath("/(dashboard)/settings/users")
  return updatedUser
}

export async function deleteUser(id: number) {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Acceso denegado")
  
  // No permitir al admin borrarse a sí mismo si es el único o algo así, 
  // pero por ahora simple validación de id
  if (parseInt(session.user.id!) === id) {
    throw new Error("No puedes eliminar tu propio usuario administrador")
  }

  await db.delete(users).where(eq(users.id, id))
  revalidatePath("/(dashboard)/settings/users")
}
