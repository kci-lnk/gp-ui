<script setup lang="ts">
import { useUiConfig } from './config';
import { watch } from 'vue';
import {
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from 'reka-ui';
import UiButton from './UiButton.vue';
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    confirmLabel?: string;
    danger?: boolean;
    loading?: boolean;
    error?: string;
  }>(),
  { confirmLabel: undefined },
);
const open = defineModel<boolean>('open');
const emit = defineEmits<{ confirm: [] }>();
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
  <AlertDialogRoot
    :open="open"
    @update:open="
      (value) => {
        if (!loading) open = value;
      }
    "
  >
    <AlertDialogPortal :to="portalTarget">
      <AlertDialogOverlay class="gp-dialog-overlay" />
      <AlertDialogContent
        class="gp-dialog-content gp-confirm"
        @close-auto-focus="restoreFocus"
        @escape-key-down="
          (event) => {
            if (props.loading) event.preventDefault();
          }
        "
      >
        <AlertDialogTitle class="gp-dialog-title"
          ><slot name="title">{{ title }}</slot></AlertDialogTitle
        >
        <AlertDialogDescription class="gp-muted"
          ><slot name="description">{{ description }}</slot></AlertDialogDescription
        >
        <p v-if="error || $slots.error" class="gp-error" role="alert">
          <slot name="error">{{ error }}</slot>
        </p>
        <div class="gp-confirm-actions">
          <AlertDialogCancel as-child
            ><UiButton variant="secondary" :disabled="loading">{{
              tr('cancel')
            }}</UiButton></AlertDialogCancel
          >
          <UiButton
            :variant="danger ? 'danger' : 'primary'"
            :loading="loading"
            @click="!loading && emit('confirm')"
            >{{ confirmLabel || tr('confirm') }}</UiButton
          >
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
