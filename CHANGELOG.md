# Changelog

## 0.1.7

- README 增加 GP Dashboard 实际界面配图，说明 GP UI 的名称与组件库来源。
- 配图使用公开绝对地址，兼容 GitHub 与 npm 页面；配图不随 npm 安装包分发。
- 本版本仅更新文档和包版本，组件 API、JavaScript 与 CSS 保持不变。

## 0.1.6

- 重写 README，补充快速开始、CSS 变量主题、组件分类及玻璃导航示例。
- 添加 npm、CI、Vue 与许可证徽章，文档链接兼容 GitHub 和 npm 页面。
- 本版本仅更新文档和包版本，组件 API、JavaScript 与 CSS 保持不变。

## 0.1.5

- 兼容 npm 10 与 npm 11 的发布预演 JSON 格式。
- 发布后等待 npm 处理和 registry 同步，再验证安装包完整性。

## 0.1.4（工作流验证，未发布 npm）

- 配置 GitHub tag / Release 驱动的 npm Trusted Publishing，无需长期发布 token。
- 发布前校验 tag、版本和 main 提交历史，执行浏览器测试及独立安装验证。
- 发布经过验证的同一个 tgz，校验 registry 完整性并避免重复发布。
- 更新 npm 安装说明与自动发布操作指南。

## 0.1.3

首次整理为独立 Git 仓库，以 `@kci-lnk/gp-ui` 作为 npm 包名。

- 将早期本地包 `gp-ui` 改为作用域包 `@kci-lnk/gp-ui`，采用 MIT 许可证。
- 提供 22 个 Vue 组件及配置 Provider，包括 iOS 风格玻璃导航。
- 提供 CSS 变量、明暗与局部主题、主题浮层容器、英文/简体中文和宿主文案扩展。
- 整理安装、完整组件接口、主题、开发和发布文档。
- 修复嵌套主题示例的卡片间距，让并存主题使用一致的布局。
- 增加独立 tgz 消费验证和 GitHub Actions 检查。

## 0.1.2（本地发行）

- 完成业务依赖拆分、玻璃导航和主题隔离回归。
- 修复构建环境对产物路径的影响，并验证严格消费端类型及焦点恢复。
