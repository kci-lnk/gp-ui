import { useUiConfig } from '../config';
import { computed, ref, shallowRef, watch, type Ref } from 'vue';
import { parseDate, today, type DateValue } from '@internationalized/date';
export function useDatePicker(
  model: Ref<string>,
  props: { min?: string; max?: string; disabled?: boolean },
) {
  const { tr, formatDate, timeZone } = useUiConfig();
  const read = (value?: string) => {
    try {
      return value ? parseDate(value) : undefined;
    } catch {
      return undefined;
    }
  };
  const open = ref(false);
  const selected = computed(() => read(model.value));
  const minimum = computed(() => read(props.min));
  const maximum = computed(() => read(props.max));
  const currentDay = () => today(timeZone.value);
  const placeholder = shallowRef<DateValue>(selected.value || currentDay());
  const display = computed(() =>
    selected.value
      ? formatDate(selected.value.toDate(timeZone.value), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : tr('selectADate'),
  );
  const allowed = (date: DateValue) =>
    (!minimum.value || date.compare(minimum.value) >= 0) &&
    (!maximum.value || date.compare(maximum.value) <= 0);
  function select(date?: DateValue) {
    if (!props.disabled && date && allowed(date)) {
      model.value = date.toString();
      open.value = false;
    }
  }
  function canChangeYear(delta: number) {
    const target = placeholder.value.add({ years: delta });
    return (
      (!minimum.value ||
        target.set({ day: target.calendar.getDaysInMonth(target) }).compare(minimum.value) >= 0) &&
      (!maximum.value || target.set({ day: 1 }).compare(maximum.value) <= 0)
    );
  }
  function changeYear(delta: number) {
    if (canChangeYear(delta)) placeholder.value = placeholder.value.add({ years: delta });
  }
  watch(open, (value) => {
    if (value) {
      let next: DateValue = selected.value || currentDay();
      if (minimum.value && next.compare(minimum.value) < 0) next = minimum.value;
      if (maximum.value && next.compare(maximum.value) > 0) next = maximum.value;
      placeholder.value = next;
    }
  });
  return {
    open,
    selected,
    minimum,
    maximum,
    placeholder,
    display,
    select,
    currentDay,
    allowed,
    canChangeYear,
    changeYear,
  };
}
