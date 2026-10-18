# npm 自动发布

包名为 `@kci-lnk/gp-ui`，仓库为 <https://github.com/kci-lnk/gp-ui>，许可证为 MIT。`.github/workflows/publish.yml` 通过 npm Trusted Publishing（OIDC）发布，不需要 `NPM_TOKEN` 或其他长期发布凭据。

## 发布新版本

1. 更新版本及 CHANGELOG，在 main 分支提交、推送。
2. 推送与 `package.json` 版本完全一致的 `v` 前缀 tag，或者在 GitHub 创建对应版本的 Release。
3. 等待 **Publish npm** 工作流通过，然后从 npm 安装验证。

例如，下一个补丁版本：

```sh
npm version patch --no-git-tag-version
# 编辑 CHANGELOG.md，记录本次变化
npm run typecheck
npm test
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release next patch"
git push origin main
# 将下方 X.Y.Z 替换为 package.json 的实际版本
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

也可先推送版本提交，再通过 GitHub 的 Releases → Draft a new release 创建 `vX.Y.Z` tag 并发布。Release 和 tag push 都会触发流程；同一版本串行执行，若 registry 中已有相同完整性的归档，则不重复发布。如果同版本内容不同，流程失败，必须递增版本，不能覆盖已发布的 npm 版本或移动已有发布 tag。

稳定版本进入 `latest`，带预发布后缀的版本（例如 `0.2.0-beta.1`）进入 `next`。分支普通 push、PR、Release 草稿不会发布 npm。

README 也是 npm 包的一部分：只推送 GitHub 不会更新 npmjs 页面。更新 npm 上的 README 时，同样需要递增版本并触发发布。

## 工作流执行内容

- 校验 tag、package.json 和 package-lock.json 版本一致，提交属于 origin/main 历史。
- 使用 GitHub 托管的 Ubuntu 24.04、Node 22 和固定 npm 11.21.0；发布构建不恢复依赖缓存。
- `npm ci`、类型检查、27 项 Chromium/WebKit 浏览器回归及示例生产构建。
- 构建 ESM/CSS/声明并打成 `.release/package.tgz`，在独立 Vue 项目验证这个归档。
- 通过 OIDC 发布同一个归档，等待 npm 处理及 registry 同步（最多 10 分钟），并核对返回的 SHA-512 完整性。
- 保存 tgz 为 GitHub Actions artifact，保留 30 天。失败时保存测试结果。

GitHub 托管的公开仓库通过 OIDC 发布公开 npm 包时，npm 自动生成 provenance 来源证明。

## npm 侧配置

npm → `@kci-lnk/gp-ui` → Settings → Trusted publishing：

| 字段                 | 值                                              |
| -------------------- | ----------------------------------------------- |
| Provider             | GitHub Actions                                  |
| Organization or user | `kci-lnk`                                       |
| Repository           | `gp-ui`                                         |
| Workflow filename    | `publish.yml`                                   |
| Environment name     | 留空（本工作流不使用 environment）              |
| Allowed actions      | 允许 `npm publish`；无需额外允许 `npm dist-tag` |

配置必须与仓库及工作流文件名完全一致。工作流只有发布 job 获得 `id-token: write`，不使用 npm token Secret。npm 账号仍保持双因素认证。

首次建包需要管理员通过 npm CLI 和浏览器认证发布一次，才能在包设置页建立可信发布连接；随后再发布一个新版本验证 OIDC。新建可信连接须在 2 天内完成首次成功发布。以后不需要重复 CLI 登录或手工提供验证码。

## 失败与重试

在 GitHub Actions 打开失败的 **Publish npm**，先修复原因再重跑。若代码或包内容需要修改，应使用新版本和新 tag。若只是 npm 信任配置字段错误、浏览器下载或网络失败，可修复配置后重跑同一提交。重复执行会校验已有版本的归档完整性，而不是覆盖。

本地可用 `npm run verify:package` 执行自动临时打包验证；`npm run verify:package -- /path/to/package.tgz` 验证指定归档。不要将 token、`.npmrc` 或登录配置提交到 Git。

## 从早期本地包升级

0.1.2 及以前的本地归档使用无作用域名称 `gp-ui`。升级时卸载旧包、安装 `@kci-lnk/gp-ui`，并将组件导入和 CSS 导入分别改为 `@kci-lnk/gp-ui`、`@kci-lnk/gp-ui/style.css`。固定使用旧 tgz 的项目不会自动升级。

参考：[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)、[npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish/)。
