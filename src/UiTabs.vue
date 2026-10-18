<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsIndicator } from 'reka-ui';
defineProps<{ items: { value: string; label: string }[]; label: string }>();
const model = defineModel<string>({ required: true });
</script>
<template>
  <TabsRoot v-model="model"
    ><TabsList class="gp-tabs" :aria-label="label"
      ><TabsIndicator class="gp-tab-indicator" aria-hidden="true" />
      <TabsTrigger v-for="item in items" :key="item.value" :value="item.value" class="gp-tab">{{
        item.label
      }}</TabsTrigger></TabsList
    ></TabsRoot
  >
</template>
