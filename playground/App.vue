<script setup lang="ts">
import { ref } from 'vue';
import { UiConfigProvider, UiButton } from '../src';
import Showcase from './Showcase.vue';
const mode = ref<'light' | 'dark'>('light'),
  locale = ref('en-US'),
  ocean = ref(true),
  mounted = ref(true);
</script>
<template>
  <main>
    <header class="intro">
      <p class="eyebrow">GP UI / VUE 3</p>
      <h1>One library.<br />Every project.</h1>
      <p>Independent components. CSS variable themes. Accessible interactions.</p>
      <div class="row">
        <UiButton @click="mode = mode === 'light' ? 'dark' : 'light'">Toggle mode</UiButton
        ><UiButton variant="secondary" @click="locale = locale === 'en-US' ? 'zh-CN' : 'en-US'"
          >Toggle language</UiButton
        ><UiButton variant="secondary" @click="ocean = !ocean">Toggle local theme</UiButton
        ><UiButton variant="secondary" @click="mounted = !mounted">Toggle previews</UiButton>
      </div>
    </header>
    <div v-if="mounted" class="previews">
      <UiConfigProvider :mode="mode" :locale="locale"
        ><section class="preview default-preview">
          <h2 class="preview-heading">Original / {{ mode }}</h2>
          <Showcase /></section
      ></UiConfigProvider>
      <UiConfigProvider
        :mode="mode"
        :locale="locale"
        :theme="ocean ? 'ocean' : 'violet'"
        time-zone="Asia/Shanghai"
        :week-starts-on="1"
        ><section class="preview themed-preview">
          <h2 class="preview-heading">{{ ocean ? 'Ocean' : 'Violet' }} / {{ mode }}</h2>
          <UiConfigProvider><Showcase /></UiConfigProvider></section
      ></UiConfigProvider>
    </div>
  </main>
</template>
<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #f5f5f7;
  color: #171a20;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
main {
  max-width: 1280px;
  margin: auto;
  padding: 48px 24px;
}
.intro {
  margin-bottom: 40px;
}
.eyebrow {
  color: #c32232;
  letter-spacing: 0.15em;
  font-size: 12px;
}
h1 {
  font-size: clamp(40px, 7vw, 76px);
  letter-spacing: -0.05em;
  line-height: 1.05;
  margin: 16px 0;
}
h2 {
  margin: 0 0 12px;
  font-size: 19px;
}
.intro > p:not(.eyebrow) {
  color: #666b73;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
}
.previews {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.preview {
  min-width: 0;
  background: var(--gp-bg);
  color: var(--gp-text);
  padding: 20px;
  border-radius: 24px;
}
.preview-heading {
  text-transform: capitalize;
}
.readout {
  font-size: 12px;
  overflow-wrap: anywhere;
  color: var(--gp-muted);
}
.skeletons {
  display: grid;
  gap: 12px;
}
.confirmed {
  font-size: 12px;
  color: var(--gp-muted);
}
[data-gp-theme='ocean'] {
  --gp-primary: #087f8c;
  --gp-accent: #087f8c;
  --gp-accent-soft: #e6f5f6;
}
[data-gp-theme='ocean'][data-gp-mode='dark'] {
  --gp-accent: #7bd7de;
  --gp-accent-soft: #18383b;
}
[data-gp-theme='violet'] {
  --gp-primary: #6d28d9;
  --gp-accent: #6d28d9;
  --gp-accent-soft: #f0eaff;
}
[data-gp-theme='violet'][data-gp-mode='dark'] {
  --gp-accent: #c4a7ff;
  --gp-accent-soft: #332342;
}
@media (max-width: 760px) {
  main {
    padding: 24px 12px;
  }
  .previews {
    grid-template-columns: 1fr;
  }
  .preview {
    padding: 12px;
  }
}
</style>
