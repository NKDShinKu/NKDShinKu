# 部署清单（手工步骤）

> CI 流水线（`.github/workflows/deploy.yml`）已就绪；以下平台配置需手工完成。
> 完成一项勾一项 `[ ]` → `[x]`。

## 1. GitHub Pages + 自定义域名

- [x] 仓库 public（GitHub Pages 免费版前提）
- [x] 仓库 Settings → Pages → Source 选择 **GitHub Actions**
- [x] Cloudflare DNS 添加 4 条 A 记录（灰云/DNS only）：
      `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
- [x] Settings → Pages → Custom domain 填写 `nkdshinku.com` 并保存（状态：**DNS valid for primary**）
- [ ] 补 `www` 子域（可选）：Cloudflare 加 CNAME `www` → `NKDShinKu.github.io`（灰云）
- [x] HTTPS 证书签发（2026-09 完成，manifest 变更记录闭环）
- [ ] 勾选 **Enforce HTTPS**（Settings → Pages；证书就绪后可勾，M4 T10 执行）
- [x] 推送 `main` 触发首次部署（站点已上线于 http）
- [ ] 部署验证：
  - [x] 首页可访问（http 已通）
  - [ ] https 访问且证书有效（M4 T10 验证）
  - [ ] 404 页生效（访问一个不存在路径）
  - [ ] Pagefind 产物存在 `https://nkdshinku.com/pagefind/pagefind.js`
- [x] 本地 `git remote -v` 确认为 `NKDShinKu/NKDShinKu`

## 2. Cloudflare R2 图床（M4 接入文章时完成）

- [x] R2 创建存储桶 `nkdshinku-assets`
- [x] 绑定自定义域 `img.nkdshinku.com` → 该存储桶
- [ ] 创建 API Token（对象读/写权限），本地配置 rclone（S3 兼容端点）
- [ ] 约定目录：`/images/posts/`、`/images/projects/`；公网 URL 形如
      `https://img.nkdshinku.com/images/...`（文章 frontmatter 的 `cover` 按此填写）
- [ ] 上传测试图片并验证访问与缓存

## 3. giscus 评论（M4 重启：D5 从 P3 暂缓转全量上线，T8 执行）

- [ ] 仓库 Settings → 勾选 **Discussions**
- [ ] 安装 [giscus App](https://github.com/apps/giscus) 并授权 `NKDShinKu/NKDShinKu`
- [ ] 在 [giscus.app](https://giscus.app) 生成配置，记录 `repoId`、`categoryId`
- [ ] 配置写入 `src/lib/site.config.ts`（giscus 配置是公开信息，可直接入库）
- [ ] 实测国内网络下评论加载与提交（决定是否保留 giscus）

## 4. Bangumi（M3 完成，D14 实测闭环）

- [x] bangumi.tv 获取自己的用户 ID（`796189`，D6）
- [x] 浏览器实测 CORS 可用性（D14：ACAO `*`、浏览器 UA 放行、12 并发无限流，走直连分支）
- [x] ACG 板块已上线（`/acg` hub + `/acg/anime` 归档，浏览器端 fetch + localStorage 缓存）

## 5. 可选增强

- [ ] Cloudflare Web Analytics（免费统计，同生态）
- [ ] 站内 OG 图（文章社交分享封面）
- [ ] 国内访问质量评估 → 必要时迁移 Cloudflare Pages
