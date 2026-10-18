<script setup lang="ts">
import { useUiConfig } from './config';
import { useId } from 'vue';
import { Label, NumberFieldRoot, NumberFieldInput } from 'reka-ui';
defineProps<{
  label: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  digits?: number;
}>();
const model = defineModel<number>({ required: true });
const id = useId();
const { locale: activeLocale } = useUiConfig();
</script>
<template>
  <div class="gp-field">
    <Label :for="id">{{ label }}</Label>
    <NumberFieldRoot
      v-model="model"
      :min="min"
      :max="max"
      :step="step ?? 1"
      :required="required"
      :disabled="disabled"
      :disable-wheel-change="true"
      :locale="activeLocale"
      :format-options="{ useGrouping: false, maximumFractionDigits: digits ?? 2 }"
      ><NumberFieldInput :id="id" :aria-label="label"
    /></NumberFieldRoot>
  </div>
</template>
