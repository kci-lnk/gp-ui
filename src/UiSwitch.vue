<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';
defineProps<{ label: string; hint?: string; disabled?: boolean }>();
const model = defineModel<boolean>();
</script>
<template>
  <label class="gp-switch-label"
    ><span
      ><b>{{ label }}</b
      ><small v-if="hint">{{ hint }}</small></span
    ><SwitchRoot v-model="model" :disabled="disabled" class="gp-switch" :aria-label="label"
      ><SwitchThumb class="gp-switch-thumb" /></SwitchRoot
  ></label>
</template>
