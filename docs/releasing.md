# npm 发布流程

包名为 `@kci-lnk/gp-ui`，仓库为 <https://github.com/kci-lnk/gp-ui>，许可证为 MIT。此文档描述手动发布流程；Git 推送和 CI 不会自动发布 npm。

## 首次发布前

1. 确认 npm 登录账号有 `kci-lnk` 用户或组织作用域的发布权限。GitHub 的同名账号及 SSH 身份不代表拥有 npm 权限。
2. 使用 `npm login --registry=https://registry.npmjs.org/` 登录，并通过 `npm whoami --registry=https://registry.npmjs.org/` 核对身份。按 npm 提示完成双因素认证；不要将 token、密码或私有 `.npmrc` 放入仓库。
3. 核对包名、版本、MIT 许可证、README、CHANGELOG、repository 和 exports。`publishConfig` 已声明 npm 官方 registry 和 public 访问级别。

## 验证并发布同一个安装包

使用干净工作树、Node 22.12+ 和锁文件安装依赖。未发布的版本可以直接验证；后续版本应先用 `npm version patch --no-git-tag-version`（或明确的 minor/major）递增版本并更新 CHANGELOG。已发布的 name/version 不能重复使用。

```sh
npm ci
npx playwright install --with-deps chromium webkit
CI=1 npm run check
npm pack
```

记录 `npm pack` 输出的文件名，下列命令以当前版本为例。后续发布须替换为实际的新版本，不覆盖此前保存的同名安装包。

```sh
CI=1 npm run verify:package -- ./kci-lnk-gp-ui-0.1.3.tgz
npm publish ./kci-lnk-gp-ui-0.1.3.tgz --dry-run --access public --registry=https://registry.npmjs.org/
```

检查安装包只包含 `dist/`、公开文档、README、CHANGELOG、LICENSE 和 package.json；不应含源码路径、凭据、workspace/file 依赖或业务项目资源。`--dry-run` 不会发布，也不能证明账号有发布权限。

提交、推送并确认 CI 通过后，再执行实际发布：

```sh
npm publish ./kci-lnk-gp-ui-0.1.3.tgz --access public --registry=https://registry.npmjs.org/
npm view @kci-lnk/gp-ui@0.1.3 version dist.integrity --registry=https://registry.npmjs.org/
```

发布成功后为对应提交创建 `v0.1.3` 标签并推送（后续版本使用对应标签），在新的消费项目中从 registry 安装验证。首次发布后更新 README 中“首次发布前”的说明。发布失败时先检查 registry 上该版本是否已存在，避免重复发布或随意替换本地归档。

## 从早期本地包升级

0.1.2 及以前的本地归档使用无作用域名称 `gp-ui`，没有发布到此作用域。升级时应卸载旧包、安装 `@kci-lnk/gp-ui`，并将组件导入和 CSS 导入分别改为 `@kci-lnk/gp-ui`、`@kci-lnk/gp-ui/style.css`。现有固定使用旧 tgz 的项目不会自动升级。

参考：[npm 包元数据](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)、[npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish/)。
