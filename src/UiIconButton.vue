<script setup lang="ts">
import { Primitive } from 'reka-ui';
import UiTooltip from './UiTooltip.vue';
defineOptions({ inheritAttrs: false });
defineProps<{ label: string }>();
</script>
<template>
  <UiTooltip :text="label">
    <Primitive v-bind="$attrs" as="button" type="button" class="gp-icon-action" :aria-label="label"
      ><slot
    /></Primitive>
  </UiTooltip>
</template>
