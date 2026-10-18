<script setup lang="ts">
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui';
import UiChevron from './UiChevron.vue';
</script>
<template>
  <CollapsibleRoot class="gp-record-detail"
    ><CollapsibleTrigger class="gp-record-trigger"
      ><span class="gp-record-trigger-label"><slot name="title" /></span
      ><span class="gp-icon-slot"><UiChevron /></span></CollapsibleTrigger
    ><CollapsibleContent class="gp-disclosure-content"
      ><div class="gp-disclosure-body"><slot /></div></CollapsibleContent
  ></CollapsibleRoot>
</template>
