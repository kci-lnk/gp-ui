<script setup lang="ts">
import { useId } from 'vue';
import { Label, Primitive } from 'reka-ui';
defineOptions({ inheritAttrs: false });
defineProps<{ label: string }>();
const model = defineModel<string>();
const id = useId();
</script>
<template>
  <div class="gp-field gp-select-field">
    <Label :for="id">{{ label }}</Label
    ><Primitive
      as="textarea"
      :id="id"
      :value="model"
      v-bind="$attrs"
      @input="model = ($event.target as HTMLTextAreaElement).value"
    />
  </div>
</template>
