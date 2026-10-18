<script setup lang="ts">
import { useId } from 'vue';
import { Label, Primitive } from 'reka-ui';
defineOptions({ inheritAttrs: false });
defineProps<{ label: string; hint?: string; error?: string }>();
const model = defineModel<string | number>();
const id = useId();
</script>
<template>
  <div class="gp-field">
    <Label :for="id">{{ label }}</Label>
    <div class="gp-input-control" :class="{ 'has-trailing': $slots.trailing }">
      <Primitive
        as="input"
        :id="id"
        :value="model"
        @input="model = ($event.target as HTMLInputElement).value"
        v-bind="$attrs"
        :aria-invalid="!!error"
        :aria-describedby="error ? id + '-error' : hint ? id + '-hint' : undefined"
      />
      <div v-if="$slots.trailing" class="gp-input-trailing"><slot name="trailing" /></div>
    </div>
    <small v-if="hint" :id="id + '-hint'">{{ hint }}</small
    ><small v-if="error" :id="id + '-error'" class="gp-error" role="alert">{{ error }}</small>
  </div>
</template>
<style scoped>
.gp-input-control {
  position: relative;
  min-width: 0;
}
.has-trailing > input {
  padding-inline-end: 48px;
}
.gp-input-trailing {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}
</style>
