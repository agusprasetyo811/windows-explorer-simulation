<script setup lang="ts">
import type { TreeNode } from '@/types';
import FolderTreeNode from './FolderTreeNode.vue';

defineProps<{
  nodes: TreeNode[];
  selectedId: number | null;
}>();

const emit = defineEmits<{
  select: [id: number];
  toggle: [id: number];
}>();
</script>

<template>
  <div class="folder-tree" role="tree">
    <p v-if="nodes.length === 0" class="tree-empty">Tidak ada folder</p>
    <FolderTreeNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :selected-id="selectedId"
      :depth="0"
      @select="emit('select', $event)"
      @toggle="emit('toggle', $event)"
    />
  </div>
</template>

<style scoped>
.folder-tree {
  padding-bottom: 24px;
}

.tree-empty {
  padding: 16px 24px;
  color: var(--text-tertiary);
  font-style: italic;
  font-size: 0.9rem;
}
</style>
