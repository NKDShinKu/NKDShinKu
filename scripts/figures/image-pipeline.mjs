/**
 * 示意图：配图的两个环节——源文件与发行文件（静态图）
 *
 * 生成：`pnpm figures image-pipeline`
 */
import { theme } from "../generate-figures.mjs";

const W = 960;
const H = 440;

const font = "'PingFang SC','Microsoft YaHei',sans-serif";
const mono = "'JetBrains Mono',Consolas,monospace";

function box({ x, y, w, h, fill, stroke, title, note, titleColor, noteColor, code }) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2" />
    <text x="${x + w / 2}" y="${y + 44}" text-anchor="middle" font-family="${font}"
          font-size="22" font-weight="700" fill="${titleColor}">${title}</text>
    <text x="${x + w / 2}" y="${y + 74}" text-anchor="middle" font-family="${code ? mono : font}"
          font-size="16" fill="${noteColor}">${note}</text>
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.accentLight}" />
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${theme.bg}" />
  <text x="${W / 2}" y="62" text-anchor="middle" font-family="${font}" font-size="28" font-weight="700"
        fill="${theme.ink}">源文件负责能改，发行文件负责够小</text>

  ${box({
    x: 110,
    y: 110,
    w: 300,
    h: 96,
    fill: theme.surface,
    stroke: theme.twilight,
    title: "源文件",
    note: "SVG · 由生成模块产出",
    titleColor: theme.ink,
    noteColor: theme.muted,
  })}
  <path d="M 260 208 V 282" stroke="${theme.accentLight}" stroke-width="3" marker-end="url(#arrow)" />
  <text x="276" y="252" font-family="${font}" font-size="17" fill="${theme.muted}">渲染 + 压缩</text>

  ${box({
    x: 110,
    y: 292,
    w: 300,
    h: 96,
    fill: theme.accent,
    stroke: theme.accent,
    title: "发行文件",
    note: "WebP · 静态 / 动画",
    titleColor: "#ffffff",
    noteColor: "#ffffff",
    code: true,
  })}

  <path d="M 412 340 H 486" stroke="${theme.accentLight}" stroke-width="3" marker-end="url(#arrow)" />
  ${box({
    x: 490,
    y: 292,
    w: 176,
    h: 96,
    fill: theme.surface,
    stroke: theme.border,
    title: "R2 图床",
    note: "images/posts/",
    titleColor: theme.ink,
    noteColor: theme.muted,
    code: true,
  })}
  <path d="M 668 340 H 726" stroke="${theme.accentLight}" stroke-width="3" marker-end="url(#arrow)" />
  ${box({
    x: 730,
    y: 292,
    w: 176,
    h: 96,
    fill: theme.surface,
    stroke: theme.border,
    title: "文章引用",
    note: "绝对 URL + alt",
    titleColor: theme.ink,
    noteColor: theme.muted,
  })}

  <text x="${W / 2}" y="420" text-anchor="middle" font-family="${font}" font-size="17" fill="${theme.muted}">
    源文件留在仓库里（可 diff、可重生成），只有发行文件上传图床
  </text>
</svg>`;

const spec = {
  width: W,
  height: H,
  background: theme.bg,
  frames: [svg],
};

export default spec;
