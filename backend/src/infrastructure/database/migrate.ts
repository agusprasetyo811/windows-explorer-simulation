import { sql } from 'drizzle-orm';
import { db } from './connection';

// Buat tabel dan index kalau belum ada - idempotent
export async function runMigrations(): Promise<void> {
  console.log('Menjalankan migrasi...');

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS folders (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      parent_id  INTEGER REFERENCES folders(id) ON DELETE CASCADE,
      path       TEXT NOT NULL DEFAULT '/',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS folders_parent_id_idx ON folders(parent_id);
    CREATE INDEX IF NOT EXISTS folders_path_idx      ON folders(path);
    CREATE INDEX IF NOT EXISTS folders_name_idx      ON folders(name);

    CREATE TABLE IF NOT EXISTS files (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      folder_id  INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
      size       BIGINT DEFAULT 0,
      mime_type  VARCHAR(100) DEFAULT 'application/octet-stream',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS files_folder_id_idx ON files(folder_id);
    CREATE INDEX IF NOT EXISTS files_name_idx      ON files(name);
  `);

  console.log('Migrasi selesai.');
}
