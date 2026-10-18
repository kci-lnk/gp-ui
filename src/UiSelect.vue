<script setup lang="ts" generic="T extends string | number">
import { useUiConfig } from './config';
import { useId } from 'vue';
import UiChevron from './UiChevron.vue';
import {
  Label,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'reka-ui';
defineProps<{
  label: string;
  options: { value: T; label: string; disabled?: boolean }[];
  disabled?: boolean;
}>();
const model = defineModel<T>({ required: true });
const id = useId();
const { portalTarget } = useUiConfig();
</script>
<template>
  <div class="gp-field">
    <Label :for="id">{{ label }}</Label>
    <SelectRoot v-model="model" :disabled="disabled">
      <SelectTrigger :id="id" class="gp-select-trigger"
        ><SelectValue /><SelectIcon class="gp-icon-slot" aria-hidden="true"
          ><UiChevron /></SelectIcon
      ></SelectTrigger>
      <SelectPortal :to="portalTarget"
        ><SelectContent
          class="gp-select-content"
          position="popper"
          :side-offset="6"
          :collision-padding="12"
          ><SelectViewport>
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              class="gp-select-option"
              ><SelectItemText>{{ option.label }}</SelectItemText
              ><SelectItemIndicator class="gp-icon-slot" aria-hidden="true"
                ><svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  focusable="false"
                >
                  <path d="m5 12 4 4L19 6" /></svg></SelectItemIndicator
            ></SelectItem> </SelectViewport></SelectContent
      ></SelectPortal>
    </SelectRoot>
  </div>
</template>
