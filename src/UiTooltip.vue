<script setup lang="ts">
import { useUiConfig } from './config';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
} from 'reka-ui';
defineProps<{ text: string }>();
const { portalTarget } = useUiConfig();
</script>
<template>
  <TooltipProvider :delay-duration="350">
    <TooltipRoot>
      <TooltipTrigger as-child><slot /></TooltipTrigger>
      <TooltipPortal :to="portalTarget">
        <TooltipContent class="gp-tooltip" :side-offset="8" :collision-padding="12">
          {{ text }}<TooltipArrow class="gp-tooltip-arrow" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
