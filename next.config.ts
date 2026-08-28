import type { NextConfig } from "next";

/**
 * 静态导出配置（GitHub Pages 部署）
 *
 * - output: "export"  全静态导出到 out/，禁用一切服务端能力
 *   （API Routes / middleware / ISR / Server Actions / 动态渲染均不可用）
 * - trailingSlash     导出为 about/index.html 形式，兼容 GitHub Pages 的
 *   无扩展名 URL 访问，同时保持站内链接规范统一
 * - images.unoptimized next/image 在静态导出下必须关闭内置优化，
 *   图片将直接引用源地址（后续图床统一走 Cloudflare R2）
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
