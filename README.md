# GP UI

面向 Vue 3.5 的独立 TypeScript 组件库，提供 22 个组件及 `UiConfigProvider`。保留简洁的黑白灰、红色默认主题，支持 CSS 变量定制、明暗模式、局部主题、国际化和 iOS 风格玻璃导航。

基于 Reka UI 处理键盘、焦点和浮层行为；不依赖业务接口、路由或 vue-i18n。输出 ESM、预编译 CSS 和类型声明，使用者无需安装 Sass，Vue 作为 peer dependency。

## 安装

包名为 **`@kci-lnk/gp-ui`**，要求宿主使用 Vue 3.5。无作用域的 `gp-ui` 是其他维护者的包。

```sh
npm install @kci-lnk/gp-ui vue@^3.5.0
```

也可以在本仓库运行 `npm ci && npm pack`，然后在消费项目中通过 `npm install /path/to/kci-lnk-gp-ui-<version>.tgz` 安装本地归档。

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiInput, UiConfigProvider } from '@kci-lnk/gp-ui';
import '@kci-lnk/gp-ui/style.css';

const name = ref('');
</script>

<template>
  <UiConfigProvider locale="zh-CN" time-zone="Asia/Shanghai" :week-starts-on="1">
    <UiInput v-model="name" label="姓名" />
    <UiButton @click="console.log(name)">保存</UiButton>
  </UiConfigProvider>
</template>
```

全局导入一次库 CSS，并将自己的主题样式放在它之后：

```css
:root {
  --gp-primary: #2563eb;
  --gp-primary-foreground: #fff;
  --gp-accent: #2563eb;
  --gp-accent-soft: #eff6ff;
}
```

危险操作有独立颜色变量，换品牌色不会改变危险操作语义。局部主题通过 `UiConfigProvider theme="ocean"` 和全局 `[data-gp-theme='ocean']` 变量声明实现，挂载到 body 的弹窗、下拉框和提示会共享主题标识。

## 组件与文档

- 表单：Button、Input、Textarea、Switch、Select、NumberField、DatePicker、TimePicker、Weekdays。
- 交互：Dialog、ConfirmDialog、Tabs、Disclosure、IconButton、Tooltip、Popover。
- 展示：Card、Badge、EmptyState、Spinner、Skeleton。
- 导航：GlassNav，支持滑动选中指示器、安全区、浮动布局及路由插槽。
- 配置：ConfigProvider，支持嵌套继承、响应式语言/时区/主题及 RTL。

组件均使用 `Ui` 前缀，如 `UiButton`、`UiGlassNav`。日期值为 `YYYY-MM-DD`，时间值为 `HH:mm`；默认 UTC、周日起始。内置英文和简体中文，可通过 `messages` 接入其他语言。

详见 [组件 Props、事件与插槽](docs/components.md)、[主题与国际化](docs/theming.md)、[开发指南](CONTRIBUTING.md)及 [发布流程](docs/releasing.md)。

## 本地开发与验证

开发环境使用 Node.js 22.12+ 和 npm，推荐通过 `.nvmrc` 选择 Node 22。

```sh
npm ci
npm run dev                         # 交互示例：全部组件、并存主题、语言与表单状态
npm run typecheck
npx playwright install chromium webkit
CI=1 npm run check                  # 类型、27 项浏览器测试、示例构建、独立安装包验证
```

本地直接 `npm test` 默认使用已安装的 Google Chrome 和 Playwright WebKit；`CI=1` 使用 Playwright 管理的 Chromium 和 WebKit。在 Linux 首次安装浏览器可追加 `--with-deps`。

`npm run verify:package` 会自动构建、临时打包，在独立 Vue 项目中安装实际 tgz，再验证严格类型、生产构建、CSS 主题和交互。也可以运行 `npm run verify:package -- /path/to/package.tgz` 验证已打好的同版本包。临时文件自动清理，不会覆盖已有版本的安装包。

## 许可证

[MIT](LICENSE) © 2026 kci-lnk。
