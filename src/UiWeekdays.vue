<script setup lang="ts">
import { useUiConfig } from './config';
import { useId, computed } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';
defineProps<{ disabled?: boolean }>();
const model = defineModel<number[]>({ required: true });
const id = useId();
const days = computed(() => {
  const order = Array.from({ length: 7 }, (_, i) => ((i + weekStartsOn.value + 6) % 7) + 1);
  return order.map((value) => {
    const date = new Date(Date.UTC(2024, 0, value));
    const label = new Intl.DateTimeFormat(activeLocale.value, {
      weekday: 'short',
      timeZone: 'UTC',
    }).format(date);
    const full = new Intl.DateTimeFormat(activeLocale.value, {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(date);
    return { value, label, full };
  });
});
const { tr, locale: activeLocale, weekStartsOn } = useUiConfig();
</script>
<template>
  <div class="gp-weekday-field">
    <div :id="id" class="gp-field-label">{{ tr('repeatOn') }}</div>
    <ToggleGroupRoot
      v-model="model"
      :disabled="disabled"
      type="multiple"
      :aria-labelledby="id"
      :roving-focus="false"
      ><ToggleGroupItem
        v-for="day in days"
        :key="day.value"
        :value="day.value"
        :aria-label="day.full"
        >{{ day.label }}</ToggleGroupItem
      ></ToggleGroupRoot
    >
  </div>
</template>
