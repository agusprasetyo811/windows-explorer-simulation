<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from '@/types';
// Import diri sendiri untuk rekursi
import FolderTreeNode from './FolderTreeNode.vue';

const props = defineProps<{
  node: TreeNode;
  selectedId: number | null;
  depth: number;
}>();

const emit = defineEmits<{
  select: [id: number];
  toggle: [id: number];
}>();

const hasChildren = computed(() => props.node.children.length > 0);
const isSelected = computed(() => props.selectedId === props.node.id);

// Indentasi berdasarkan kedalaman - 16px per level
const indentStyle = computed(() => ({
  paddingLeft: `${props.depth * 16 + 8}px`,
}));

function handleRowClick(): void {
  // Pilih folder ini
  emit('select', props.node.id);
  // Jika folder punya anak: toggle buka/tutup saat diklik
  if (hasChildren.value) {
    emit('toggle', props.node.id);
  }
}

function handleCaretClick(e: MouseEvent): void {
  // Klik caret hanya toggle, tidak ubah selection
  e.stopPropagation();
  emit('toggle', props.node.id);
}
</script>

<template>
  <div class="tree-node" role="treeitem" :aria-expanded="hasChildren ? node.isOpen : undefined">
    <div
      class="tree-row"
      :class="{ 'tree-row--selected': isSelected }"
      :style="indentStyle"
      @click="handleRowClick"
    >
      <!-- Tombol expand/collapse (caret) - hanya muncul kalau punya anak -->
      <span
        v-if="hasChildren"
        class="tree-toggle"
        :class="{ 'tree-toggle--open': node.isOpen }"
        title="Buka/tutup folder"
        @click="handleCaretClick"
      />
      <!-- Spacer kalau tidak punya anak (supaya rata) -->
      <span v-else class="tree-toggle-spacer" />

      <!-- Indikator folder (CSS only) - berubah icon saat terbuka -->
      <span
        class="tree-folder-icon"
        :class="{
          'tree-folder-icon--open': node.isOpen && hasChildren,
          'tree-folder-icon--selected': isSelected,
        }"
      />

      <span class="tree-label">{{ node.name }}</span>
    </div>

    <!-- Rekursif render anak dengan transisi slide -->
    <Transition name="tree-slide">
      <div v-if="node.isOpen && hasChildren" class="tree-children" role="group">
        <FolderTreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :selected-id="selectedId"
          :depth="depth + 1"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tree-node {
  user-select: none;
}

.tree-row {
  display: flex;
  align-items: center;
  padding: 5px 12px 5px 0;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
  color: var(--text-primary);
  font-size: 0.875rem;
  min-height: 30px;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin-right: 8px;
  gap: 2px;
}

.tree-row:hover {
  background-color: var(--bg-hover);
}

.tree-row--selected {
  background-color: var(--bg-active);
  color: var(--accent-hover);
  font-weight: 500;
}

.tree-row--selected:hover {
  background-color: #bfdbfe;
}

/* ── Caret toggle ──────────────────────────────── */
.tree-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-right: 2px;
  border-radius: 3px;
  transition: background-color var(--transition-fast);
}

.tree-toggle:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

/* SVG caret drawn in CSS */
.tree-toggle::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid var(--text-tertiary);
  transition: transform 0.18s ease;
}

.tree-toggle--open::before {
  transform: rotate(90deg);
}

.tree-toggle-spacer {
  flex-shrink: 0;
  width: 20px;
}

/* ── Folder icons (closed / open / selected) ───── */
.tree-folder-icon {
  flex-shrink: 0;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 7px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  /* Closed folder – grey */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23607897" stroke="%23607897" stroke-width="0"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>');
}

/* Open folder (has children & is expanded) – amber/yellow like Windows */
.tree-folder-icon--open {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f5a623" stroke="%23e09410" stroke-width="0.5"><path d="M20 6h-8l-2-2H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/><path d="M4 8h16v10H4z" fill="%23ffc854" opacity="0.6"/></svg>');
}

/* Selected state – blue */
.tree-folder-icon--selected {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6" stroke="%232563eb" stroke-width="0"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>');
}

/* Open + selected – blue open folder */
.tree-folder-icon--open.tree-folder-icon--selected {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6" stroke="%232563eb" stroke-width="0.5"><path d="M20 6h-8l-2-2H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/><path d="M4 8h16v10H4z" fill="%2393c5fd" opacity="0.5"/></svg>');
}

/* ── Label ─────────────────────────────────────── */
.tree-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

/* ── Children indented guide line ──────────────── */
.tree-children {
  position: relative;
}

/* ── Slide transition for expand/collapse ──────── */
.tree-slide-enter-active,
.tree-slide-leave-active {
  overflow: hidden;
  transition: max-height 0.2s ease, opacity 0.15s ease;
  max-height: 2000px; /* large enough for any subtree */
  opacity: 1;
}

.tree-slide-enter-from,
.tree-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

