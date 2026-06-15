<script setup lang="ts">
import { computed } from 'vue';
import type { FolderItem, FileItem } from '@/types';
import ContentItem from './ContentItem.vue';

const props = defineProps<{
  folder: FolderItem | null;
  folders: FolderItem[];
  files: FileItem[];
  isLoading: boolean;
  isSearchMode: boolean;
  formatSize: (bytes: number) => string;
  selectedFile: FileItem | null;
  filePreview: string | null;
  filePreviewUrl: string | null;
}>();

const emit = defineEmits<{
  navigate: [id: number];
  create: [parentId: number | null];
  preview: [file: FileItem | null];
}>();

const totalItems = computed(() => props.folders.length + props.files.length);
const isEmpty = computed(() => !props.isLoading && totalItems.value === 0 && !props.selectedFile);
const showPreview = computed(() => !!props.selectedFile);
const isPdfPreview = computed(() => {
  const fileName = props.selectedFile?.name.toLowerCase() ?? '';
  return fileName.endsWith('.pdf') || props.selectedFile?.mimeType === 'application/pdf';
});
const safePreviewUrl = computed(() => {
  const url = props.filePreviewUrl;
  if (!url || !isSafePreviewUrl(url)) return null;
  return url;
});
const metadataRows = computed(() => {
  if (!props.selectedFile) return [];

  return [
    ['ID', String(props.selectedFile.id)],
    ['Nama', props.selectedFile.name],
    ['Tipe', props.selectedFile.mimeType || 'unknown'],
    ['Ukuran', props.formatSize(props.selectedFile.size)],
    ['Folder ID', String(props.selectedFile.folderId)],
    ['Dibuat', formatDate(props.selectedFile.createdAt)],
  ];
});

function isSafePreviewUrl(url: string): boolean {
  if (url.startsWith('//')) return false;
  return /^https?:\/\//.test(url) || /^\/(?!\/)/.test(url) || /^\.{1,2}\//.test(url);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
</script>

<template>
  <div class="content-panel">
    <!-- Toolbar untuk membuat folder -->
    <div v-if="folder && !isSearchMode && !showPreview" class="content-toolbar">
      <button class="btn-new-folder" @click="emit('create', folder.id)">
        <span class="btn-icon">+</span>
        Folder Baru
      </button>
    </div>

    <!-- State: loading -->
    <div v-if="isLoading" class="content-state">Memuat...</div>

    <!-- State: belum pilih folder -->
    <div v-else-if="!folder && !isSearchMode && !showPreview" class="content-state content-state--hint">
      Pilih folder di panel kiri untuk melihat isinya
    </div>

    <!-- State: hasil pencarian atau isi folder kosong -->
    <div v-else-if="isEmpty" class="content-state">
      {{ isSearchMode ? 'Tidak ada hasil yang ditemukan' : 'Folder kosong' }}
    </div>

    <!-- File Preview -->
    <div v-else-if="showPreview" class="file-preview">
      <div class="preview-header">
        <span class="preview-title">{{ selectedFile?.name }}</span>
        <button class="preview-close" @click="emit('preview', null)">×</button>
      </div>

      <div class="preview-layout">
        <div class="preview-main">
          <iframe
            v-if="isPdfPreview && safePreviewUrl"
            class="pdf-preview"
            :src="safePreviewUrl"
            :title="selectedFile?.name"
            sandbox="allow-scripts"
            referrerpolicy="no-referrer"
          />
          <div v-else-if="isPdfPreview" class="preview-fallback">
            Preview PDF belum tersedia. Pastikan API mengembalikan URL file PDF.
          </div>
          <pre v-else-if="filePreview" class="preview-content">{{ filePreview }}</pre>
          <div v-else class="preview-fallback">Preview untuk tipe file ini belum tersedia.</div>
        </div>

        <aside v-if="selectedFile" class="metadata-panel">
          <div class="metadata-title">Metadata File</div>
          <dl class="metadata-list">
            <div v-for="[label, value] in metadataRows" :key="label" class="metadata-row">
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>

    <!-- Daftar isi -->
    <div v-else class="content-list">
      <!-- Folder -->
      <ContentItem
        v-for="subfolder in folders"
        :key="`folder-${subfolder.id}`"
        type="folder"
        :name="subfolder.name"
        :meta="isSearchMode ? subfolder.path : 'Folder'"
        @dblclick="emit('navigate', subfolder.id)"
      />

      <!-- File -->
      <ContentItem
        v-for="file in files"
        :key="`file-${file.id}`"
        type="file"
        :name="file.name"
        :meta="formatSize(file.size)"
        @dblclick="emit('preview', file)"
      />
    </div>
  </div>
</template>

<style scoped>
.content-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-toolbar {
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-content);
}

.btn-new-folder {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color var(--transition-fast);
}

.btn-new-folder:hover {
  background-color: var(--accent-hover);
}

.btn-icon {
  font-size: 1rem;
  font-weight: 600;
}

.content-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--text-tertiary);
  font-size: 1.1rem;
  padding: 40px;
  text-align: center;
}

.content-state--hint {
  color: var(--text-secondary);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center 40%;
  padding-top: 120px;
}

.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 24px;
  align-content: start;
}

.file-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-content);
}

.preview-title {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 0;
  line-height: 1;
}

.preview-close:hover {
  color: var(--text-primary);
}

.preview-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
}

.preview-main {
  min-width: 0;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: #fff;
}

.preview-content {
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.85rem;
  color: var(--text-primary);
  overflow: auto;
  white-space: pre-wrap;
  background-color: #fff;
}

.preview-fallback {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  background-color: #fff;
  text-align: center;
  padding: 24px;
}

.metadata-panel {
  min-width: 0;
  border-left: 1px solid var(--border-color);
  background-color: var(--bg-sidebar);
  overflow-y: auto;
  padding: 16px 20px;
}

.metadata-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.metadata-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metadata-row {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.metadata-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metadata-row dt {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}

.metadata-row dd {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-primary);
  word-break: break-word;
}

@media (max-width: 900px) {
  .preview-layout {
    grid-template-columns: 1fr;
  }

  .metadata-panel {
    border-left: none;
    border-top: 1px solid var(--border-color);
  }
}
</style>
