<script setup lang="ts">
import { computed } from 'vue';
import UiButton from './UiButton.vue';
import { useUiConfig } from './config';
const props = withDefaults(defineProps<{
  total: number; pageSize?: number; disabled?: boolean;
  label?: string; previousLabel?: string; nextLabel?: string; summary?: string;
}>(), { pageSize: 20 });
const page = defineModel<number>({ required: true });
const { tr } = useUiConfig();
const pages = computed(() => Math.max(1, Math.ceil(Math.max(0, props.total) / Math.max(1, props.pageSize))));
const current = computed(() => Math.min(pages.value, Math.max(1, page.value)));
const visible = computed(() => {
  const start = Math.max(1, Math.min(current.value - 1, pages.value - 2));
  return Array.from({ length: Math.min(3, pages.value) }, (_, i) => start + i);
});
function go(value: number) { if (!props.disabled) page.value = Math.min(pages.value, Math.max(1, value)); }
</script>
<template>
  <nav class="gp-pagination" :aria-label="label || tr('pagination')" :aria-busy="disabled || undefined">
    <span class="gp-pagination-summary" role="status">{{ summary || tr('pageSummary', {page:current, pages, total: Math.max(0,total)}) }}</span>
    <div class="gp-pagination-controls">
      <UiButton variant="secondary" :disabled="disabled || current <= 1" @click="go(current - 1)">{{ previousLabel || tr('previousPage') }}</UiButton>
      <button v-for="value in visible" :key="value" type="button" class="gp-pagination-page" :disabled="disabled" :aria-label="tr('pageNumber', {page:value})" :aria-current="value === current ? 'page' : undefined" @click="go(value)">{{ value }}</button>
      <UiButton variant="secondary" :disabled="disabled || current >= pages" @click="go(current + 1)">{{ nextLabel || tr('nextPage') }}</UiButton>
    </div>
  </nav>
</template>
