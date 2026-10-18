<script setup lang="ts">
import { useUiConfig } from './config';
import { watch } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui';
defineProps<{ title: string; description: string }>();
const open = defineModel<boolean>('open');
let returnFocus: HTMLElement | null = null;
watch(
  open,
  (value) => {
    if (value)
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  },
  { flush: 'sync' },
);
function restoreFocus(event: Event) {
  if (returnFocus?.isConnected) {
    event.preventDefault();
    returnFocus.focus({ preventScroll: true });
  }
}
const { tr, portalTarget } = useUiConfig();
</script>
<template>
  <DialogRoot v-model:open="open"
    ><DialogPortal :to="portalTarget"
      ><DialogOverlay class="gp-dialog-overlay" /><DialogContent
        class="gp-dialog-content"
        @close-auto-focus="restoreFocus"
        ><DialogTitle class="gp-dialog-title">{{ title }}</DialogTitle
        ><DialogDescription class="gp-muted">{{ description }}</DialogDescription
        ><slot /><DialogClose class="gp-dialog-close" :aria-label="tr('close')"
          >×</DialogClose
        ></DialogContent
      ></DialogPortal
    ></DialogRoot
  >
</template>
