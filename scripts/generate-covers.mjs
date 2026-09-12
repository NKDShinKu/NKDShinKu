/**
 * 文章封面生成（T7 / D19）—— 代码自绘 16:10 主题封面，输出 960×600 WebP
 *
 * 风格：Soft ACG Fusion 与站点同频——亮底极光渐变 + 主题几何母题 + 关键词。
 * 卡片内封面为小尺寸展示（桌面 w-56 / 移动 w-28），构图以「大色块 + 大字」为主，细节克制。
 * 颜色取设计 token（globals.css @theme 亮色态）。
 *
 * 画布沿用 840×525 的设计坐标系，导出前按 OUT_W×OUT_H 等比放大（矢量无损）；
 * WebP 兼顾体积与高分屏清晰度（960 宽 ≈ 30KB，旧 PNG 840 宽 ≈ 97KB）。
 *
 * 用法：`pnpm generate:covers`（样稿评审通过后批量）；产物 assets/covers/<slug>.webp
 * （不进 public/——封面由 R2 图床提供，避免打进 Pages 产物形成重复托管），
 * 经 rclone 上传 R2 后把绝对 URL 填入 frontmatter cover。
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
/** 设计坐标系（SVG viewBox 与所有内部坐标都基于它） */
const W = 840;
const H = 525;
/** 导出尺寸：同比例放大 8/7，覆盖移动端 2x 屏 */
const OUT_W = 960;
const OUT_H = 600;

/** 品牌色 token */
const C = {
  accent: "#5b8fd4",
  accentLight: "#8fb8e8",
  accentDark: "#3a6fb0",
  sakura: "#f0a0b8",
  sakuraLight: "#f4c0d0",
  twilight: "#9b8ec4",
  ink: "#2b3a55",
  muted: "#5a6b85",
};

