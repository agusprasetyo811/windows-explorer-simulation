import type { Folder } from '../entities/folder.entity';

// Kontrak akses data folder - implementasi bisa diganti tanpa ubah logika bisnis
export interface IFolderRepository {
  findAll(): Promise<Folder[]>;
  findById(id: number): Promise<Folder | null>;
  findByParentId(parentId: number | null): Promise<Folder[]>;
  search(query: string): Promise<Folder[]>;
  count(): Promise<number>;
  create(name: string, parentId: number | null): Promise<Folder>;
}
