/**
 * OG 社交分享品牌图生成（REQ-G4 / D19）—— 全站共用 1200×630 静态图
 *
 * 风格：Soft ACG Fusion（与站点全局背景同频）——亮底 + 极光渐变光斑 + 点阵 + logo 锁定组合。
 * 颜色取设计 token（globals.css @theme 亮色态）：accent #5b8fd4 / sakura #f0a0b8 / twilight #9b8ec4 / bg #f0f4f8。
 *
 * 用法：`pnpm generate:og`；产物 public/og.png 随仓库提交（CI 不执行，字体依赖本机）。
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const W = 1200;
const H = 630;

/** 点阵 5×5（右上区，与光斑错位营造轻科技氛围） */
const dots = Array.from({ length: 5 }, (_, r) =>
  Array.from({ length: 5 }, (_, c) => `<circle cx="${920 + c * 44}" cy="${110 + r * 44}" r="3"/>`),
)
  .flat()
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf1fa"/>
      <stop offset="1" stop-color="#f0f4f8"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5b8fd4"/>
      <stop offset="0.5" stop-color="#9b8ec4"/>
      <stop offset="1" stop-color="#f0a0b8"/>
    </linearGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="70"/>
    </filter>
    <filter id="soft2" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="50"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 极光光斑（与站点 aurora-background 同构，克制透明度） -->
  <ellipse cx="180" cy="140" rx="260" ry="200" fill="#5b8fd4" opacity="0.22" filter="url(#soft)"/>
  <ellipse cx="1060" cy="520" rx="280" ry="210" fill="#f0a0b8" opacity="0.24" filter="url(#soft)"/>
  <ellipse cx="1080" cy="120" rx="220" ry="170" fill="#9b8ec4" opacity="0.20" filter="url(#soft)"/>
  <ellipse cx="240" cy="560" rx="200" ry="150" fill="#8fb8e8" opacity="0.20" filter="url(#soft2)"/>

  <!-- 点阵 + 星星点缀（ACG 气质，克制使用） -->
  <g fill="#5b8fd4" opacity="0.18">${dots}</g>
  <path d="M 250 300 l 3.5 9.5 9.5 3.5 -9.5 3.5 -3.5 9.5 -3.5 -9.5 -9.5 -3.5 9.5 -3.5 z" fill="#f0a0b8" opacity="0.8"/>
  <path d="M 950 400 l 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#5b8fd4" opacity="0.7"/>
  <circle cx="320" cy="180" r="5" fill="#9b8ec4" opacity="0.6"/>
  <circle cx="880" cy="250" r="4" fill="#f0a0b8" opacity="0.6"/>

  <!-- logo（icon.svg 同款：蓝底圆角 + 白 N） -->
  <rect x="536" y="128" width="128" height="128" rx="28" fill="#5b8fd4"/>
  <text x="600" y="212" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff" text-anchor="middle">N</text>

  <!-- 站名 + tagline + 品牌渐变短线 + 域名 -->
  <text x="600" y="336" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="72" font-weight="700" fill="#2b3a55" text-anchor="middle">NKDShinKu</text>
  <text x="600" y="404" font-family="'Microsoft YaHei', 'PingFang SC', sans-serif" font-size="30" fill="#5a6b85" text-anchor="middle">前端开发者 · ACG爱好者，探索技术与创作的边界</text>
  <rect x="500" y="446" width="200" height="6" rx="3" fill="url(#brand)"/>
  <text x="600" y="540" font-family="Arial, sans-serif" font-size="26" fill="#3a6fb0" text-anchor="middle" letter-spacing="2">nkdshinku.com</text>
</svg>`;

async function main() {
  await writeFile(
    path.join(ROOT, "public", "og.png"),
    await sharp(Buffer.from(svg)).png().toBuffer(),
  );
  console.log("✓ public/og.png 已生成（1200×630）");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
