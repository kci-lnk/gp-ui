<script setup lang="ts">
withDefaults(
  defineProps<{ width?: string; height?: string; radius?: string; animated?: boolean }>(),
  { width: '100%', height: '1em', radius: 'var(--gp-radius)', animated: true },
);
</script>
<template>
  <span
    class="gp-skeleton"
    aria-hidden="true"
    :data-animated="animated"
    :style="{ width, height, borderRadius: radius }"
  />
</template>
