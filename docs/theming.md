# 配置、国际化与主题

## 配置与国际化

`UiConfigProvider` 的配置响应式更新，子 Provider 继承未指定字段，`messages` 按键合并。

| 属性         | 默认值 | 说明                                                            |
| ------------ | ------ | --------------------------------------------------------------- |
| locale       | en-US  | 日期、时间、数字和星期显示语言；内置英文与简体中文文案          |
| messages     | {}     | `Partial<UiMessages>`，覆盖关闭、确认、取消等组件文案           |
| timeZone     | UTC    | IANA 时区，决定日期格式化及“今天”                               |
| weekStartsOn | 0      | 0=周日，1=周一，支持 0–6                                        |
| dir          | ltr    | 文本方向，传递给 Reka UI 和浮层                                 |
| theme        | 未设置 | 自定义主题名称，映射为 data-gp-theme                            |
| mode         | 未设置 | light/dark；未设置时继承全局变量，不自行读取系统或 localStorage |

无 Provider 也能使用组件。导出 `enUS`、`zhCN`、`UiMessages`、`UiMessageKey`、`UiConfig`、`useUiConfig`。字符串消息里的 `{label}`、`{p0}` 会被替换；宿主可以用自己的国际化系统响应式生成 messages。标题和错误信息传入已翻译的字符串，不接受业务消息对象。

## CSS 变量主题

```css
/* 在 @kci-lnk/gp-ui/style.css 之后导入 */
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
<UiConfigProvider theme="ocean" mode="dark"><YourContent /></UiConfigProvider>
```

Provider 创建专属 body 浮层容器，复制主题、模式、语言和方向标识，卸载时清理。嵌套 Provider 的浮层继承其配置。共享主题必须使用**全局** `[data-gp-theme]` 选择器；普通祖先或 scoped 样式中的变量不会跨 Teleport 继承。动态 CSS 规则立即同时影响内容与浮层。

| 变量组     | 变量                                                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 品牌与选择 | --gp-primary、--gp-primary-foreground、--gp-accent、--gp-accent-soft                                                                                                   |
| 表面       | --gp-bg、--gp-surface、--gp-surface-raised、--gp-soft、--gp-border                                                                                                     |
| 文字与状态 | --gp-text、--gp-muted、--gp-success、--gp-warning、--gp-warning-soft、--gp-danger、--gp-danger-soft                                                                    |
| 危险按钮   | --gp-danger-background、--gp-danger-foreground（独立于品牌色和错误文字）                                                                                               |
| 形状       | --gp-radius、--gp-card-radius、--gp-dialog-radius                                                                                                                      |
| 阴影       | --gp-shadow、--gp-shadow-dialog、--gp-shadow-popover、--gp-shadow-tooltip、--gp-overlay                                                                                |
| 字体与动效 | --gp-font-family、--gp-motion-fast、--gp-motion-enter、--gp-motion-ease                                                                                                |
| 玻璃导航   | --gp-nav-glass、--gp-nav-rim、--gp-nav-glint、--gp-nav-shade、--gp-nav-shadow、--gp-nav-selection、--gp-nav-selection-rim、--gp-nav-label、--gp-navigation-safe-bottom |

内置亮色与暗色变量使用 `data-gp-mode`。也可在 html 上直接设置该属性实现全局明暗切换。组件类及动效使用 `gp-` 命名，不重置宿主 body、链接和普通按钮。尊重减少动态效果、减少透明度和增强对比度偏好。
