<script setup lang="ts">
import { useUiConfig } from './config';
import { computed, useId, nextTick, ref, watch } from 'vue';
import { Time } from '@internationalized/date';
import {
  Label,
  TimeFieldRoot,
  TimeFieldInput,
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
  ListboxRoot,
  ListboxContent,
  ListboxItem,
} from 'reka-ui';
const props = defineProps<{ label: string; disabled?: boolean }>();
const model = defineModel<string>({ required: true });
const id = useId();
const open = ref(false);
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) open.value = false;
  },
);
const value = computed({
  get: () =>
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(model.value)
      ? new Time(...(model.value.split(':').map(Number) as [number, number]))
      : undefined,
  set: (v: Time | undefined) => {
    if (props.disabled) return;
    model.value = v
      ? `${String(v.hour).padStart(2, '0')}:${String(v.minute).padStart(2, '0')}`
      : '';
  },
});
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
async function focusSelected(event: Event) {
  event.preventDefault();
  const content = event.target as HTMLElement;
  await nextTick();
  const selected = content.querySelectorAll<HTMLElement>('[role="option"][aria-selected="true"]');
  selected.forEach((el) => el.scrollIntoView({ block: 'nearest' }));
  selected[0]?.focus({ preventScroll: true });
}
function setPart(part: number, v: unknown) {
  if (props.disabled || typeof v !== 'string') return;
  const parts = (model.value || '00:00').split(':');
  parts[part] = v;
  model.value = parts.join(':');
}
const { tr, locale: activeLocale, portalTarget } = useUiConfig();
</script>
<template>
  <div class="gp-field">
    <Label :id="id + '-label'" :for="id">{{ label }}</Label>
    <div class="gp-time-control">
      <TimeFieldRoot
        :id="id"
        v-model="value"
        v-slot="{ segments }"
        class="gp-time-segments"
        :aria-labelledby="id + '-label'"
        :locale="activeLocale"
        :hour-cycle="24"
        :disabled="disabled"
        granularity="minute"
      >
        <TimeFieldInput
          v-for="(segment, i) in segments"
          :key="i"
          :part="segment.part"
          :aria-label="
            segment.part === 'hour'
              ? tr('hourLabel', { label })
              : segment.part === 'minute'
                ? tr('minuteLabel', { label })
                : undefined
          "
          >{{
            segment.part !== 'literal' && /^\d+$/.test(segment.value)
              ? segment.value.padStart(2, '0')
              : segment.value
          }}</TimeFieldInput
        >
      </TimeFieldRoot>
      <PopoverRoot v-model:open="open"
        ><PopoverTrigger
          class="gp-time-trigger"
          :disabled="disabled"
          :aria-label="tr('chooseTime', { label: props.label })"
          ><svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v6l4 2" /></svg
        ></PopoverTrigger>
        <PopoverPortal :to="portalTarget"
          ><PopoverContent
            class="gp-time-popover"
            @open-auto-focus="focusSelected"
            :side-offset="8"
            :collision-padding="12"
            align="end"
            :aria-label="label"
          >
            <div class="gp-time-columns">
              <div v-for="(items, part) in [hours, minutes]" :key="part">
                <span class="gp-field-label">{{ part === 0 ? tr('hours') : tr('minutes') }}</span>
                <ListboxRoot
                  :model-value="(model || '00:00').split(':')[part]"
                  @update:model-value="setPart(part, $event)"
                  :aria-label="tr(part === 0 ? 'hourLabel' : 'minuteLabel', { label })"
                  ><ListboxContent
                    :aria-label="tr(part === 0 ? 'hourLabel' : 'minuteLabel', { label })"
                    class="gp-time-options"
                    ><ListboxItem v-for="v in items" :key="v" :value="v" class="gp-time-option">{{
                      v
                    }}</ListboxItem></ListboxContent
                  ></ListboxRoot
                >
              </div>
            </div>
            <PopoverClose class="gp-button secondary">{{ tr('done') }}</PopoverClose>
          </PopoverContent></PopoverPortal
        >
      </PopoverRoot>
    </div>
  </div>
</template>