/** 共享骨架：亮底渐变 + 极光光斑（与 og.png 同族但更收敛，避免在卡片里喧宾夺主） */
function base(blobs) {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf1fa"/>
      <stop offset="1" stop-color="#f0f4f8"/>
    </linearGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${blobs}`;
}

/**
 * 各篇主题母题（M = motif）：
 * - hello-world：站点启航——logo 方块 + 星屑 + 「Hello, World!」
 * - tailwind-v4-design-tokens：设计 token——色板色阶
 * - static-blog-giscus-guide：评论接入——对话气泡
 * - static-blog-seo-guide：SEO——页面网格 + 放大镜
 * （条目须与 content/posts 下的文章 slug 一一对应；写新封面时在此登记主题）
 */
const covers = {
  "hello-world": {
    title: "Hello, World!",
    subtitle: "建站随笔",
    body: `
  ${base(`
    <ellipse cx="120" cy="90" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="760" cy="460" rx="210" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="780" cy="80" rx="170" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 新生之星：四芒星 + 虚线轨道 + 轨道星点（「这个博客诞生了」意象，用户决策弃用 N logo） -->
  <circle cx="420" cy="168" r="86" fill="none" stroke="${C.twilight}" stroke-width="2" stroke-dasharray="4 10" opacity="0.45"/>
  <defs>
    <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.accent}"/>
      <stop offset="1" stop-color="${C.sakura}"/>
    </linearGradient>
  </defs>
  <path d="M 420 116 L 433 155 L 462 168 L 433 181 L 420 220 L 407 181 L 378 168 L 407 155 Z" fill="url(#starGrad)"/>
  <circle cx="506" cy="168" r="5" fill="${C.accent}"/>
  <circle cx="355" cy="225" r="4" fill="${C.sakura}"/>
  <!-- 星屑点缀 -->
  <path d="M 180 320 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.sakura}" opacity="0.9"/>
  <path d="M 700 240 l 3.5 9.5 9.5 3.5 -9.5 3.5 -3.5 9.5 -3.5 -9.5 -9.5 -3.5 9.5 -3.5 z" fill="${C.accent}" opacity="0.8"/>
  <circle cx="240" cy="200" r="5" fill="${C.twilight}" opacity="0.7"/>
  <circle cx="640" cy="380" r="4" fill="${C.sakuraLight}" opacity="0.9"/>
  <!-- 标题区 -->
  <text x="420" y="330" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle">Hello, World!</text>
  <text x="420" y="384" font-family="'Microsoft YaHei', sans-serif" font-size="26" fill="${C.muted}" text-anchor="middle">这个博客的由来与打算</text>
  <!-- 品牌渐变短线 -->
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.accent}"/><stop offset="0.5" stop-color="${C.twilight}"/><stop offset="1" stop-color="${C.sakura}"/>
  </linearGradient>
  <rect x="360" y="410" width="120" height="5" rx="2.5" fill="url(#brand)"/>`,
  },

  "tailwind-v4-design-tokens": {
    title: "Design Tokens",
    subtitle: "Tailwind v4",
    body: `
  ${base(`
    <ellipse cx="130" cy="420" rx="200" ry="150" fill="${C.sakura}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="110" rx="190" ry="140" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>`)}
  <!-- 色板 token：品牌三色 + 阶梯 -->
  <g>
    <rect x="330" y="150" width="54" height="140" rx="12" fill="${C.accent}"/>
    <rect x="394" y="150" width="54" height="140" rx="12" fill="${C.accentLight}"/>
    <rect x="458" y="150" width="54" height="140" rx="12" fill="${C.sakura}"/>
    <rect x="522" y="150" width="54" height="140" rx="12" fill="${C.sakuraLight}"/>
    <rect x="586" y="150" width="54" height="140" rx="12" fill="${C.twilight}"/>
  </g>
  <!-- 色阶圆点 -->
  <g>
    <circle cx="360" cy="340" r="9" fill="${C.accent}" opacity="0.9"/>
    <circle cx="400" cy="340" r="9" fill="${C.accent}" opacity="0.7"/>
    <circle cx="440" cy="340" r="9" fill="${C.accent}" opacity="0.5"/>
    <circle cx="480" cy="340" r="9" fill="${C.accent}" opacity="0.35"/>
    <circle cx="520" cy="340" r="9" fill="${C.accent}" opacity="0.2"/>
  </g>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="46" font-weight="700" fill="${C.ink}" text-anchor="middle">Design Tokens</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">Tailwind v4 设计令牌实践</text>`,
  },

  "static-blog-giscus-guide": {
    title: "giscus",
    subtitle: "评论区接入实录",
    body: `
  ${base(`
    <ellipse cx="130" cy="100" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="450" rx="210" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="770" cy="90" rx="170" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <defs>
    <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.accent}"/>
      <stop offset="1" stop-color="${C.twilight}"/>
    </linearGradient>
    <linearGradient id="bubbleGrad2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.sakura}"/>
      <stop offset="1" stop-color="${C.accentLight}"/>
    </linearGradient>
  </defs>
  <!-- 对话气泡母题：一问一答（评论区意象） -->
  <g>
    <rect x="170" y="130" width="200" height="96" rx="24" fill="url(#bubbleGrad)"/>
    <path d="M 220 226 l 14 26 12 -26 z" fill="${C.accent}"/>
    <g fill="#ffffff" opacity="0.9">
      <circle cx="235" cy="178" r="9"/>
      <circle cx="270" cy="178" r="9"/>
      <circle cx="305" cy="178" r="9"/>
    </g>
  </g>
  <g>
    <rect x="470" y="200" width="220" height="88" rx="24" fill="url(#bubbleGrad2)"/>
    <path d="M 600 288 l -12 26 -14 -26 z" fill="${C.sakura}"/>
    <g stroke="#ffffff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 520 244 l 18 18 34 -36"/>
    </g>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 160 360 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.sakura}" opacity="0.9"/>
  <path d="M 710 330 l 3.5 9.5 9.5 3.5 -9.5 3.5 -3.5 9.5 -3.5 -9.5 -9.5 -3.5 9.5 -3.5 z" fill="${C.accent}" opacity="0.8"/>
  <circle cx="250" cy="90" r="5" fill="${C.twilight}" opacity="0.7"/>
  <circle cx="620" cy="90" r="4" fill="${C.sakuraLight}" opacity="0.9"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle">giscus</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">给静态博客装上评论区</text>`,
  },

  "static-blog-seo-guide": {
    title: "SEO",
    subtitle: "静态博客的搜索引擎基建",
    body: `
  ${base(`
    <ellipse cx="140" cy="110" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="730" cy="450" rx="210" ry="150" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="780" cy="100" rx="160" ry="120" fill="${C.sakura}" opacity="0.18" filter="url(#soft)"/>`)}
  <defs>
    <linearGradient id="magGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.accent}"/>
      <stop offset="1" stop-color="${C.twilight}"/>
    </linearGradient>
  </defs>
  <!-- 母题：页面网格 + 放大镜（被找到的意象） -->
  <g>
    <rect x="220" y="120" width="180" height="230" rx="14" fill="#ffffff" opacity="0.85"/>
    <g fill="${C.accentLight}" opacity="0.9">
      <rect x="244" y="150" width="90" height="12" rx="6"/>
      <rect x="244" y="176" width="132" height="8" rx="4" opacity="0.7"/>
      <rect x="244" y="192" width="132" height="8" rx="4" opacity="0.7"/>
      <rect x="244" y="208" width="100" height="8" rx="4" opacity="0.7"/>
    </g>
    <g fill="${C.sakuraLight}">
      <rect x="244" y="240" width="40" height="40" rx="8" opacity="0.8"/>
      <rect x="294" y="240" width="40" height="40" rx="8" opacity="0.8"/>
      <rect x="344" y="240" width="32" height="40" rx="8" opacity="0.8"/>
    </g>
    <rect x="244" y="296" width="132" height="8" rx="4" fill="${C.accentLight}" opacity="0.7"/>
    <rect x="244" y="312" width="110" height="8" rx="4" fill="${C.accentLight}" opacity="0.7"/>
  </g>
  <!-- 放大镜 -->
  <g>
    <circle cx="480" cy="220" r="82" fill="#ffffff" opacity="0.25"/>
    <circle cx="480" cy="220" r="82" fill="none" stroke="url(#magGrad)" stroke-width="16"/>
    <circle cx="480" cy="220" r="82" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.6"/>
    <rect x="548" y="296" width="26" height="110" rx="13" fill="${C.accentDark}" transform="rotate(-45 561 351)"/>
    <path d="M 452 196 l 8 20 20 8 -20 8 -8 20 -8 -20 -20 -8 20 -8 z" fill="#ffffff" opacity="0.85"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 700 200 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.sakura}" opacity="0.9"/>
  <circle cx="180" cy="420" r="5" fill="${C.twilight}" opacity="0.7"/>
  <circle cx="660" cy="90" r="4" fill="${C.sakuraLight}" opacity="0.9"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="4">SEO</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">让好内容被找到</text>`,
  },

  "html-basics": {
    title: "HTML",
    subtitle: "结构与语义",
    body: `
  ${base(`
    <ellipse cx="130" cy="100" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="450" rx="210" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="770" cy="90" rx="170" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 尖括号：HTML 的视觉符号 -->
  <text x="176" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.accent}" opacity="0.85" text-anchor="middle">&lt;</text>
  <text x="664" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.sakura}" opacity="0.85" text-anchor="middle">&gt;</text>
  <!-- 文档骨架：语义分区色块 + 内容行 -->
  <g>
    <rect x="286" y="150" width="268" height="180" rx="16" fill="#ffffff" opacity="0.55" stroke="${C.accentLight}" stroke-width="2"/>
    <rect x="310" y="172" width="220" height="26" rx="8" fill="${C.accent}" opacity="0.85"/>
    <rect x="310" y="210" width="96" height="20" rx="7" fill="${C.twilight}" opacity="0.75"/>
    <rect x="310" y="242" width="220" height="12" rx="6" fill="${C.accentLight}" opacity="0.85"/>
    <rect x="310" y="264" width="180" height="12" rx="6" fill="${C.accentLight}" opacity="0.70"/>
    <rect x="310" y="286" width="204" height="12" rx="6" fill="${C.accentLight}" opacity="0.55"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 232 372 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="660" cy="372" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">HTML</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">结构与语义</text>`,
  },

  "css-basics": {
    title: "CSS",
    subtitle: "盒模型与布局",
    body: `
  ${base(`
    <ellipse cx="130" cy="420" rx="200" ry="150" fill="${C.sakura}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="110" rx="190" ry="140" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="770" cy="470" rx="170" ry="130" fill="${C.accent}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 盒模型：margin / border / padding / content 层层内缩 -->
  <g>
    <rect x="296" y="132" width="248" height="188" rx="16" fill="${C.accentLight}" opacity="0.22" stroke="${C.accent}" stroke-width="2" stroke-dasharray="7 7"/>
    <rect x="320" y="156" width="200" height="140" rx="12" fill="${C.twilight}" opacity="0.30" stroke="${C.twilight}" stroke-width="2"/>
    <rect x="344" y="180" width="152" height="92" rx="9" fill="${C.sakura}" opacity="0.38"/>
    <rect x="368" y="204" width="104" height="44" rx="7" fill="#ffffff" opacity="0.90"/>
  </g>
  <!-- 大括号：CSS 的语法符号 -->
  <text x="176" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.accent}" opacity="0.85" text-anchor="middle">{</text>
  <text x="664" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.sakura}" opacity="0.85" text-anchor="middle">}</text>
  <!-- 星屑点缀 -->
  <path d="M 232 372 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="660" cy="372" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">CSS</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">盒模型与布局</text>`,
  },

  "js-basics": {
    title: "JavaScript",
    subtitle: "语法 · DOM · BOM",
    body: `
  ${base(`
    <ellipse cx="130" cy="110" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="440" rx="210" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="775" cy="95" rx="165" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 数组/集合：三个元素块 + 文本行 -->
  <g>
    <rect x="292" y="140" width="256" height="180" rx="20" fill="#ffffff" opacity="0.55" stroke="${C.accentLight}" stroke-width="2"/>
    <rect x="322" y="176" width="52" height="52" rx="12" fill="${C.accent}" opacity="0.90"/>
    <rect x="394" y="176" width="52" height="52" rx="12" fill="${C.twilight}" opacity="0.85"/>
    <rect x="466" y="176" width="52" height="52" rx="12" fill="${C.sakura}" opacity="0.85"/>
    <rect x="322" y="248" width="196" height="12" rx="6" fill="${C.accentLight}" opacity="0.85"/>
    <rect x="322" y="272" width="140" height="12" rx="6" fill="${C.accentLight}" opacity="0.65"/>
  </g>
  <!-- 中括号：数组与取值的语法符号 -->
  <text x="176" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.accent}" opacity="0.85" text-anchor="middle">[</text>
  <text x="664" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.sakura}" opacity="0.85" text-anchor="middle">]</text>
  <!-- 星屑点缀 -->
  <path d="M 232 372 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="660" cy="372" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">语法 · DOM · BOM</text>`,
  },

  "js-advance-1": {
    title: "JavaScript",
    subtitle: "进阶 1 · 执行原理与闭包",
    body: `
  ${base(`
    <ellipse cx="130" cy="430" rx="200" ry="150" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="745" cy="120" rx="195" ry="145" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="770" cy="460" rx="165" ry="130" fill="${C.sakura}" opacity="0.20" filter="url(#soft)"/>`)}
  <!-- 调用栈：自下而上堆叠的栈帧 -->
  <g>
    <rect x="308" y="252" width="224" height="44" rx="10" fill="${C.accent}" opacity="0.85"/>
    <rect x="326" y="196" width="188" height="44" rx="10" fill="${C.twilight}" opacity="0.80"/>
    <rect x="344" y="140" width="152" height="44" rx="10" fill="${C.sakura}" opacity="0.80"/>
  </g>
  <!-- 小括号：函数调用的语法符号 -->
  <text x="176" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.accent}" opacity="0.85" text-anchor="middle">(</text>
  <text x="664" y="316" font-family="Arial, sans-serif" font-size="150" font-weight="700" fill="${C.sakura}" opacity="0.85" text-anchor="middle">)</text>
  <!-- 星屑点缀 -->
  <path d="M 240 100 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="640" cy="96" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 1 · 执行原理与闭包</text>`,
  },

  "js-advance-2": {
    title: "JavaScript",
    subtitle: "进阶 2 · 原型与继承",
    body: `
  ${base(`
    <ellipse cx="130" cy="115" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="440" rx="210" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="770" cy="100" rx="170" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 原型链：由大到小的一串节点 -->
  <g>
    <line x1="392" y1="220" x2="470" y2="220" stroke="${C.accentLight}" stroke-width="4"/>
    <line x1="524" y1="220" x2="586" y2="220" stroke="${C.accentLight}" stroke-width="4"/>
    <circle cx="350" cy="220" r="44" fill="${C.accent}" opacity="0.90"/>
    <circle cx="497" cy="220" r="28" fill="${C.twilight}" opacity="0.85"/>
    <circle cx="612" cy="220" r="16" fill="${C.sakura}" opacity="0.85"/>
    <circle cx="350" cy="220" r="16" fill="#ffffff" opacity="0.55"/>
    <circle cx="497" cy="220" r="10" fill="#ffffff" opacity="0.55"/>
    <circle cx="612" cy="220" r="6" fill="#ffffff" opacity="0.60"/>
  </g>
  <!-- 原型链的终点 -->
  <circle cx="668" cy="220" r="5" fill="${C.muted}" opacity="0.7"/>
  <circle cx="694" cy="220" r="3" fill="${C.muted}" opacity="0.5"/>
  <!-- 星屑点缀 -->
  <path d="M 236 348 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="632" cy="352" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 2 · 原型与继承</text>`,
  },

  "js-advance-3": {
    title: "JavaScript",
    subtitle: "进阶 3 · ES6 与新特性",
    body: `
  ${base(`
    <ellipse cx="135" cy="420" rx="200" ry="150" fill="${C.sakura}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="740" cy="120" rx="195" ry="145" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="780" cy="450" rx="165" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 继承：父类在上，子类在下，由箭头连接 -->
  <g>
    <rect x="326" y="126" width="188" height="66" rx="14" fill="${C.accent}" opacity="0.88"/>
    <rect x="348" y="146" width="88" height="12" rx="6" fill="#ffffff" opacity="0.65"/>
    <rect x="348" y="166" width="60" height="10" rx="5" fill="#ffffff" opacity="0.45"/>

    <line x1="420" y1="196" x2="420" y2="238" stroke="${C.accentLight}" stroke-width="4"/>
    <path d="M 410 236 l 10 14 10 -14 z" fill="${C.accentLight}"/>

    <rect x="306" y="252" width="228" height="66" rx="14" fill="${C.twilight}" opacity="0.82"/>
    <rect x="330" y="272" width="44" height="26" rx="8" fill="${C.sakura}" opacity="0.85"/>
    <rect x="384" y="272" width="44" height="26" rx="8" fill="${C.accentLight}" opacity="0.85"/>
    <rect x="438" y="272" width="44" height="26" rx="8" fill="#ffffff" opacity="0.70"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 240 118 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="640" cy="120" r="5" fill="${C.accent}" opacity="0.8"/>
  <circle cx="236" cy="352" r="5" fill="${C.sakura}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 3 · ES6 与新特性</text>`,
  },

  "js-advance-4": {
    title: "JavaScript",
    subtitle: "进阶 4 · Proxy 与 Promise",
    body: `
  ${base(`
    <ellipse cx="130" cy="130" rx="200" ry="150" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="745" cy="430" rx="205" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="775" cy="105" rx="165" ry="130" fill="${C.sakura}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 代理与镜像：左右两块，中间一条虚线 -->
  <g>
    <rect x="252" y="158" width="140" height="132" rx="16" fill="${C.accent}" opacity="0.88"/>
    <rect x="272" y="186" width="72" height="12" rx="6" fill="#ffffff" opacity="0.65"/>
    <rect x="272" y="210" width="96" height="10" rx="5" fill="#ffffff" opacity="0.45"/>
    <rect x="272" y="232" width="52" height="10" rx="5" fill="#ffffff" opacity="0.35"/>

    <line x1="420" y1="126" x2="420" y2="330" stroke="${C.accentLight}" stroke-width="2" stroke-dasharray="7 8" opacity="0.9"/>

    <rect x="448" y="158" width="140" height="132" rx="16" fill="${C.accent}" opacity="0.30" stroke="${C.accentLight}" stroke-width="2"/>
    <rect x="468" y="186" width="72" height="12" rx="6" fill="${C.accent}" opacity="0.45"/>
    <rect x="468" y="210" width="96" height="10" rx="5" fill="${C.accent}" opacity="0.32"/>
    <rect x="468" y="232" width="52" height="10" rx="5" fill="${C.accent}" opacity="0.26"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 236 356 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.sakura}" opacity="0.85"/>
  <circle cx="640" cy="352" r="5" fill="${C.twilight}" opacity="0.8"/>
  <circle cx="240" cy="104" r="4" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 4 · Proxy 与 Promise</text>`,
  },

  "js-advance-5": {
    title: "JavaScript",
    subtitle: "进阶 5 · 异步与事件循环",
    body: `
  ${base(`
    <ellipse cx="130" cy="400" rx="200" ry="150" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="745" cy="120" rx="195" ry="145" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="785" cy="460" rx="160" ry="130" fill="${C.sakura}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 事件循环：一个带箭头的环 -->
  <g>
    <circle cx="420" cy="228" r="98" fill="none" stroke="${C.accentLight}" stroke-width="8" stroke-dasharray="520 100" stroke-linecap="round" transform="rotate(-56 420 228)"/>
    <path d="M 500 130 l 40 -6 -14 38 z" fill="${C.accent}" opacity="0.9"/>
    <rect x="352" y="206" width="44" height="44" rx="11" fill="${C.accent}" opacity="0.88"/>
    <rect x="410" y="206" width="44" height="44" rx="11" fill="${C.twilight}" opacity="0.85"/>
    <rect x="468" y="206" width="44" height="44" rx="11" fill="${C.sakura}" opacity="0.85"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 236 112 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="634" cy="352" r="5" fill="${C.accent}" opacity="0.8"/>
  <circle cx="240" cy="352" r="5" fill="${C.sakura}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 5 · 异步与事件循环</text>`,
  },

  "js-advance-6": {
    title: "JavaScript",
    subtitle: "进阶 6 · 手写题与网络请求",
    body: `
  ${base(`
    <ellipse cx="128" cy="118" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="742" cy="446" rx="205" ry="150" fill="${C.sakura}" opacity="0.22" filter="url(#soft)"/>
    <ellipse cx="782" cy="112" rx="165" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 客户端与服务器之间来回的数据包 -->
  <g>
    <rect x="248" y="186" width="96" height="88" rx="14" fill="${C.accent}" opacity="0.88"/>
    <rect x="270" y="210" width="52" height="10" rx="5" fill="#ffffff" opacity="0.65"/>
    <rect x="270" y="230" width="36" height="10" rx="5" fill="#ffffff" opacity="0.45"/>

    <line x1="352" y1="230" x2="492" y2="230" stroke="${C.accentLight}" stroke-width="4" stroke-dasharray="10 8"/>
    <rect x="372" y="214" width="28" height="28" rx="7" fill="${C.sakura}" opacity="0.85"/>
    <rect x="412" y="214" width="28" height="28" rx="7" fill="${C.twilight}" opacity="0.85"/>
    <rect x="452" y="214" width="28" height="28" rx="7" fill="${C.accentLight}" opacity="0.85"/>

    <rect x="500" y="172" width="112" height="116" rx="16" fill="${C.twilight}" opacity="0.82"/>
    <rect x="524" y="198" width="64" height="12" rx="6" fill="#ffffff" opacity="0.65"/>
    <rect x="524" y="220" width="44" height="10" rx="5" fill="#ffffff" opacity="0.45"/>
    <rect x="524" y="244" width="64" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
  </g>
  <!-- 星屑点缀 -->
  <path d="M 236 348 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="640" cy="352" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="3">JavaScript</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">进阶 6 · 手写题与网络请求</text>`,
  },

  // 文章 slug 是 vue-basics，但 images/posts/vue-basics.webp 曾被 CDN 缓存过 404，
  // 因此线上文件名带 -cover 后缀（换 key 即可绕过负缓存）
  "vue-basics-cover": {
    title: "Vue",
    subtitle: "组件 · 路由 · 状态管理",
    body: `
  ${base(`
    <ellipse cx="130" cy="115" rx="200" ry="150" fill="${C.sakura}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="742" cy="440" rx="205" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="780" cy="105" rx="165" ry="130" fill="${C.twilight}" opacity="0.18" filter="url(#soft)"/>`)}
  <!-- 抽象化的 V 形标记 -->
  <g>
    <path d="M 296 132 L 420 356 L 544 132 L 486 132 L 420 254 L 354 132 Z" fill="${C.accent}" opacity="0.88"/>
    <path d="M 354 132 L 420 254 L 486 132 L 452 132 L 420 190 L 388 132 Z" fill="${C.sakura}" opacity="0.85"/>
  </g>
  <!-- 组件小方块 -->
  <rect x="286" y="240" width="34" height="34" rx="9" fill="${C.twilight}" opacity="0.75"/>
  <rect x="520" y="240" width="34" height="34" rx="9" fill="${C.twilight}" opacity="0.75"/>
  <!-- 星屑点缀 -->
  <path d="M 240 366 l 4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill="${C.twilight}" opacity="0.85"/>
  <circle cx="636" cy="368" r="5" fill="${C.accent}" opacity="0.8"/>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="${C.ink}" text-anchor="middle" letter-spacing="4">Vue</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">组件 · 路由 · 状态管理</text>`,
  },
};

async function main() {
  const slugs = process.argv.slice(2);
  const targets = slugs.length > 0 ? slugs : Object.keys(covers);
  const outDir = path.join(ROOT, "assets", "covers");
  await mkdir(outDir, { recursive: true });
  for (const slug of targets) {
    const cover = covers[slug];
    if (!cover) throw new Error(`未知封面主题：${slug}`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_W}" height="${OUT_H}" viewBox="0 0 ${W} ${H}">${cover.body}</svg>`;
    const out = path.join(outDir, `${slug}.webp`);
    await sharp(Buffer.from(svg)).webp({ quality: 82, effort: 4 }).toFile(out);
    const { size } = await stat(out);
    console.log(`✓ assets/covers/${slug}.webp（${Math.round(size / 1024)} KB）`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
