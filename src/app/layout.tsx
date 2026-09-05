import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Quicksand } from "next/font/google";
import { siteConfig } from "@/lib/site.config";
import { themeInitScript } from "@/lib/theme";
import { getAllPosts } from "@/lib/posts";
import { AuroraBackground } from "@/components/layout/aurora-background";
import { BackToTop } from "@/components/layout/back-to-top";
import { ParticlesBackground } from "@/components/layout/particles-canvas";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["NKDShinKu", "博客", "技术", "二次元", "个人项目"],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};

/** theme-color 随主题匹配页面底色（guidelines：dark mode & theming） */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b2e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 搜索弹窗空态的「最近文章」（S-11）：构建期派生，客户端组件仅接收纯数据
  const searchRecent = getAllPosts()
    .slice(0, 5)
    .map((post) => ({ title: post.title, href: `/posts/${post.slug}/` }));

  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${quicksand.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-text flex min-h-dvh flex-col font-sans antialiased">
        {/* 主题初始化内联脚本：先于内容渲染执行，防止亮暗闪烁（脚本见 lib/theme.ts） */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="focus:bg-surface focus:text-text focus:border-border sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:border focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
        >
          跳到主要内容
        </a>
        {/* 全局背景：极光光斑 + 萤火粒子（与 design-system-preview 同源，装饰层 aria-hidden） */}
        <AuroraBackground />
        <ParticlesBackground />
        {/* 顶栏 fixed 悬浮（首页首屏透明态，见 site-header）：非首页页面各自以 pt-24/28 补偿高度 */}
        <SiteHeader searchRecent={searchRecent} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        {/* 回到顶部（滚动百分比环形进度，见组件注释） */}
        <BackToTop />
      </body>
    </html>
  );
}
