<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  query: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'clear'): void;
}>();

const localQuery = ref(props.query);

watch(() => props.query, (newVal) => {
  localQuery.value = newVal;
});

const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit('search', localQuery.value.trim());
  } else {
    emit('clear');
  }
};

const handleClear = () => {
  localQuery.value = '';
  emit('clear');
};
</script>

<template>
  <div class="search-bar" :class="{ 'is-loading': isLoading }">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        v-model="localQuery" 
        @keyup.enter="handleSearch"
        placeholder="Search..."
        :disabled="isLoading"
        class="search-input"
      />
      <button 
        v-if="localQuery" 
        class="search-clear" 
        @click="handleClear" 
        title="Clear search"
      >
        ×
      </button>
    </div>
    <button class="search-button" @click="handleSearch" :disabled="isLoading">
      Search
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 250px;
  padding: 8px 32px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
  background-color: var(--bg-app);
  transition: all var(--transition-fast);
  outline: none;
}

.search-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background-color: #fff;
}

.search-clear {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 18px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0 4px;
  border-radius: 50%;
  line-height: 1;
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--text-primary);
}

.search-button {
  padding: 8px 16px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
  box-shadow: var(--shadow-sm);
}

.search-button:disabled, .search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-bar.is-loading .search-icon {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>

