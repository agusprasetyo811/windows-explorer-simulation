import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { FolderService } from '../application/services/folder.service';
import type { IFolderRepository } from '../domain/repositories/folder.repository.interface';
import type { IFileRepository } from '../domain/repositories/file.repository.interface';
import type { Folder } from '../domain/entities/folder.entity';
import type { File } from '../domain/entities/file.entity';

// Data dummy untuk test
const mockFolders: Folder[] = [
  { id: 1, name: 'Documents', parentId: null, path: '/1/', createdAt: new Date() },
  { id: 2, name: 'Work', parentId: 1, path: '/1/2/', createdAt: new Date() },
  { id: 3, name: 'Projects', parentId: 2, path: '/1/2/3/', createdAt: new Date() },
];

const mockFiles: File[] = [
  { id: 1, name: 'README.md', folderId: 3, size: 2048, mimeType: 'text/markdown', createdAt: new Date() },
];

// Mock repository - tidak sentuh DB
const createMockFolderRepo = (): IFolderRepository => ({
  findAll: mock(() => Promise.resolve(mockFolders)),
  findById: mock((id: number) => Promise.resolve(mockFolders.find((f) => f.id === id) ?? null)),
  findByParentId: mock((parentId: number | null) =>
    Promise.resolve(mockFolders.filter((f) => f.parentId === parentId)),
  ),
  search: mock((q: string) =>
    Promise.resolve(mockFolders.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()))),
  ),
  count: mock(() => Promise.resolve(mockFolders.length)),
  create: mock((name: string, parentId: number | null) => {
    const parent = parentId ? mockFolders.find((f) => f.id === parentId) : null;
    const path = parent ? `${parent.path}${name}/` : `/${name}/`;
    const newFolder: Folder = {
      id: 999,
      name,
      parentId,
      path,
      createdAt: new Date(),
    };
    return Promise.resolve(newFolder);
  }),
});

const createMockFileRepo = (): IFileRepository => ({
  findByFolderId: mock((folderId: number) =>
    Promise.resolve(mockFiles.filter((f) => f.folderId === folderId)),
  ),
  findById: mock((id: number) => Promise.resolve(mockFiles.find((f) => f.id === id) ?? null)),
  search: mock((q: string) =>
    Promise.resolve(mockFiles.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()))),
  ),
});

describe('FolderService', () => {
  let folderRepo: IFolderRepository;
  let fileRepo: IFileRepository;
  let service: FolderService;

  beforeEach(() => {
    folderRepo = createMockFolderRepo();
    fileRepo = createMockFileRepo();
    service = new FolderService(folderRepo, fileRepo);
  });

  describe('getAllFolders', () => {
    it('mengembalikan semua folder', async () => {
      const result = await service.getAllFolders();
      expect(result).toHaveLength(3);
      expect(folderRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFolderContents', () => {
    it('mengembalikan isi folder yang valid', async () => {
      const result = await service.getFolderContents(1);
      expect(result).not.toBeNull();
      expect(result?.folder.id).toBe(1);
      expect(result?.folders).toHaveLength(1); // Work
      expect(result?.files).toHaveLength(0);
    });

    it('mengembalikan null kalau folder tidak ada', async () => {
      const result = await service.getFolderContents(999);
      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('menemukan folder berdasarkan nama', async () => {
      const result = await service.search('doc');
      expect(result.folders.length).toBeGreaterThan(0);
    });

    it('mengembalikan kosong untuk query kosong', async () => {
      const result = await service.search('');
      expect(result.folders).toHaveLength(0);
      expect(result.files).toHaveLength(0);
    });

    it('menemukan file berdasarkan nama', async () => {
      const result = await service.search('readme');
      expect(result.files.length).toBeGreaterThan(0);
    });
  });

  describe('createFolder', () => {
    it('membuat folder baru dengan parentId null', async () => {
      const result = await service.createFolder('NewFolder', null);
      expect(result.name).toBe('NewFolder');
      expect(result.parentId).toBeNull();
      expect(result.path).toBe('/');
      expect(folderRepo.create).toHaveBeenCalledWith('NewFolder', null);
    });

    it('membuat folder baru dengan parentId', async () => {
      const result = await service.createFolder('SubFolder', 1);
      expect(result.name).toBe('SubFolder');
      expect(result.parentId).toBe(1);
      expect(result.path).toBe('/1/');
    });

    it('melemparkan error untuk nama kosong', async () => {
      await expect(service.createFolder('', 1)).rejects.toThrow('Nama folder tidak boleh kosong');
    });

    it('menge-trim nama folder', async () => {
      await service.createFolder('  Trimmed  ', null);
      expect(folderRepo.create).toHaveBeenCalledWith('Trimmed', null);
    });
  });
});
