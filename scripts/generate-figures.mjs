/**
 * 文章示意图生成（内容配图用）
 *
 * 用法：`pnpm figures <名称> [选项]`
 *   名称对应 `scripts/figures/<名称>.mjs`，该模块 default 导出：
 *
 *   export default {
 *     width: 960, height: 480,        // 设计尺寸（CSS 像素）
 *     background: theme.bg,           // 底色，用于空白校验
 *     duration: 900,                  // 动画每帧时长（毫秒），静态图忽略
 *     frames: [svg, svg, ...]         // 或 render(i) 返回第 i 帧的 SVG 字符串
 *   }
 *
 * 选项：
 *   --format webp|gif|png  多帧默认 webp（动画 WebP），单帧默认 png
 *   --scale 2              输出倍率（默认 2，高分屏）
 *   --out <dir>            输出目录（默认 assets/figures）
 *
 * 约定（content/WRITING.md §6）：示意图一律代码生成——参数化写出每一帧 SVG，
 * 再合成静态图或动画。校验：尺寸一致、画面非空白、多帧之间确有差异。
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = process.cwd();

/** 站点设计 token（globals.css 亮色态），示意图配色统一从这里取 */
export const theme = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  border: "#d7dee8",
  ink: "#2b3a55",
  muted: "#5a6b85",
  accent: "#5b8fd4",
  accentLight: "#8fb8e8",
  sakura: "#f0a0b8",
  twilight: "#9b8ec4",
  success: "#3f6f24",
  successBg: "#e9f1e5",
};

const FORMATS = new Set(["webp", "gif", "png"]);
const VALUE_OPTIONS = new Set(["format", "scale", "out"]);

function parseArgs(argv) {
  const rest = [];
  const options = { format: null, scale: 2, out: path.join(ROOT, "assets", "figures") };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      rest.push(arg);
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=");
    if (!VALUE_OPTIONS.has(key)) throw new Error(`未知选项：--${key}`);
    const value = inlineValue ?? argv[++i];
    if (value === undefined) throw new Error(`--${key} 需要一个值`);

    if (key === "format") {
      if (!FORMATS.has(value)) throw new Error(`未知格式：${value}`);
      options.format = value;
    } else if (key === "scale") {
      options.scale = Number(value);
      if (!(options.scale > 0)) throw new Error(`scale 需大于 0：${value}`);
    } else {
      options.out = path.resolve(value);
    }
  }

  if (rest.length !== 1) {
    throw new Error("用法：pnpm figures <名称> [--format webp|gif|png] [--scale 2] [--out 目录]");
  }
  return { name: rest[0], options };
}

/** 把 SVG 渲染成指定尺寸的 RGBA 原始像素 */
async function renderFrame(svg, width, height, scale) {
  const buffer = await sharp(Buffer.from(svg), { density: 72 * scale })
    .resize(width * scale, height * scale, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  return buffer;
}

/** 与底色不同的像素占比，用来判断画面是不是空白 */
function inkRatio(buffer, background, channels = 4) {
  const target = hexToRgb(background);
  let ink = 0;
  const pixels = buffer.length / channels;
  for (let i = 0; i < buffer.length; i += channels) {
    if (
      Math.abs(buffer[i] - target[0]) > 8 ||
      Math.abs(buffer[i + 1] - target[1]) > 8 ||
      Math.abs(buffer[i + 2] - target[2]) > 8
    ) {
      ink++;
    }
  }
  return ink / pixels;
}

/** 两帧之间的平均像素差，用来判断动画是不是真的在动 */
function frameDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

async function main() {
  const { name, options } = parseArgs(process.argv.slice(2));
  const specPath = path.join(ROOT, "scripts", "figures", `${name}.mjs`);
  const mod = await import(pathToFileURL(specPath).href);
  const spec = mod.default;
  if (!spec) throw new Error(`${specPath} 需要 default 导出`);

  const { width, height, background = theme.bg, duration = 900 } = spec;
  if (!width || !height) throw new Error("规格里需要 width / height");

  const frames =
    spec.frames ?? Array.from({ length: spec.frameCount ?? 1 }, (_, i) => spec.render(i));
  if (frames.length === 0 || frames.some((f) => typeof f !== "string")) {
    throw new Error("frames / render 需要产出 SVG 字符串");
  }

  const format = options.format ?? (frames.length > 1 ? "webp" : "png");
  const scale = options.scale;
  const rendered = [];
  for (const svg of frames) {
    rendered.push(await renderFrame(svg, width, height, scale));
  }

  const warnings = [];
  const ratios = rendered.map((buf) => inkRatio(buf, background));
  if (ratios.some((r) => r < 0.005)) {
    warnings.push(`第 ${ratios.findIndex((r) => r < 0.005) + 1} 帧几乎空白，检查 SVG 是否正确渲染`);
  }
  if (frames.length > 1) {
    const diffs = rendered.slice(1).map((buf, i) => frameDiff(rendered[i], buf));
    if (diffs.some((d) => d < 0.5)) {
      warnings.push(`第 ${diffs.findIndex((d) => d < 0.5) + 2} 帧与前帧差异过小，动画可能看不出来`);
    }
  }

  await mkdir(options.out, { recursive: true });
  const target = path.join(options.out, `${name}.${format}`);
  const outWidth = width * scale;
  const outHeight = height * scale;

  let pipeline;
  if (frames.length === 1) {
    pipeline = sharp(rendered[0], { raw: { width: outWidth, height: outHeight, channels: 4 } });
  } else {
    pipeline = sharp(Buffer.concat(rendered), {
      raw: {
        width: outWidth,
        height: outHeight * frames.length,
        channels: 4,
        pageHeight: outHeight,
      },
      animated: true,
    });
  }

  if (format === "webp") {
    pipeline = pipeline.webp({
      quality: 90,
      effort: 5,
      loop: 0,
      ...(frames.length > 1 ? { delay: frames.map(() => duration) } : {}),
    });
  } else if (format === "gif") {
    pipeline = pipeline.gif({ delay: duration, loop: 0 });
    warnings.push("GIF 只有 256 色，非必要优先用 WebP");
  } else pipeline = pipeline.png({ compressionLevel: 9 });

  const buffer = await pipeline.toBuffer();
  await writeFile(target, buffer);

  const meta = await sharp(buffer, { animated: true }).metadata();
  const size = (await stat(target)).size;
  console.log(
    `✓ ${path.relative(ROOT, target)}  ${outWidth}x${outHeight}` +
      `${meta.pages && meta.pages > 1 ? ` ${meta.pages} 帧` : ""}  ${(size / 1024).toFixed(1)}KB`,
  );
  warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
