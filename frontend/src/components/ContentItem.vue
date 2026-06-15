<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'folder' | 'file';
  name: string;
  meta: string;
}>();

const emit = defineEmits<{
  (e: 'dblclick'): void;
}>();

const icon = computed(() => {
  return props.type === 'folder' ? '📁' : '📄';
});
</script>

<template>
  <div 
    class="content-item" 
    @dblclick="emit('dblclick')"
    :class="{ 'is-folder': type === 'folder' }"
  >
    <div class="item-icon">{{ icon }}</div>
    <div class="item-details">
      <div class="item-name">{{ name }}</div>
      <div class="item-meta">{{ meta }}</div>
    </div>
  </div>
</template>

<style scoped>
.content-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: default;
  user-select: none;
  transition: all var(--transition-fast);
  text-align: center;
  background-color: transparent;
}

.content-item.is-folder {
  cursor: pointer;
}

.content-item:hover {
  background-color: var(--bg-hover);
  border-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.item-icon {
  font-size: 48px;
  margin-bottom: 12px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.item-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>

