import type { File } from '../entities/file.entity';

// Kontrak akses data file
export interface IFileRepository {
  findByFolderId(folderId: number): Promise<File[]>;
  findById(id: number): Promise<File | null>;
  search(query: string): Promise<File[]>;
}
