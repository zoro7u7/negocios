import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Usuarios
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "trabajador"] }).notNull().default("trabajador"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Clientes
export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  birthdayDay: integer("birthday_day"), // 1-31
  birthdayMonth: integer("birthday_month"), // 1-12
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Productos
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(), // en USD
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Servicios
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(), // en USD
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Colaboradores
export const collaborators = sqliteTable("collaborators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  area: text("area"),
  commissionPercentage: real("commission_percentage").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Facturas (Invoices)
export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  clientNameSnapshot: text("client_name_snapshot").notNull(),
  clientPhoneSnapshot: text("client_phone_snapshot"),
  bcvRateSnapshot: real("bcv_rate_snapshot").notNull(),
  ivaRateSnapshot: real("iva_rate_snapshot").notNull(),
  totalUsd: real("total_usd").notNull(),
  totalBs: real("total_bs").notNull(),
  ivaAmount: real("iva_amount").notNull(),
  discount: real("discount").notNull().default(0),
  paymentMethod: text("payment_method", { enum: ["efectivo", "punto", "pago_movil", "mixto"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Items de Factura
export const invoiceItems = sqliteTable("invoice_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  serviceId: integer("service_id").references(() => services.id),
  productId: integer("product_id").references(() => products.id),
  collaboratorId: integer("collaborator_id").references(() => collaborators.id),
  referralId: integer("referral_id").references(() => collaborators.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  subtotal: real("subtotal").notNull(),
  commissionPercentage: real("commission_percentage").default(0),
  commissionAmount: real("commission_amount").default(0),
  referralAmount: real("referral_amount").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Pagos de Factura
export const invoicePayments = sqliteTable("invoice_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  paymentMethod: text("payment_method", { enum: ["efectivo", "punto", "pago_movil"] }).notNull(),
  amountUsd: real("amount_usd").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Configuración (Singleton)
export const configuration = sqliteTable("configuration", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bcvRate: real("bcv_rate").notNull().default(0),
  currencySymbol: text("currency_symbol").notNull().default("Bs"),
  referralAmount: real("referral_amount").notNull().default(0), // monto fijo por referido
  ivaRate: real("iva_rate").notNull().default(16), // porcentaje
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
