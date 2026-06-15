<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { FileItem } from '@/types';
import { useExplorer } from '@/composables/useExplorer';
import FolderTree from '@/components/FolderTree.vue';
import FolderContent from '@/components/FolderContent.vue';
import SearchBar from '@/components/SearchBar.vue';

const {
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
} = useExplorer();

const showCreateDialog = ref(false);
const newFolderName = ref('');

onMounted(loadFolders);

async function handleCreate(parentId: number | null): Promise<void> {
  showCreateDialog.value = true;
  newFolderName.value = '';
}

async function confirmCreate(): Promise<void> {
  if (selectedFolder.value) {
    const success = await createFolder(newFolderName.value, selectedFolder.value.id);
    if (success) {
      showCreateDialog.value = false;
      loadFolders();
    }
  }
}

function handlePreview(file: FileItem | null): void {
  previewFile(file);
}
</script>

<template>
  <div class="explorer">
    <!-- Toolbar -->
    <header class="explorer-toolbar">
      <span class="explorer-title">Windows Explorer</span>
      <SearchBar
        :query="searchQuery"
        :is-loading="isSearching"
        @search="search"
        @clear="clearSearch"
      />
    </header>

    <!-- Notifikasi error -->
    <div v-if="error" class="explorer-error" role="alert">
      {{ error }}
      <button class="error-dismiss" @click="error = null">Tutup</button>
    </div>

    <!-- Loading awal -->
    <div v-if="isLoading" class="explorer-loading">Memuat data...</div>

    <!-- Konten utama -->
    <main v-else class="explorer-body">
      <!-- Panel kiri: tree folder -->
      <aside class="panel-left">
        <div class="panel-header">Folder</div>
        <div class="panel-scroll">
          <FolderTree
            :nodes="treeData"
            :selected-id="selectedFolderId"
            @select="selectFolder"
            @toggle="toggleFolder"
          />
        </div>
      </aside>

      <!-- Pemisah -->
      <div class="panel-divider" />

      <!-- Panel kanan: isi folder atau hasil pencarian -->
      <section class="panel-right">
        <div class="panel-header">
          <span v-if="searchResults">
            Hasil pencarian: "{{ searchQuery }}" ({{ searchResults.folders.length + searchResults.files.length }} item)
          </span>
          <span v-else-if="selectedFolder">{{ selectedFolder.name }}</span>
          <span v-else>Pilih folder</span>
        </div>

        <div class="panel-scroll">
          <FolderContent
            :folder="selectedFolder"
            :folders="searchResults ? searchResults.folders : contentFolders"
            :files="searchResults ? searchResults.files : contentFiles"
            :is-loading="isContentLoading || isSearching"
            :is-search-mode="!!searchResults"
            :format-size="formatFileSize"
            :selected-file="selectedFileForPreview"
            :file-preview="filePreview"
            :file-preview-url="filePreviewUrl"
            @navigate="selectFolder"
            @create="handleCreate"
            @preview="handlePreview"
          />
        </div>
      </section>
    </main>

    <!-- Dialog buat folder -->
    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog">
        <h3 class="dialog-title">Buat Folder Baru</h3>
        <input
          v-model="newFolderName"
          type="text"
          class="dialog-input"
          placeholder="Nama folder"
          @keyup.enter="confirmCreate"
        />
        <div class="dialog-actions">
          <button class="btn-cancel" @click="showCreateDialog = false">Batal</button>
          <button class="btn-confirm" @click="confirmCreate">Buat</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-app);
}

.explorer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: var(--bg-toolbar);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.explorer-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.explorer-title::before {
  content: "❖";
  color: var(--accent-color);
  font-size: 1.2rem;
}

.explorer-error {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #fca5a5;
  font-weight: 500;
}

.error-dismiss {
  background: transparent;
  border: none;
  color: #991b1b;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
}

.error-dismiss:hover {
  text-decoration: underline;
}

.explorer-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 1.2rem;
  color: var(--text-tertiary);
}

.explorer-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.panel-left {
  width: 280px;
  min-width: 200px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
}

.panel-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-content);
  min-width: 0;
}

.panel-header {
  padding: 16px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  background-color: inherit;
  z-index: 5;
}

.panel-divider {
  width: 1px;
  background-color: var(--border-color);
  z-index: 10;
  cursor: col-resize;
}

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background-color: var(--bg-content);
  border-radius: var(--radius-md);
  padding: 24px;
  min-width: 320px;
  box-shadow: var(--shadow-lg);
}

.dialog-title {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.dialog-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-cancel, .btn-confirm {
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-confirm {
  background-color: var(--accent-color);
  border: none;
  color: white;
}

.btn-confirm:hover {
  background-color: var(--accent-hover);
}
</style>