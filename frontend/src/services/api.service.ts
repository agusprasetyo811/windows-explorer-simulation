import type {
  ApiResponse,
  FolderItem,
  FolderContents,
  SearchResults,
  FilePreview,
} from '@/types';

// Helper fetch - lempar error kalau response bukan 2xx
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Service API - semua call ke backend melalui sini
export const apiService = {
  // Ambil semua folder (flat) untuk membangun tree
  getFolders(): Promise<ApiResponse<FolderItem[]>> {
    return fetchJson('/api/v1/folders');
  },

  // Ambil subfolder langsung + file dari folder tertentu
  getFolderContents(id: number): Promise<ApiResponse<FolderContents>> {
    return fetchJson(`/api/v1/folders/${id}/contents`);
  },

  // Cari folder dan file
  search(query: string): Promise<ApiResponse<SearchResults> & { meta: { query: string; total: number } }> {
    return fetchJson(`/api/v1/search?q=${encodeURIComponent(query)}`);
  },

  // Buat folder baru
  createFolder(name: string, parentId: number | null): Promise<ApiResponse<FolderItem>> {
    return fetchJson('/api/v1/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId }),
    });
  },

  // Preview file (simulasi - generate content)
  getFilePreview(id: number): Promise<ApiResponse<FilePreview>> {
    return fetchJson(`/api/v1/files/${id}/preview`);
  },
};
