// Entitas folder - representasi data di domain
export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  path: string;
  createdAt: Date;
}

// Folder lengkap dengan relasi anak (untuk membangun tree)
export interface FolderNode extends Folder {
  children: FolderNode[];
}
