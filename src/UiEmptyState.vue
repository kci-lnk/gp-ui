<script setup lang="ts">
defineProps<{ title?: string; description?: string }>();
</script>
<template>
  <div class="gp-empty-state">
    <div v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></div>
    <h3 v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p v-if="description || $slots.description">
      <slot name="description">{{ description }}</slot>
    </p>
    <slot />
    <div v-if="$slots.actions"><slot name="actions" /></div>
  </div>
</template>
