import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import { config } from '../../config/env';

// Koneksi pool ke PostgreSQL
const queryClient = postgres(config.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
export type Database = typeof db;

// Tunggu DB siap dengan retry - penting untuk Docker startup
export async function waitForDatabase(retries = 15, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await db.execute(sql`SELECT 1`);
      console.log('Database terhubung.');
      return;
    } catch {
      console.log(`DB belum siap, percobaan ${attempt}/${retries}...`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw new Error('Tidak bisa terhubung ke database setelah beberapa percobaan.');
}
