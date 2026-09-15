/**
 * ACG 资源提示（M5）：`<head>` 连接预热。
 *
 * 为什么需要：这两个域的请求都不是在 HTML 里发现的——api.bgm.tv 要等水合后的 fetch，
 * 封面 lain.bgm.tv 还要等 API 返回才知道 URL。实测这两个域的 TLS 握手 0.7–3.0s
 * （2026-09 实测），提前建连等于把这部分从关键路径上摘掉。
 *
 * crossorigin 的取舍（Resource Hints 规范）：preconnect 的连接模式必须与真实请求一致——
 * · api.bgm.tv 走 `fetch()`（CORS 模式）→ 用 `crossOrigin` 的匿名连接
 * · 封面是普通 `<img>`（no-CORS）→ 用不带 crossorigin 的 preconnect
 *
 * 由 React 19 提升到 `<head>`（静态导出下即静态 HTML 的 head），同 layout.tsx 的 RSS 用法。
 */
export function AcgResourceHints() {
  return (
    <>
      <link rel="preconnect" href="https://api.bgm.tv" crossOrigin="" />
      <link rel="preconnect" href="https://lain.bgm.tv" />
      <link rel="dns-prefetch" href="https://lain.bgm.tv" />
    </>
  );
}
