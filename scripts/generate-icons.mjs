/**
 * 站点图标生成（REQ-F6）—— 从 src/app/icon.svg 派生全平台图标
 *
 * 产物：
 * - src/app/favicon.ico    （16/32/48，浏览器标签页）
 * - src/app/apple-icon.png （180×180，iOS 主屏）
 * - public/icons/icon-192.png / icon-512.png（PWA manifest）
 *
 * 用法：改 icon.svg 后跑 `pnpm generate:icons`（脚本入库，产物随仓库提交，CI 不执行）。
 * sharp 渲染 SVG 时按目标尺寸调整 density，保证放大到 512 仍是矢量级清晰。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const SVG_PATH = path.join(ROOT, "src", "app", "icon.svg");

/** 按目标尺寸渲染 SVG（density 缩放避免位图放大模糊）；icon.svg 画布为 64×64 */
async function renderPng(svg, size) {
  return sharp(svg, { density: (size / 64) * 72 })
    .resize(size, size)
    .png()
    .toBuffer();
}

async function main() {
  const svg = await readFile(SVG_PATH);

  const [png16, png32, png48, png180, png192, png512] = await Promise.all([
    renderPng(svg, 16),
    renderPng(svg, 32),
    renderPng(svg, 48),
    renderPng(svg, 180),
    renderPng(svg, 192),
    renderPng(svg, 512),
  ]);

  await Promise.all([
    writeFile(path.join(ROOT, "src", "app", "favicon.ico"), await pngToIco([png16, png32, png48])),
    writeFile(path.join(ROOT, "src", "app", "apple-icon.png"), png180),
    mkdir(path.join(ROOT, "public", "icons"), { recursive: true }).then(() =>
      Promise.all([
        writeFile(path.join(ROOT, "public", "icons", "icon-192.png"), png192),
        writeFile(path.join(ROOT, "public", "icons", "icon-512.png"), png512),
      ]),
    ),
  ]);

  console.log("✓ favicon.ico / apple-icon.png / icons/icon-192.png / icons/icon-512.png 已生成");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
