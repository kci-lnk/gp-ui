<script setup lang="ts">
import { useUiConfig } from './config';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
} from 'reka-ui';
import { useId, ref } from 'vue';
defineProps<{ title: string }>();
const open = defineModel<boolean>('open', { default: false });
const id = useId();
const side = ref<'top' | 'bottom'>('bottom');
function chooseSide(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  side.value = rect.top > window.innerHeight - rect.bottom ? 'top' : 'bottom';
}
const { tr, portalTarget } = useUiConfig();
</script>
<template>
  <PopoverRoot v-model:open="open" :modal="false">
    <PopoverTrigger as-child @click="chooseSide"><slot name="trigger" /></PopoverTrigger>
    <PopoverPortal :to="portalTarget">
      <PopoverContent
        class="gp-popover"
        :side="side"
        align="center"
        :side-offset="12"
        :prioritize-position="false"
        sticky="always"
        :collision-padding="12"
        :aria-labelledby="id"
        :aria-label="title"
      >
        <div class="gp-popover-heading">
          <h3 :id="id">{{ title }}</h3>
          <PopoverClose class="gp-popover-close" :aria-label="tr('closeDetails')">×</PopoverClose>
        </div>
        <slot />
        <PopoverArrow class="gp-popover-arrow" :width="14" :height="7" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
