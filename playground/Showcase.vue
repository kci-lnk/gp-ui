<script setup lang="ts">
import { ref } from 'vue';
import {
  UiButton,
  UiInput,
  UiTextarea,
  UiSwitch,
  UiDialog,
  UiConfirmDialog,
  UiTabs,
  UiPagination,
  UiSelect,
  UiNumberField,
  UiDatePicker,
  UiTimePicker,
  UiWeekdays,
  UiDisclosure,
  UiIconButton,
  UiTooltip,
  UiPopover,
  UiCard,
  UiBadge,
  UiEmptyState,
  UiSpinner,
  UiSkeleton,
  UiGlassNav,
} from '../src';
const name = ref('Ada'),
  notes = ref('Reusable components, your theme.'),
  enabled = ref(true),
  tab = ref('design'),
  choice = ref('one'),
  amount = ref(10),
  date = ref('2026-10-18'),
  time = ref('09:30'),
  days = ref([1, 3, 5]),
  dialog = ref(false),
  confirm = ref(false),
  busy = ref(false),
  nav = ref('home'),
  confirmed = ref(0);
const pageNumber = ref(1);
const disabled = ref(false);
const linkValue = ref('first');
const linkItems = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];
const items = [
  { value: 'home', label: 'Home' },
  { value: 'explore', label: 'Explore' },
  { value: 'settings', label: 'Settings' },
];
function save() {
  busy.value = true;
  setTimeout(() => {
    confirmed.value++;
    busy.value = false;
    confirm.value = false;
  }, 300);
}
</script>
<template>
  <UiPagination v-model="pageNumber" :total="95" :page-size="10" />
  <UiTabs v-model="tab" variant="line" label="Line navigation" :items="[{value:'design',label:'Design'},{value:'code',label:'Code'}]" />
  <div class="showcase">
    <UiCard
      ><template #header><h2>Actions & feedback</h2></template>
      <div class="row">
        <UiButton>Primary</UiButton><UiButton variant="secondary">Secondary</UiButton
        ><UiButton variant="danger">Danger</UiButton><UiButton disabled>Disabled</UiButton
        ><UiButton loading>Saving</UiButton
        ><UiButton as-child loading><a href="#blocked">Saving link</a></UiButton
        ><UiIconButton label="Favorite">☆</UiIconButton
        ><UiTooltip text="Helpful context"
          ><UiButton variant="secondary">Tooltip</UiButton></UiTooltip
        >
      </div>
      <div class="row">
        <UiBadge
          v-for="variant in ['neutral', 'primary', 'success', 'warning', 'danger'] as const"
          :key="variant"
          :variant="variant"
          dot
          >{{ variant }}</UiBadge
        ><UiSpinner label="Loading preview" />
      </div>
    </UiCard>
    <UiCard
      ><template #header><h2>Forms</h2></template>
      <UiSwitch v-model="disabled" label="Disable fields" /><UiInput
        v-model="name"
        label="Name"
        hint="A visible label and helpful hint"
      />
      <UiInput label="Invalid value" error="Please check this field" />
      <UiTextarea v-model="notes" label="Notes" rows="3" />
      <UiNumberField :disabled="disabled" v-model="amount" label="Amount" :min="0" :max="100" />
      <UiSelect
        v-model="choice"
        label="Choice"
        :options="[
          { value: 'one', label: 'First' },
          { value: 'two', label: 'Second' },
          { value: 'three', label: 'Unavailable', disabled: true },
        ]"
      />
      <UiSwitch v-model="enabled" label="Notifications" hint="Updates are optional" />
      <UiDatePicker
        :disabled="disabled"
        v-model="date"
        label="Date"
        min="2026-01-01"
        max="2026-12-31"
      />
      <UiTimePicker :disabled="disabled" v-model="time" label="Time" /><UiWeekdays
        :disabled="disabled"
        v-model="days"
      />
      <p class="readout">{{ name }} · {{ amount }} · {{ choice }} · {{ date }} · {{ time }}</p>
    </UiCard>
    <UiCard
      ><template #header><h2>Navigation & overlays</h2></template>
      <UiTabs
        v-model="tab"
        :items="[
          { value: 'design', label: 'Design' },
          { value: 'build', label: 'Build' },
        ]"
        label="Preview tabs"
      />
      <UiGlassNav v-model="nav" :items="items" label="Glass navigation"
        ><template #icon="{ item }"
          ><svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              :d="
                item.value === 'home'
                  ? 'M3 10l9-7 9 7v10H3z M9 20v-7h6v7'
                  : item.value === 'explore'
                    ? 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M15 9l-2 4-4 2 2-4z'
                    : 'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M8 15v6'
              "
            /></svg></template
      ></UiGlassNav>
      <p class="demo-note">Custom link slot · four items</p>
      <UiGlassNav v-model="linkValue" :items="linkItems" label="Custom links"
        ><template #item="{ item }"
          ><a :href="'#' + item.value">{{ item.label }}</a></template
        ></UiGlassNav
      >
      <UiDisclosure
        ><template #title>Details</template>Keyboard accessible disclosure.</UiDisclosure
      >
      <div class="row">
        <UiButton @click="dialog = true">Open dialog</UiButton
        ><UiButton variant="danger" @click="confirm = true">Confirm action</UiButton
        ><UiPopover title="Popover"
          ><template #trigger><UiButton variant="secondary">Open popover</UiButton></template
          >Floating content keeps its theme.</UiPopover
        >
      </div>
      <UiDialog
        v-model:open="dialog"
        title="Example dialog"
        description="Focus returns to the trigger when closed."
        ><UiInput v-model="name" label="Dialog name" /><UiSelect
          v-model="choice"
          label="Nested choice"
          :options="[
            { value: 'one', label: 'First' },
            { value: 'two', label: 'Second' },
          ]"
      /></UiDialog>
      <UiConfirmDialog
        v-model:open="confirm"
        title="Confirm action"
        description="This is a local preview."
        :loading="busy"
        danger
        @confirm="save"
      />
      <output class="confirmed">Confirmed {{ confirmed }}</output>
    </UiCard>
    <UiCard
      ><template #header><h2>Empty & loading</h2></template
      ><UiEmptyState title="Nothing here yet" description="Create your first item to get started."
        ><template #actions><UiButton>Create item</UiButton></template></UiEmptyState
      >
      <div class="skeletons">
        <UiSkeleton height="60px" /><UiSkeleton width="70%" /><UiSkeleton
          width="45%"
          :animated="false"
        /></div
    ></UiCard>
  </div>
</template>
<style scoped>
.showcase {
  display: grid;
  gap: 20px;
  min-width: 0;
}
</style>
