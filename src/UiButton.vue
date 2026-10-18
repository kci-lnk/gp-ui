<script setup lang="ts">
import UiSpinner from './UiSpinner.vue';
import { Primitive } from 'reka-ui';
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger';
    asChild?: boolean;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { variant: 'primary', type: 'button' },
);
function guardDisabled(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
</script>
<template>
  <Primitive
    as="button"
    :as-child="asChild"
    :type="type"
    class="gp-button"
    :class="[variant, { 'gp-button--child-loading': asChild && loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :aria-disabled="disabled || loading || undefined"
    @click.capture="guardDisabled"
  >
    <UiSpinner v-if="loading && !asChild" decorative /><slot />
  </Primitive>
</template>
