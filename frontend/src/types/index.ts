// Tipe data yang dipakai di seluruh frontend

// Folder dari API (flat)
export interface FolderItem {
  id: number;
  name: string;
  parentId: number | null;
  path: string;
  createdAt: string;
}

// File dari API
export interface FileItem {
  id: number;
  name: string;
  folderId: number;
  size: number;
  mimeType: string;
  createdAt: string;
}

// Preview file - untuk konten file teks atau URL file
export interface FilePreview {
  id: number;
  content?: string;
  url?: string;
}

// Node tree di panel kiri - extended dari FolderItem
export interface TreeNode extends FolderItem {
  children: TreeNode[];
  isOpen: boolean;
}

// Isi folder untuk panel kanan
export interface FolderContents {
  folder: FolderItem;
  folders: FolderItem[];
  files: FileItem[];
}

// Hasil pencarian
export interface SearchResults {
  folders: FolderItem[];
  files: FileItem[];
}

// Response standar dari API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    query?: string;
    total?: number;
  };
}
