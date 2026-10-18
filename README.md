<div align="center">

# GP UI

**为 Vue 3 构建的组件库，让主题与交互自然融入你的应用。**

CSS 变量主题 · 明暗模式 · 国际化 · iOS 风格玻璃导航

[![npm](https://img.shields.io/npm/v/%40kci-lnk%2Fgp-ui?color=c32232&label=npm)](https://www.npmjs.com/package/@kci-lnk/gp-ui)
[![CI](https://github.com/kci-lnk/gp-ui/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kci-lnk/gp-ui/actions/workflows/ci.yml)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![License](https://img.shields.io/github/license/kci-lnk/gp-ui?color=64748b)](LICENSE)

[开始使用](#快速开始) · [组件 API](docs/components.md) · [主题与国际化](docs/theming.md) · [更新记录](CHANGELOG.md)

</div>

---

GP UI 提供 22 个组件和一个配置 Provider，覆盖表单、浮层、反馈与导航。默认采用中性色与红色强调色，通过 CSS 变量即可定制品牌外观。

- **主题可组合** — 全局品牌色、局部主题与明暗模式，弹窗和下拉浮层同步主题。
- **交互有基础** — 基于 Reka UI，支持键盘操作、焦点管理、禁用与加载状态。
- **适配移动端** — 玻璃导航、触摸操作、安全区，以及减少动态效果偏好。
- **配置可继承** — 集中管理语言、文案、时区、周起始日与 RTL 方向。
- **直接接入 Vue** — TypeScript 类型、命名导入与预编译 CSS；无需配置 Sass。

## 安装

在 Vue 3.5 项目中安装：

```sh
npm install @kci-lnk/gp-ui
```

在应用入口导入一次样式，再加载自己的主题覆盖：

```ts
import '@kci-lnk/gp-ui/style.css';
import './theme.css';
```

## 快速开始

组件使用 Vue 原生的 `v-model`、事件和插槽。`UiConfigProvider` 可统一设置整个应用，也可以只包裹某个区域。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiConfigProvider, UiInput } from '@kci-lnk/gp-ui';

const name = ref('');
const greeting = ref('');
</script>

<template>
  <UiConfigProvider locale="zh-CN" time-zone="Asia/Shanghai" :week-starts-on="1">
    <form class="welcome-form" @submit.prevent="greeting = `你好，${name}！`">
      <UiInput v-model="name" label="姓名" placeholder="如何称呼你？" required />
      <UiButton type="submit" :disabled="!name.trim()">打个招呼</UiButton>
      <p v-if="greeting" role="status">{{ greeting }}</p>
    </form>
  </UiConfigProvider>
</template>

<style scoped>
.welcome-form {
  display: grid;
  gap: 16px;
  max-width: 360px;
}
</style>
```

## 用 CSS 定义主题

品牌色、背景、文字、边框、圆角、阴影和动效均有对应变量。危险操作使用独立的语义色。

```css
/* theme.css */
:root {
  --gp-primary: #2563eb;
  --gp-primary-foreground: #fff;
  --gp-accent: #2563eb;
  --gp-accent-soft: #eff6ff;
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
```

```vue
<UiConfigProvider theme="ocean" mode="dark">
  <YourContent />
</UiConfigProvider>
```

局部主题选择器应写在全局样式中。Provider 会让内容区域及挂载到 `body` 的浮层共享主题、明暗模式和文字方向；嵌套 Provider 继承未指定的配置。完整变量与配置项见 [主题指南](docs/theming.md)。

## 组件一览

| 分类       | 组件                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------- |
| 表单       | `UiInput` · `UiTextarea` · `UiSelect` · `UiNumberField` · `UiSwitch`                     |
| 日期与时间 | `UiDatePicker` · `UiTimePicker` · `UiWeekdays`                                           |
| 操作与浮层 | `UiButton` · `UiIconButton` · `UiDialog` · `UiConfirmDialog` · `UiPopover` · `UiTooltip` |
| 内容与反馈 | `UiCard` · `UiBadge` · `UiEmptyState` · `UiSpinner` · `UiSkeleton` · `UiDisclosure`      |
| 导航       | `UiTabs` · `UiGlassNav`                                                                  |
| 配置       | `UiConfigProvider`                                                                       |

日期值使用 `YYYY-MM-DD`，时间值使用 `HH:mm`。默认语言为英语、时区为 UTC、每周从周日开始；内置简体中文文案，也可通过 `messages` 接入自己的国际化系统。

[查看所有 Props、事件与插槽 →](docs/components.md)

## 玻璃导航

`UiGlassNav` 提供半透明材质、滑动选中指示器和移动端安全区支持。可以使用按钮、链接，或通过插槽接入 Vue Router。

```vue
<UiGlassNav
  v-model="active"
  label="主导航"
  :items="[
    { value: 'home', label: '首页' },
    { value: 'activity', label: '动态' },
    { value: 'settings', label: '设置' },
  ]"
/>
```

在 `<script setup>` 中用 `const active = ref('home')` 声明选中项。默认在文档流中显示；添加 `floating` 可固定在底部，页面需为导航预留空间。图标、路由及响应式侧栏接入方式见 [导航文档](docs/components.md#ios-风格玻璃导航)。

## 体验与开发

克隆仓库后，使用 Node.js 22.12+ 和 npm 启动交互示例：

```sh
npm ci
npm run dev
```

示例包含全部组件、并存主题、语言切换，以及加载和禁用状态。测试、构建与贡献约定见 [开发指南](CONTRIBUTING.md)；版本发布使用 [GitHub Actions 与 npm Trusted Publishing](docs/releasing.md)。

## License

[MIT](LICENSE) © 2026 kci-lnk
