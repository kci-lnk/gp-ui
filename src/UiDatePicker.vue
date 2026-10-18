<script setup lang="ts">
import { useUiConfig } from './config';
import { useId, watch } from 'vue';
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarPrev,
  CalendarNext,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
} from 'reka-ui';
import { useDatePicker } from './composables/useDatePicker';
const props = defineProps<{ label: string; min?: string; max?: string; disabled?: boolean }>();
const model = defineModel<string>({ required: true });
const id = useId();
const {
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
} = useDatePicker(model, props);
const { tr, locale: activeLocale, weekStartsOn, portalTarget } = useUiConfig();
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) open.value = false;
  },
);
</script>
<template>
  <div class="gp-field gp-date-field">
    <label :id="id + '-label'" :for="id">{{ label }}</label>
    <PopoverRoot v-model:open="open" :modal="true">
      <PopoverTrigger
        :id="id"
        class="gp-date-trigger"
        :disabled="disabled"
        :aria-labelledby="id + '-label ' + id + '-value'"
      >
        <span class="gp-visually-hidden">{{ tr('calendarLabel', { p0: label }) }}</span>
        <span :id="id + '-value'">{{ display }}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M7 3v4m10-4v4M3 11h18" />
        </svg>
      </PopoverTrigger>
      <PopoverPortal :to="portalTarget"
        ><PopoverContent
          class="gp-date-popover"
          align="start"
          :side-offset="8"
          :collision-padding="12"
        >
          <CalendarRoot
            v-slot="{ grid, weekDays }"
            v-model:placeholder="placeholder"
            :model-value="selected"
            :disabled="disabled"
            :min-value="minimum"
            :max-value="maximum"
            :locale="activeLocale"
            :week-starts-on="weekStartsOn"
            weekday-format="short"
            fixed-weeks
            prevent-deselect
            initial-focus
            @update:model-value="select"
          >
            <CalendarHeader class="gp-calendar-header">
              <button
                type="button"
                class="gp-calendar-nav"
                :aria-label="tr('previousYear')"
                :disabled="!canChangeYear(-1)"
                @click="changeYear(-1)"
              >
                «
              </button>
              <CalendarPrev class="gp-calendar-nav" :aria-label="tr('previousMonth')"
                >‹</CalendarPrev
              >
              <CalendarHeading class="gp-calendar-heading" />
              <CalendarNext class="gp-calendar-nav" :aria-label="tr('nextMonth')">›</CalendarNext>
              <button
                type="button"
                class="gp-calendar-nav"
                :aria-label="tr('nextYear')"
                :disabled="!canChangeYear(1)"
                @click="changeYear(1)"
              >
                »
              </button>
            </CalendarHeader>
            <CalendarGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="gp-calendar-grid"
            >
              <CalendarGridHead
                ><CalendarGridRow
                  ><CalendarHeadCell v-for="day in weekDays" :key="day">{{
                    day
                  }}</CalendarHeadCell></CalendarGridRow
                ></CalendarGridHead
              >
              <CalendarGridBody
                ><CalendarGridRow v-for="(week, index) in month.rows" :key="index"
                  ><CalendarCell v-for="day in week" :key="day.toString()" :date="day"
                    ><CalendarCellTrigger
                      :day="day"
                      :month="month.value"
                      class="gp-calendar-day"
                      :class="{ 'gp-is-today': day.toString() === currentDay().toString() }"
                      @click="select(day)" /></CalendarCell></CalendarGridRow
              ></CalendarGridBody>
            </CalendarGrid>
          </CalendarRoot>
          <div class="gp-calendar-footer">
            <button type="button" :disabled="!allowed(currentDay())" @click="select(currentDay())">
              {{ tr('today') }}</button
            ><PopoverClose>{{ tr('close') }}</PopoverClose>
          </div>
        </PopoverContent></PopoverPortal
      >
    </PopoverRoot>
  </div>
</template>
