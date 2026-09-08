import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site.config";

/** 静态导出红线：sitemap/robots/manifest/route 必须显式 force-static（AGENTS §7） */
export const dynamic = "force-static";

/** PWA manifest（REQ-F6）：图标由 scripts/generate-icons.mjs 生成；颜色取设计 token（accent / 亮底 bg） */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f0f4f8",
    theme_color: "#5b8fd4",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
