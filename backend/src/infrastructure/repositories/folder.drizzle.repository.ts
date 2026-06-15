import { eq, isNull, ilike, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import { folders } from '../database/schema';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import type { Folder } from '../../domain/entities/folder.entity';
import { count } from 'drizzle-orm';

// Implementasi repo folder menggunakan Drizzle ORM + PostgreSQL
export class DrizzleFolderRepository implements IFolderRepository {
  // Ambil semua folder, urut berdasarkan nama
  async findAll(): Promise<Folder[]> {
    const rows = await db.select().from(folders).orderBy(asc(folders.name));
    return rows.map(this.toEntity);
  }

  // Cari satu folder by ID
  async findById(id: number): Promise<Folder | null> {
    const [row] = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
    return row ? this.toEntity(row) : null;
  }

  // Ambil anak langsung dari suatu folder (atau root kalau parentId null)
  async findByParentId(parentId: number | null): Promise<Folder[]> {
    const rows =
      parentId === null
        ? await db.select().from(folders).where(isNull(folders.parentId)).orderBy(asc(folders.name))
        : await db
            .select()
            .from(folders)
            .where(eq(folders.parentId, parentId))
            .orderBy(asc(folders.name));
    return rows.map(this.toEntity);
  }

  // Cari folder berdasarkan nama (case-insensitive)
  async search(query: string): Promise<Folder[]> {
    const rows = await db
      .select()
      .from(folders)
      .where(ilike(folders.name, `%${query}%`))
      .orderBy(asc(folders.name))
      .limit(100);
    return rows.map(this.toEntity);
  }

  // Hitung total folder
  async count(): Promise<number> {
    const [result] = await db.select({ total: count() }).from(folders);
    return result.total;
  }

  // Buat folder baru
  async create(name: string, parentId: number | null): Promise<Folder> {
    const parent = parentId ? await this.findById(parentId) : null;
    const path = parent ? `${parent.path}${parentId}/` : `/`;
    
    const [row] = await db
      .insert(folders)
      .values({ name, parentId: parentId ?? undefined, path })
      .returning();
    return this.toEntity(row);
  }

  // Konversi row DB ke entitas domain
  private toEntity(row: typeof folders.$inferSelect): Folder {
    return {
      id: row.id,
      name: row.name,
      parentId: row.parentId ?? null,
      path: row.path,
      createdAt: row.createdAt,
    };
  }
}
