/**
 * 示例示意图：静态博客的发布链路（动画）
 *
 * 演示"参数化生成每一帧 SVG → 合成动画"的写法：
 * 同一个函数按当前高亮的阶段产出第 i 帧，其他元素不变。
 * 生成：`pnpm figures pipeline`
 */
import { theme } from "../generate-figures.mjs";

const W = 960;
const H = 480;

const stages = [
  { label: "内容", note: "Markdown 写进 content/posts/" },
  { label: "构建", note: "pnpm build 渲染成静态 HTML" },
  { label: "产物", note: "out/ 输出，无服务端参与" },
  { label: "集成", note: "GitHub Actions 跑检查与索引" },
  { label: "上线", note: "部署到 GitHub Pages" },
];

const boxWidth = 150;
const boxHeight = 92;
const gap = 30;
const startX = (W - (stages.length * boxWidth + (stages.length - 1) * gap)) / 2;
const boxY = 172;

function frame(active) {
  const boxes = stages
    .map((stage, index) => {
      const x = startX + index * (boxWidth + gap);
      const isActive = index === active;
      const fill = isActive ? theme.accent : theme.surface;
      const stroke = isActive ? theme.accent : theme.border;
      const textColor = isActive ? "#ffffff" : theme.ink;

      const arrow =
        index < stages.length - 1
          ? `<path d="M ${x + boxWidth + 6} ${boxY + boxHeight / 2} h ${gap - 12}"
                 stroke="${index < active ? theme.accentLight : theme.border}" stroke-width="3"
                 marker-end="url(#arrow)" />`
          : "";

      return `
    <g>
      <rect x="${x}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="14"
            fill="${fill}" stroke="${stroke}" stroke-width="2" />
      <text x="${x + boxWidth / 2}" y="${boxY + 56}" text-anchor="middle"
            font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="26"
            font-weight="600" fill="${textColor}">${stage.label}</text>
      ${arrow}
    </g>`;
    })
    .join("");

  const dots = stages
    .map((_, index) => {
      const cx = W / 2 + (index - (stages.length - 1) / 2) * 24;
      return `<circle cx="${cx}" cy="392" r="6" fill="${index === active ? theme.accent : theme.border}" />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.border}" />
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${theme.bg}" />
  <text x="${W / 2}" y="86" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif"
        font-size="28" font-weight="700" fill="${theme.ink}">静态博客的发布链路</text>
  ${boxes}
  <text x="${W / 2}" y="330" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif"
        font-size="22" fill="${theme.muted}">${stages[active].note}</text>
  ${dots}
</svg>`;
}

const spec = {
  width: W,
  height: H,
  background: theme.bg,
  duration: 900,
  frames: stages.map((_, index) => frame(index)),
};

export default spec;
