<script setup lang="ts">
import { useUiConfig } from './config';
withDefaults(defineProps<{ size?: number; label?: string; decorative?: boolean }>(), { size: 17 });
const { tr } = useUiConfig();
</script>
<template>
  <span
    class="gp-spinner"
    :style="{ width: size + 'px', height: size + 'px' }"
    :role="decorative ? undefined : 'status'"
    :aria-label="decorative ? undefined : label || tr('loading')"
    :aria-hidden="decorative || undefined"
  />
</template>
