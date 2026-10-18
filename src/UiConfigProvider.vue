<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, provide, shallowRef, watchEffect } from 'vue';
import { ConfigProvider } from 'reka-ui';
import { uiConfigKey, useUiConfig, type UiConfig } from './config';
const props = defineProps<Partial<UiConfig>>();
const parent = useUiConfig();
const config = computed<UiConfig>(() => ({
  ...parent.config.value,
  ...Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)),
  messages: { ...parent.config.value.messages, ...props.messages },
}));
const host = shallowRef<HTMLElement>();
const portalTarget = computed(() => host.value ?? parent.portalTarget.value);
provide(uiConfigKey, { config, portalTarget });
onMounted(() => {
  const element = document.createElement('div');
  element.className = 'gp-portal-host';
  document.body.appendChild(element);
  host.value = element;
});
watchEffect(() => {
  if (!host.value) return;
  for (const [key, value] of Object.entries({
    'data-gp-theme': config.value.theme,
    'data-gp-mode': config.value.mode,
    dir: config.value.dir,
    lang: config.value.locale,
  })) {
    if (value === undefined) host.value.removeAttribute(key);
    else host.value.setAttribute(key, value);
  }
});
onBeforeUnmount(() => host.value?.remove());
</script>
<template>
  <ConfigProvider :locale="config.locale" :dir="config.dir">
    <div
      class="gp-config"
      :data-gp-theme="config.theme"
      :data-gp-mode="config.mode"
      :dir="config.dir"
      :lang="config.locale"
    >
      <slot />
    </div>
  </ConfigProvider>
</template>
