/**
 * 配图转换与压缩（content 配图用）
 *
 * 用法：`pnpm images <文件...> [选项]`
 *
 * 选项：
 *   --format webp|png|gif|jpg  输出格式（默认 webp）
 *   --quality 90               有损质量 1-100（webp/jpg，默认 90）
 *   --lossless                 无损 WebP：截图首选的"零损失"档，体积通常是原图的 1/3
 *   --scale 0.5                缩放倍率（默认不缩放）
 *   --width 1200               按宽度缩放（与 --scale 二选一）
 *   --bg "#ffffff"             背景色：SVG / 透明图渲染时铺底，示意图建议白底
 *   --out <dir>                输出目录（默认与输入同目录）
 *   --suffix "-opt"            输出文件名后缀（默认 "-opt"）
 *
 * 约定（content/WRITING.md §6）：默认不改变尺寸。让截图文字发虚的主因是缩小尺寸和
 * 反复转码，不是有损压缩——所以脚本只在显式传 --scale/--width 时才缩放，并在缩放后
 * 给出清晰度告警。有损转换会打印 PSNR，供判断质量。
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const FORMATS = new Set(["webp", "png", "gif", "jpg", "jpeg"]);
/** 需要取值的选项；其余（如 --lossless）是布尔开关，不能吞掉后面的参数 */
const VALUE_OPTIONS = new Set(["format", "quality", "scale", "width", "bg", "out", "suffix"]);

function parseArgs(argv) {
  const inputs = [];
  const options = {
    format: "webp",
    quality: 90,
    lossless: false,
    scale: null,
    width: null,
    bg: null,
    out: null,
    suffix: "-opt",
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      inputs.push(arg);
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=");
    if (!VALUE_OPTIONS.has(key) && key !== "lossless") throw new Error(`未知选项：--${key}`);
    if (!VALUE_OPTIONS.has(key) && inlineValue !== undefined) {
      throw new Error(`--${key} 是布尔开关，不接受值`);
    }
    const value = VALUE_OPTIONS.has(key) ? (inlineValue ?? argv[++i]) : undefined;
    if (VALUE_OPTIONS.has(key) && value === undefined) throw new Error(`--${key} 需要一个值`);
    switch (key) {
      case "format":
        if (!FORMATS.has(value)) throw new Error(`未知格式：${value}`);
        options.format = value === "jpeg" ? "jpg" : value;
        break;
      case "quality":
        options.quality = Number(value);
        if (!Number.isFinite(options.quality) || options.quality < 1 || options.quality > 100) {
          throw new Error(`quality 需在 1-100 之间：${value}`);
        }
        break;
      case "lossless":
        options.lossless = true;
        break;
      case "scale":
        options.scale = Number(value);
        if (!(options.scale > 0)) throw new Error(`scale 需大于 0：${value}`);
        break;
      case "width":
        options.width = Number(value);
        if (!(options.width > 0)) throw new Error(`width 需大于 0：${value}`);
        break;
      case "bg":
        options.bg = value;
        break;
      case "out":
        options.out = value;
        break;
      case "suffix":
        options.suffix = value;
        break;
    }
  }

  if (inputs.length === 0) {
    throw new Error(
      "至少要给一个输入文件。例：pnpm images shot.png --lossless\n（选项说明见 scripts/convert-images.mjs 顶部注释）",
    );
  }
  return { inputs, options };
}

/** PSNR：>40dB 基本肉眼无差，35-40dB 通常也看不出；尺寸不同则不算 */
function psnr(a, b) {
  if (a.length !== b.length) return null;
  let se = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    se += d * d;
  }
  const mse = se / a.length;
  return mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
}

async function convert(input, options) {
  // animated: true 会读入全部帧（静态图无影响）——否则动图转 WebP 只会保留第一帧
  const meta = await sharp(input, { animated: true }).metadata();
  const { width: srcWidth, height: srcHeight } = meta;
  if (!srcWidth || !srcHeight) throw new Error(`读不出尺寸：${input}`);

  let pipeline = sharp(input, { animated: true });

  if (options.scale) {
    pipeline = pipeline.resize({ width: Math.round(srcWidth * options.scale) });
  } else if (options.width) {
    pipeline = pipeline.resize({ width: options.width });
  }
  if (options.bg) pipeline = pipeline.flatten({ background: options.bg });

  switch (options.format) {
    case "webp":
      pipeline = pipeline.webp(
        options.lossless ? { lossless: true, effort: 5 } : { quality: options.quality, effort: 5 },
      );
      break;
    case "png":
      pipeline = pipeline.png({ compressionLevel: 9 });
      break;
    case "jpg":
      pipeline = pipeline.jpeg({ quality: options.quality, mozjpeg: true });
      break;
    case "gif":
      pipeline = pipeline.gif();
      break;
  }

  const buffer = await pipeline.toBuffer();

  const dir = options.out ?? path.dirname(input);
  await mkdir(dir, { recursive: true });
  const base = path.basename(input, path.extname(input));
  const ext = options.format === "jpg" ? "jpg" : options.format;
  const target = path.join(dir, `${base}${options.suffix}.${ext}`);
  await writeFile(target, buffer);

  const before = (await stat(input)).size;
  const after = buffer.length;
  const outMeta = await sharp(buffer, { animated: true }).metadata();

  let qualityNote = "无损";
  if (!options.lossless && (options.format === "webp" || options.format === "jpg")) {
    const [a, b] = await Promise.all([
      sharp(input).ensureAlpha().raw().toBuffer(),
      sharp(buffer).ensureAlpha().raw().toBuffer(),
    ]);
    const value = psnr(a, b);
    qualityNote =
      value === null
        ? "已缩放，无法比较"
        : value === Infinity
          ? "无损"
          : `PSNR ${value.toFixed(1)}dB`;
  }

  const scaled = outMeta.width !== srcWidth;
  const warnings = [];
  if (scaled) {
    const ratio = outMeta.width / srcWidth;
    warnings.push(
      `尺寸从 ${srcWidth} 缩到 ${outMeta.width}（${Math.round(ratio * 100)}%）——含文字的截图缩到 70% 以下通常就开始发虚`,
    );
  }
  if (options.format === "gif") {
    warnings.push("GIF 只有 256 色，截图/示意图优先考虑 WebP（动画 WebP 浏览器同样支持）");
  }

  const frames = outMeta.pages ?? 1;
  const outHeight = outMeta.pageHeight ?? outMeta.height;

  return {
    target,
    frames,
    isVector: /\.svg$/i.test(input),
    before,
    after,
    srcWidth,
    srcHeight,
    outWidth: outMeta.width,
    outHeight,
    qualityNote,
    warnings,
  };
}

async function main() {
  const { inputs, options } = parseArgs(process.argv.slice(2));
  let failed = 0;

  for (const input of inputs) {
    try {
      const r = await convert(input, options);
      const before = `${(r.before / 1024).toFixed(1)}KB`;
      const after = `${(r.after / 1024).toFixed(1)}KB`;
      const sizeNote = r.isVector
        ? `${before}（矢量源）→ ${after}`
        : `${before} → ${after}（省 ${Math.round((1 - r.after / r.before) * 100)}%）`;
      console.log(
        `✓ ${path.basename(r.target)}  ${sizeNote}  ${r.outWidth}x${r.outHeight}` +
          `${r.frames > 1 ? ` ${r.frames} 帧` : ""}  ${r.qualityNote}`,
      );
      for (const w of r.warnings) console.warn(`  ⚠ ${w}`);
    } catch (error) {
      failed++;
      console.error(`✗ ${input}：${error.message}`);
    }
  }

  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
