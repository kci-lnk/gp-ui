<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
    dot?: boolean;
  }>(),
  { variant: 'neutral' },
);
</script>
<template>
  <span class="gp-badge" :data-variant="variant"
    ><span v-if="dot" class="gp-live-dot" aria-hidden="true" /><slot
  /></span>
</template>
