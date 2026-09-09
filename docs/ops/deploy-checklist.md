# 部署清单（手工步骤）

> CI 流水线（`.github/workflows/deploy.yml`）已就绪；以下平台配置需手工完成。
> 完成一项勾一项 `[ ]` → `[x]`。**M4 上线收尾（2026-09）已全量走完，本清单留存作后续发布参考。**

## 1. GitHub Pages + 自定义域名（全部完成）

- [x] 仓库 public（GitHub Pages 免费版前提）
- [x] 仓库 Settings → Pages → Source 选择 **GitHub Actions**
- [x] Cloudflare DNS 添加 4 条 A 记录（灰云/DNS only）：
      `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
- [x] Settings → Pages → Custom domain 填写 `nkdshinku.com` 并保存（状态：**DNS valid for primary**）
- [ ] 补 `www` 子域（可选，未做）：Cloudflare 加 CNAME `www` → `NKDShinKu.github.io`（灰云）
- [x] HTTPS 证书签发（2026-09）
- [x] 勾选 **Enforce HTTPS**（实测 http 301 → https）
- [x] 推送 `main` 触发部署
- [x] 部署验证（2026-09 M4 T10 线上实测）：
  - [x] 首页可访问（https 200）
  - [x] https 访问且证书有效
  - [x] 404 页生效（不存在路径返回 404 + 自定义 404 页内容）
  - [x] Pagefind 产物存在 `https://nkdshinku.com/pagefind/pagefind.js`
- [x] 本地 `git remote -v` 确认为 `NKDShinKu/NKDShinKu`

## 2. Cloudflare R2 图床（M4 已接入）

- [x] R2 创建存储桶 `nkdshinku-assets`
- [x] 绑定自定义域 `img.nkdshinku.com` → 该存储桶
- [x] 创建 API Token（对象读/写），本地配置 rclone（S3 兼容端点，remote 名 `r2`）
- [x] 约定目录：`/images/posts/`、`/images/projects/`；公网 URL 形如
      `https://img.nkdshinku.com/images/...`（文章 frontmatter 的 `cover` 按此填写）
- [x] 上传测试图片并验证访问与缓存（4 张文章封面 200 OK / image/png / ETag / max-age=14400）

## 3. giscus 评论（M4 全量上线，D19）

- [x] 仓库 Settings → 勾选 **Discussions**
- [x] 安装 [giscus App](https://github.com/apps/giscus) 并授权 `NKDShinKu/NKDShinKu`
- [x] 在 [giscus.app](https://giscus.app) 生成配置（分类 `Blog`，pathname 映射）
- [x] 配置写入 `src/lib/site.config.ts`（含 `enabled` 开关，实测不佳可一键下线）
- [x] 实测国内网络下评论加载与提交（本地评论成功入库 Discussion；线上 iframe 加载实测通过；
      注意 pathname 映射下 localhost 测试评论线上同样可见，Discussion 正文回链为创建时来源）

## 4. Bangumi（M3 完成，D14 实测闭环）

- [x] bangumi.tv 获取自己的用户 ID（`796189`，D6）
- [x] 浏览器实测 CORS 可用性（D14：ACAO `*`、浏览器 UA 放行、12 并发无限流，走直连分支）
- [x] ACG 板块已上线（`/acg` hub + `/acg/anime` 归档，浏览器端 fetch + localStorage 缓存）

## 5. 可选增强（M5 候选）

- [ ] Cloudflare Web Analytics（免费统计，同生态；注意非目标约束「不设访问统计」，启用前需用户确认）
- [x] 站内 OG 图（M4 T3 完成：静态品牌图 `og.png` 全站共用 + twitter card）
- [ ] 国内访问质量评估 → 必要时迁移 Cloudflare Pages
