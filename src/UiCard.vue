<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui';
withDefaults(defineProps<{ as?: PrimitiveProps['as']; asChild?: boolean }>(), { as: 'section' });
</script>
<template>
  <Primitive :as="as" :as-child="asChild" class="gp-card"
    ><header v-if="$slots.header" class="gp-card-header"><slot name="header" /></header>
    <slot />
    <footer v-if="$slots.footer" class="gp-card-footer"><slot name="footer" /></footer
  ></Primitive>
</template>
