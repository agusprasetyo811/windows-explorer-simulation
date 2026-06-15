import { ref, computed } from 'vue';
import { apiService } from '@/services/api.service';
import type { FolderItem, FileItem, TreeNode, FolderContents, SearchResults, FilePreview } from '@/types';

// Bangun tree dari array flat - O(n), lebih efisien dari rekursif naif
function buildTree(items: FolderItem[], openIds: Set<number>): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();

  // Pass 1: buat semua node
  for (const item of items) {
    nodeMap.set(item.id, { ...item, children: [], isOpen: openIds.has(item.id) });
  }

  const roots: TreeNode[] = [];

  // Pass 2: susun relasi parent-child
  for (const node of nodeMap.values()) {
    if (node.parentId === null) {
      roots.push(node);
    } else {
      nodeMap.get(node.parentId)?.children.push(node);
    }
  }

  // Urutkan setiap level berdasarkan nama
  sortNodes(roots);
  return roots;
}

function sortNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => a.name.localeCompare(b.name));
  for (const node of nodes) sortNodes(node.children);
}

// Format ukuran file ke string yang mudah dibaca
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// Generate preview content for text files (simulasi)
function generatePreview(name: string, mimeType: string, size: number): string {
  const lines: string[] = [];
  lines.push(`// File: ${name}`);
  lines.push(`// Type: ${mimeType || 'unknown'}`);
  lines.push(`// Size: ${formatFileSize(size)}`);
  lines.push('');
  
  for (let i = 1; i <= 20; i++) {
    lines.push(`Line ${i}: This is sample preview content for ${name}.`);
  }
  
  return lines.join('\n');
}

// Composable utama - state management untuk explorer
export function useExplorer() {
  const allFolders = ref<FolderItem[]>([]);
  const openFolderIds = ref(new Set<number>());
  const selectedFolderId = ref<number | null>(null);
  const selectedFolder = ref<FolderItem | null>(null);
  const contentFolders = ref<FolderItem[]>([]);
  const contentFiles = ref<FileItem[]>([]);
  const isLoading = ref(false);
  const isContentLoading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const searchResults = ref<SearchResults | null>(null);
  const isSearching = ref(false);
  const selectedFileForPreview = ref<FileItem | null>(null);
  const filePreview = ref<string | null>(null);
  const filePreviewUrl = ref<string | null>(null);

  // Tree dibangun ulang kalau data atau state open berubah
  const treeData = computed(() => buildTree(allFolders.value, openFolderIds.value));

  // Muat semua folder saat pertama buka
  async function loadFolders(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await apiService.getFolders();
      allFolders.value = res.data;
    } catch (e) {
      error.value = 'Gagal memuat data folder. Coba refresh halaman.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  // Pilih folder - muat isinya untuk panel kanan
  async function selectFolder(id: number): Promise<void> {
    // Batalkan pencarian jika ada
    searchQuery.value = '';
    searchResults.value = null;
    selectedFileForPreview.value = null;
    filePreview.value = null;
    filePreviewUrl.value = null;

    selectedFolderId.value = id;
    isContentLoading.value = true;

    try {
      const res = await apiService.getFolderContents(id);
      selectedFolder.value = res.data.folder;
      contentFolders.value = res.data.folders;
      contentFiles.value = res.data.files;
    } catch (e) {
      error.value = 'Gagal memuat isi folder.';
      console.error(e);
    } finally {
      isContentLoading.value = false;
    }
  }

  // Toggle buka/tutup folder di tree
  function toggleFolder(id: number): void {
    const newSet = new Set(openFolderIds.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    openFolderIds.value = newSet;
  }

  // Buat folder baru
  async function createFolder(name: string, parentId: number | null): Promise<boolean> {
    if (!name.trim()) {
      error.value = 'Nama folder tidak boleh kosong';
      return false;
    }

    try {
      const res = await apiService.createFolder(name.trim(), parentId);
      const newFolder = res.data;
      
      // Tambahkan ke tree
      allFolders.value.push(newFolder);
      openFolderIds.value = new Set(openFolderIds.value).add(parentId ?? 0);
      
      return true;
    } catch (e) {
      error.value = 'Gagal membuat folder.';
      console.error(e);
      return false;
    }
  }

  // Preview file
  async function previewFile(file: FileItem | null): Promise<void> {
    selectedFileForPreview.value = file;

    if (!file) {
      filePreview.value = null;
      filePreviewUrl.value = null;
      return;
    }
    
    try {
      const res = await apiService.getFilePreview(file.id);
      filePreview.value = res.data.content ?? null;
      filePreviewUrl.value = res.data.url ?? null;
    } catch (e) {
      filePreview.value = generatePreview(file.name, file.mimeType, file.size);
      filePreviewUrl.value = null;
    }
  }

  // Cari folder dan file
  async function search(query: string): Promise<void> {
    searchQuery.value = query;

    if (!query.trim()) {
      searchResults.value = null;
      return;
    }

    isSearching.value = true;
    try {
      const res = await apiService.search(query);
      searchResults.value = res.data;
    } catch (e) {
      error.value = 'Gagal melakukan pencarian.';
      console.error(e);
    } finally {
      isSearching.value = false;
    }
  }

  // Reset ke kondisi awal
  function clearSearch(): void {
    searchQuery.value = '';
    searchResults.value = null;
  }

  return {
    treeData,
    selectedFolderId,
    selectedFolder,
    contentFolders,
    contentFiles,
    isLoading,
    isContentLoading,
    error,
    searchQuery,
    searchResults,
    isSearching,
    selectedFileForPreview,
    filePreview,
    filePreviewUrl,
    loadFolders,
    selectFolder,
    toggleFolder,
    createFolder,
    previewFile,
    search,
    clearSearch,
    formatFileSize,
  };
}
