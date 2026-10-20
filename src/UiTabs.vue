<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsIndicator } from 'reka-ui';
withDefaults(defineProps<{ items: { value: string; label: string }[]; label: string; variant?: 'segmented' | 'line' }>(), { variant: 'segmented' });
const model = defineModel<string>({ required: true });
</script>
<template>
  <TabsRoot v-model="model" class="gp-tabs-root" :data-variant="variant"
    ><TabsList class="gp-tabs" :aria-label="label" :class="{ 'gp-tabs--line': variant === 'line' }"
      ><TabsIndicator class="gp-tab-indicator" aria-hidden="true" />
      <TabsTrigger v-for="item in items" :key="item.value" :value="item.value" class="gp-tab">{{
        item.label
      }}</TabsTrigger></TabsList
    ></TabsRoot
  >
</template>
