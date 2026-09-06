/* eslint-disable @next/next/no-img-element -- 封面恒为 Bangumi 远程 URL：next/image 全局 unoptimized
   下与原生 img 无差别，显式宽高 + lazy 已满足 REQ-G8（AGENTS §2 远程图约定） */
import type { AcgCollectionItem } from "@/lib/acg";

type AnimeCoverCardProps = {
  item: AcgCollectionItem;
  /** 在看分组：叠层显示观看进度（已看/总集数） */
  showProgress?: boolean;
};

/**
 * 橱窗封面卡（acg.md §2.1，叠层式·方案1）：信息全部收在图内，标题恒贴底
 *
 * - 左上：Rank 叠标（scrim 白字）；右上：BN 社区评分 pill（accent 底 ★）
 * - 底部渐变层两行：个人评分★N（左）+ 进度（右，仅在看区）→ 中文名恒贴底；
 *   评分行常驻渲染（缺失留白），标题对齐不受有无评分影响（用户决策）
 * - 整卡外链 Bangumi 条目页（新窗口，无确认弹窗——M-5 用户决策）
 * - 叠层白字依赖半透明 scrim 保证可读性（图片底色不可预测，属设计系统禁令的图片叠层例外）
 */
export function AnimeCoverCard({ item, showProgress = false }: AnimeCoverCardProps) {
  const name = item.subject.nameCn || item.subject.name;
  const { rank, score, eps } = item.subject;
  const progress = showProgress
    ? eps > 0
      ? `${item.epStatus}/${eps}`
      : `${item.epStatus} 集`
    : null;

  return (
    <a
      href={`https://bgm.tv/subject/${item.subject.id}`}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      aria-label={`《${name}》在 Bangumi 查看（新窗口）`}
      className="group focus-visible:outline-accent relative w-36 shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 md:w-40"
    >
      <div className="border-border bg-surface relative aspect-[2/3] overflow-hidden rounded-md border">
        <img
          src={item.subject.cover}
          alt={`${name} 封面`}
          width={300}
          height={450}
          loading="lazy"
          className="ease-base h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {rank > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            Rank {rank}
          </span>
        ) : null}

        {/* 右上：BN 社区评分（与个人评分互换位置——用户决策，样式沿用个人评分 pill） */}
        {score > 0 ? (
          <span className="bg-accent absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
            ★ {score.toFixed(1)}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-2.5 pb-2 pt-10">
          {/* 个人评分 + 进度行：常驻渲染（缺失留白），标题恒贴底对齐（用户决策方案 1） */}
          <div className="text-white/85 flex min-h-5 items-center justify-between text-xs">
            <span className="inline-flex items-center gap-0.5">
              {item.rate > 0 ? (
                <>
                  <span className="text-accent-light">★</span>
                  {item.rate}
                </>
              ) : null}
            </span>
            {progress ? <span>进度 {progress}</span> : null}
          </div>
          <p className="truncate text-sm font-medium text-white">{name}</p>
        </div>
      </div>
    </a>
  );
}
