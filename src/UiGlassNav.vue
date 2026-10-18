<script setup lang="ts" generic="T extends string">
import { computed } from 'vue';
import { Primitive } from 'reka-ui';
export interface GlassNavItem<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  href?: string;
}
const props = withDefaults(
  defineProps<{
    items: GlassNavItem<T>[];
    label: string;
    responsive?: boolean;
    floating?: boolean;
  }>(),
  { responsive: false, floating: false },
);
const model = defineModel<T | ''>({ required: true });
const activeIndex = computed(() => props.items.findIndex((item) => item.value === model.value));
const emit = defineEmits<{ select: [value: T] }>();
function select(item: GlassNavItem<T>, event: MouseEvent) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }
  model.value = item.value;
  emit('select', item.value);
}
</script>
<template>
  <nav
    class="gp-glass-nav"
    :class="{ 'gp-glass-nav--responsive': responsive, 'gp-glass-nav--floating': floating }"
    :aria-label="label"
    :style="{ '--gp-nav-count': Math.max(1, items.length), '--gp-nav-index': activeIndex }"
  >
    <span v-show="activeIndex >= 0" class="gp-nav-selection" aria-hidden="true" />
    <Primitive
      v-for="item in items"
      :key="item.value"
      :as="item.href ? 'a' : 'button'"
      :as-child="!!$slots.item"
      class="gp-nav-item"
      :class="{ active: item.value === model }"
      v-bind="$slots.item ? {} : item.href ? { href: item.href } : { type: 'button' }"
      :disabled="item.disabled || undefined"
      :aria-disabled="item.disabled || undefined"
      :tabindex="item.disabled ? -1 : undefined"
      :aria-current="item.value === model ? 'page' : undefined"
      @click="select(item, $event)"
    >
      <slot name="item" :item="item" :active="item.value === model"
        ><slot name="icon" :item="item" :active="item.value === model" /><span>{{
          item.label
        }}</span></slot
      >
    </Primitive>
  </nav>
</template>
