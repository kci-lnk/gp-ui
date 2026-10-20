# 组件 API

从 `@kci-lnk/gp-ui` 命名导入组件和类型。

## 组件 API

所有组件支持 Vue 原生事件及适用的 HTML 属性。`UiInput`、`UiTextarea`、`UiIconButton` 将额外属性传到内部交互元素。除特别说明外，`v-model` 对应 `modelValue / update:modelValue`，插槽为 default。

| 组件            | 属性 / 模型                                                                | 插槽与事件                                                       |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| UiButton        | variant=primary/secondary/danger；loading、disabled、asChild；type=button  | default；click。加载时禁用                                       |
| UiInput         | label 必填；hint、error；v-model: string/number                            | default 不使用；trailing；input/change 等原生属性                |
| UiTextarea      | label 必填；v-model: string；rows/disabled 等透传                          | 原生事件                                                         |
| UiNumberField   | label、v-model:number 必填；min、max、step=1、required、disabled、digits=2 | 格式根据 locale；禁用滚轮改值                                    |
| UiSelect        | label、options、v-model:string/number 必填；disabled                       | options 为 `{value,label,disabled?}[]`                           |
| UiSwitch        | label 必填；hint、disabled；v-model:boolean                                | 标签包含辅助说明                                                 |
| UiTabs          | label、items、v-model:string 必填                                          | items 为 `{value,label}[]`；用于切换外部面板                     |
| UiDatePicker    | label、v-model:string 必填；min、max、disabled                             | ISO `YYYY-MM-DD`，空值为空字符串；边界包含当日                   |
| UiTimePicker    | label、v-model:string 必填；disabled                                       | 24 小时 `HH:mm`；空值为空字符串                                  |
| UiWeekdays      | v-model:number[] 必填；disabled                                            | 1=周一至7=周日，显示顺序由 weekStartsOn 决定                     |
| UiDialog        | title、description 必填；v-model:open                                      | default；关闭后恢复打开前的焦点                                  |
| UiConfirmDialog | title、description、confirmLabel、danger、loading、error；v-model:open     | title、description、error 插槽；confirm 事件，宿主控制成功后关闭 |
| UiPopover       | title 必填；v-model:open 可选                                              | trigger 必须是单个可交互元素；default 内容                       |
| UiTooltip       | text 必填                                                                  | default 为单个触发元素                                           |
| UiIconButton    | label 必填，兼作 aria-label 和 tooltip                                     | default 图标                                                     |
| UiDisclosure    | 基于 Reka Collapsible；额外属性传给根节点                                  | title、default                                                   |
| UiCard          | as=section、asChild                                                        | header、default、footer；不设置外部间距                          |
| UiBadge         | variant=neutral/primary/success/warning/danger；dot                        | default 文本                                                     |
| UiEmptyState    | title、description                                                         | icon、title、description、default、actions                       |
| UiSpinner       | size=17（px）、label、decorative=false                                     | 单独使用为 status，按钮内部设 decorative                         |
| UiSkeleton      | width=100%、height=1em、radius、animated=true                              | aria-hidden，不承担加载状态播报                                  |

`UiCard asChild` 时传入单个根元素，不同时提供 header/footer。`UiConfirmDialog` 的 loading 会禁用操作及 Esc 关闭，确认事件不会自动关闭对话框，适合异步提交。

## iOS 风格玻璃导航

```vue
<UiGlassNav v-model="active" :items="items" label="主导航">
  <template #icon="{ item }"><YourIcon :name="item.value" /></template>
</UiGlassNav>
```

- `items`: `{value:string,label:string,disabled?:boolean,href?:string}[]`，导出类型 `GlassNavItem`。
- `v-model`: 当前 value，空字符串代表无选中项；项数决定指示器宽度。
- `select(value)`：选中事件；不依赖 vue-router。提供 href 时渲染链接，否则渲染按钮。
- `item` 插槽接收 `{item,active}`，可直接返回 RouterLink，组件自动合并样式、aria-current 和点击行为。也可只使用 `icon` 插槽。
- `floating=false`：默认在文档流内；启用后固定在底部，自动计入安全区。宿主必须为内容留出底部空间。
- `responsive=false`：默认始终显示玻璃导航；启用后宽屏变为竖向普通导航，760px 以下或矮屏触摸设备显示玻璃样式。宿主负责侧栏容器布局。
- `aria-current`、键盘原生激活、减少动态效果、透明度降级以及 RTL 指示器均由组件处理。

## Pagination and flat navigation

`UiPagination` accepts `v-model` (one-based page), `total`, `pageSize` (default 20), and `disabled`. It displays a bounded page window, previous/next controls, current-page semantics and a live result summary. Fetch the requested page in the consumer; reset or clamp the model when filters or result totals change. Optional `label`, `previousLabel`, `nextLabel`, and `summary` override translated text. Locale messages also include `pageNumber`.

`UiTabs` accepts `variant="line"` for a single horizontal navigation row with a trailing underline. The default remains `segmented`. Line tabs scroll within their container on narrow screens and retain Reka keyboard navigation.
