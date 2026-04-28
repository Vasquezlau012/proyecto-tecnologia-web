import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  nombre: varchar("nombre", { length: 255 }),
  verificado: int("verificado").default(0),
  creado_en: timestamp("creado_en").defaultNow(),
});

export const otp_codes = mysqlTable("otp_codes", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  codigo: varchar("codigo", { length: 6 }).notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
  expira_en: timestamp("expira_en").notNull(),
  usado: int("usado").default(0),
});

export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  edad: int("edad"),
  calificacion: int("calificacion"),
  creado_en: timestamp("creado_en").defaultNow(),
  actualizado_en: timestamp("actualizado_en").defaultNow().onUpdateNow(),
});

export type User = typeof users.$inferSelect;
export type OTPCode = typeof otp_codes.$inferSelect;
export type Student = typeof students.$inferSelect;
