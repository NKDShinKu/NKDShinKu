/**
 * 示例示意图：@theme 里声明一个 token，同时得到三样东西（静态图）
 *
 * 生成：`pnpm figures theme-tokens`
 */
import { theme } from "../generate-figures.mjs";

const W = 960;
const H = 420;

const outputs = [
  { title: "工具类", code: "bg-accent  text-accent" },
  { title: "CSS 变量", code: "var(--color-accent)" },
  { title: "透明度修饰符", code: "bg-accent/10" },
];

const cardX = 470;
const cardW = 430;
const cardH = 76;
const cardGap = 26;
const firstY = (H - (outputs.length * cardH + (outputs.length - 1) * cardGap)) / 2 + 10;

const cards = outputs
  .map((item, index) => {
    const y = firstY + index * (cardH + cardGap);
    return `
  <g>
    <rect x="${cardX}" y="${y}" width="${cardW}" height="${cardH}" rx="14"
          fill="${theme.surface}" stroke="${theme.border}" stroke-width="2" />
    <text x="${cardX + 26}" y="${y + 34}" font-family="'PingFang SC','Microsoft YaHei',sans-serif"
          font-size="22" font-weight="600" fill="${theme.ink}">${item.title}</text>
    <text x="${cardX + 26}" y="${y + 61}" font-family="'JetBrains Mono',Consolas,monospace"
          font-size="18" fill="${theme.muted}">${item.code}</text>
    <path d="M 296 ${H / 2} H ${cardX - 24} V ${y + cardH / 2} H ${cardX - 6}"
          fill="none" stroke="${theme.accentLight}" stroke-width="3" />
  </g>`;
  })
  .join("");

const spec = {
  width: W,
  height: H,
  background: theme.bg,
  frames: [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${theme.bg}" />
  <text x="${W / 2}" y="52" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif"
        font-size="28" font-weight="700" fill="${theme.ink}">一个 token，三样产物</text>

  <rect x="96" y="${H / 2 - 74}" width="200" height="148" rx="16"
        fill="${theme.accent}" opacity="0.92" />
  <text x="196" y="${H / 2 - 26}" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace"
        font-size="24" font-weight="700" fill="#ffffff">@theme</text>
  <text x="196" y="${H / 2 + 8}" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace"
        font-size="17" fill="#ffffff" opacity="0.9">--color-accent</text>
  <text x="196" y="${H / 2 + 34}" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace"
        font-size="17" fill="#ffffff" opacity="0.9">#5b8fd4</text>
  ${cards}
</svg>`,
  ],
};

export default spec;
