# 开发指南

要求 Node.js 22.12+ 和 npm。克隆仓库后运行 `npm ci`，使用 `npm run dev` 打开交互示例。运行 `npx playwright install chromium webkit` 安装测试浏览器；Linux 可追加 `--with-deps`。

## 目录

- `src/`：组件、配置、国际化与预编译 CSS 源文件。
- `playground/`：交互示例，包括多个主题、明暗模式、语言与禁用/加载状态。
- `tests/`：桌面、375px Chromium 和 390px WebKit 行为回归。
- `scripts/`：生产构建与独立安装包验证。
- `docs/`：组件接口、主题配置与发布流程。

## 修改约定

保持 Vue 3.5、ESM 和现有 `Ui` 命名。组件不引入业务接口、路由或业务国际化依赖。新增样式使用 `gp-` 前缀及 `--gp-*` 变量，不添加宿主全局重置。浮层通过 Provider 的主题容器挂载，注意键盘、焦点恢复、RTL、减少动态效果及移动端安全区。

公共接口或主题变量变化须同步文档、示例和 CHANGELOG。影响交互的修改应加入针对性测试。提交前执行：

```sh
CI=1 npm run check
```

CI 使用同一命令，覆盖严格消费端类型检查与真实 tgz 安装，确保库不依赖工作区源码。不要提交 `node_modules`、构建产物、tgz、测试报告、环境文件或 npm 凭据。发布步骤见 [发布流程](docs/releasing.md)。
