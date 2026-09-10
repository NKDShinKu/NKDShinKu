/**
 * 文章封面生成（T7 / D19）—— 代码自绘 840×525（16:10）主题封面
 *
 * 风格：Soft ACG Fusion 与站点同频——亮底极光渐变 + 主题几何母题 + 关键词。
 * 卡片内封面为小尺寸展示（桌面 w-56 / 移动 w-28），构图以「大色块 + 大字」为主，细节克制。
 * 颜色取设计 token（globals.css @theme 亮色态）。
 *
 * 用法：`pnpm generate:covers`（样稿评审通过后批量）；产物 assets/covers/<slug>.png
 * （不进 public/——封面由 R2 图床提供，避免打进 Pages 产物形成重复托管），
 * 经 rclone 上传 R2 后把绝对 URL 填入 frontmatter cover。
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const W = 840;
const H = 525;

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
 * - nextjs-static-export-notes：静态导出——层叠页面方块（out/ 产物感）
 * - tailwind-v4-design-tokens：设计 token——色板色阶
 * - blog-publish-pipeline：发布流水线——节点连线
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

  "nextjs-static-export-notes": {
    title: "Static Export",
    subtitle: "静态导出笔记",
    body: `
  ${base(`
    <ellipse cx="720" cy="100" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="140" cy="440" rx="200" ry="150" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>`)}
  <!-- 层叠页面方块：构建产物 out/ 意象 -->
  <g>
    <rect x="470" y="150" width="150" height="190" rx="14" fill="${C.sakuraLight}" opacity="0.55" transform="rotate(8 545 245)"/>
    <rect x="460" y="140" width="150" height="190" rx="14" fill="${C.accentLight}" opacity="0.6" transform="rotate(-4 535 235)"/>
    <rect x="450" y="130" width="150" height="190" rx="14" fill="${C.accent}"/>
    <g fill="#ffffff" opacity="0.85">
      <rect x="472" y="158" width="70" height="10" rx="5"/>
      <rect x="472" y="180" width="106" height="8" rx="4" opacity="0.7"/>
      <rect x="472" y="196" width="106" height="8" rx="4" opacity="0.7"/>
      <rect x="472" y="212" width="80" height="8" rx="4" opacity="0.7"/>
    </g>
  </g>
  <!-- 虚线箭头：源 → 产物 -->
  <path d="M 190 300 Q 300 240 420 250" stroke="${C.accentDark}" stroke-width="3" stroke-dasharray="8 8" fill="none" opacity="0.7"/>
  <path d="M 420 250 l -14 -8 m 14 8 l -12 10" stroke="${C.accentDark}" stroke-width="3" fill="none" opacity="0.7"/>
  <!-- 源码括号 -->
  <text x="150" y="330" font-family="monospace" font-size="64" fill="${C.twilight}" opacity="0.8" text-anchor="middle">{ }</text>
  <!-- 标题区 -->
  <text x="420" y="430" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="46" font-weight="700" fill="${C.ink}" text-anchor="middle">Static Export</text>
  <text x="420" y="474" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">Next.js 静态导出的五个坑</text>`,
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

  "blog-publish-pipeline": {
    title: "Pipeline",
    subtitle: "发布流水线",
    body: `
  ${base(`
    <ellipse cx="120" cy="110" rx="190" ry="140" fill="${C.twilight}" opacity="0.20" filter="url(#soft)"/>
    <ellipse cx="750" cy="440" rx="200" ry="150" fill="${C.accent}" opacity="0.20" filter="url(#soft)"/>`)}
  <!-- 流水线节点：写文 → 构建 → 索引 → 上线 -->
  <g stroke="${C.accent}" stroke-width="3" fill="none">
    <path d="M 160 220 H 680" stroke-dasharray="10 8" opacity="0.55"/>
  </g>
  <g>
    <circle cx="180" cy="220" r="34" fill="${C.accentLight}" opacity="0.9"/>
    <text x="180" y="228" font-family="'Microsoft YaHei', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">写</text>
    <circle cx="340" cy="220" r="34" fill="${C.accent}" opacity="0.9"/>
    <text x="340" y="228" font-family="'Microsoft YaHei', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">建</text>
    <circle cx="500" cy="220" r="34" fill="${C.twilight}" opacity="0.9"/>
    <text x="500" y="228" font-family="'Microsoft YaHei', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">索</text>
    <circle cx="660" cy="220" r="34" fill="${C.sakura}" opacity="0.9"/>
    <text x="660" y="228" font-family="'Microsoft YaHei', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">上</text>
  </g>
  <!-- 末端箭头 -->
  <path d="M 680 220 l -12 -8 m 12 8 l -12 8" stroke="${C.accent}" stroke-width="3" fill="none"/>
  <!-- 标题区 -->
  <text x="420" y="400" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="46" font-weight="700" fill="${C.ink}" text-anchor="middle">Pipeline</text>
  <text x="420" y="444" font-family="'Microsoft YaHei', sans-serif" font-size="24" fill="${C.muted}" text-anchor="middle">一篇 Markdown 的上线之旅</text>`,
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
};

async function main() {
  const slugs = process.argv.slice(2);
  const targets = slugs.length > 0 ? slugs : Object.keys(covers);
  const outDir = path.join(ROOT, "assets", "covers");
  await mkdir(outDir, { recursive: true });
  for (const slug of targets) {
    const cover = covers[slug];
    if (!cover) throw new Error(`未知封面主题：${slug}`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${cover.body}</svg>`;
    await writeFile(
      path.join(outDir, `${slug}.png`),
      await sharp(Buffer.from(svg)).png().toBuffer(),
    );
    console.log(`✓ assets/covers/${slug}.png`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
