import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import type { IFileRepository } from '../../domain/repositories/file.repository.interface';
import type { Folder } from '../../domain/entities/folder.entity';
import type { File } from '../../domain/entities/file.entity';

// Hasil query isi folder
export interface FolderContents {
  folder: Folder;
  folders: Folder[];
  files: File[];
}

// Hasil pencarian
export interface SearchResults {
  folders: Folder[];
  files: File[];
}

// Service layer - logika bisnis, tidak tahu detail penyimpanan data
export class FolderService {
  constructor(
    private readonly folderRepo: IFolderRepository,
    private readonly fileRepo: IFileRepository,
  ) {}

  // Ambil semua folder - untuk membangun tree di frontend
  async getAllFolders(): Promise<Folder[]> {
    return this.folderRepo.findAll();
  }

  // Ambil isi folder: subfolder langsung + file
  async getFolderContents(folderId: number): Promise<FolderContents | null> {
    const folder = await this.folderRepo.findById(folderId);
    if (!folder) return null;

    // Jalankan paralel - lebih cepat
    const [subfolders, files] = await Promise.all([
      this.folderRepo.findByParentId(folderId),
      this.fileRepo.findByFolderId(folderId),
    ]);

    return { folder, folders: subfolders, files };
  }

  // Cari folder dan file berdasarkan nama
  async search(query: string): Promise<SearchResults> {
    const trimmed = query.trim();
    if (!trimmed) return { folders: [], files: [] };

    // Cari paralel
    const [folders, files] = await Promise.all([
      this.folderRepo.search(trimmed),
      this.fileRepo.search(trimmed),
    ]);

    return { folders, files };
  }

  // Buat folder baru
  async createFolder(name: string, parentId: number | null): Promise<Folder> {
    if (!name.trim()) {
      throw new Error('Nama folder tidak boleh kosong');
    }
    return this.folderRepo.create(name.trim(), parentId);
  }
}
