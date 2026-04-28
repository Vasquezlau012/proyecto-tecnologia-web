import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function initializeDatabase() {
  if (!db) {
    const connection = await mysql.createConnection(
      process.env.DATABASE_URL || "mysql://root:password@localhost:3306/otp_db"
    );
    db = drizzle(connection, { schema });
  }
  return db;
}

export async function getDatabase() {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}
