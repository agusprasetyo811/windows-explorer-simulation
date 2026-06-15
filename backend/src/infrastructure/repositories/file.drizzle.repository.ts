import { eq, ilike, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import { files } from '../database/schema';
import type { IFileRepository } from '../../domain/repositories/file.repository.interface';
import type { File } from '../../domain/entities/file.entity';

// Implementasi repo file menggunakan Drizzle ORM + PostgreSQL
export class DrizzleFileRepository implements IFileRepository {
  // Ambil semua file dalam satu folder
  async findByFolderId(folderId: number): Promise<File[]> {
    const rows = await db
      .select()
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(asc(files.name));
    return rows.map(this.toEntity);
  }

  // Cari satu file by ID
  async findById(id: number): Promise<File | null> {
    const [row] = await db.select().from(files).where(eq(files.id, id)).limit(1);
    return row ? this.toEntity(row) : null;
  }

  // Cari file berdasarkan nama
  async search(query: string): Promise<File[]> {
    const rows = await db
      .select()
      .from(files)
      .where(ilike(files.name, `%${query}%`))
      .orderBy(asc(files.name))
      .limit(100);
    return rows.map(this.toEntity);
  }

  // Konversi row DB ke entitas domain
  private toEntity(row: typeof files.$inferSelect): File {
    return {
      id: row.id,
      name: row.name,
      folderId: row.folderId,
      size: row.size ?? 0,
      mimeType: row.mimeType ?? 'application/octet-stream',
      createdAt: row.createdAt,
    };
  }
}
