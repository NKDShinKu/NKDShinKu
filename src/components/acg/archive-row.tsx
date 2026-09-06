/* eslint-disable @next/next/no-img-element -- 封面恒为 Bangumi 远程 URL：next/image 全局 unoptimized
   下与原生 img 无差别，显式宽高 + lazy 已满足 REQ-G8（AGENTS §2 远程图约定） */
import { Reveal } from "@/components/motion/reveal";
import type { AcgCollectionItem } from "@/lib/acg";

type ArchiveRowProps = {
  item: AcgCollectionItem;
  /** 在看分组：数据面板显示观看进度 */
  showProgress?: boolean;
};

/** 放送日期展示：2006-04-02 → 2006.4（编辑档案式短格式） */
function formatAirDate(date: string): string {
  const m = date.match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}.${Number(m[2])}` : date;
}

/**
 * 归档行卡（acg.md §2.6，编辑档案式）：竖封面 + 信息区 + 数据面板
 * 整卡 stretched-link 跳 bgm.tv 条目页（新窗口）；卡内无其他链接，无嵌套问题
 */
export function ArchiveRow({ item, showProgress = false }: ArchiveRowProps) {
  const name = item.subject.nameCn || item.subject.name;
  const original = item.subject.nameCn ? item.subject.name : "";
  const { rank, score, eps } = item.subject;

  return (
    <Reveal subtle>
      <article className="group border-border bg-surface hover:shadow-lg relative overflow-hidden rounded-md border transition-[translate,box-shadow] duration-200 ease-base hover:-translate-y-[3px]">
        {/* stretched-link：整卡可点，跳 Bangumi 条目页 */}
        <a
          href={`https://bgm.tv/subject/${item.subject.id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`《${name}》在 Bangumi 查看（新窗口）`}
          className="focus-visible:outline-accent absolute inset-0 z-10 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
        />

        <div className="flex">
          <div className="border-border bg-surface relative w-32 shrink-0 overflow-hidden rounded-l-md sm:w-36 md:w-40">
            <img
              src={item.subject.cover}
              alt={`${name} 封面`}
              width={300}
              height={450}
              loading="lazy"
              className="ease-base h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            {/* 封面浮动信息（仅移动端 sm:hidden）：桌面数据在右侧面板，避免重复 */}
            <div className="sm:hidden">
              {rank > 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  Rank {rank}
                </span>
              ) : null}
              {score > 0 ? (
                <span className="bg-accent absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  ★ {score.toFixed(1)}
                </span>
              ) : null}
              {item.rate > 0 || showProgress ? (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1 pt-4 text-[10px] text-white">
                  <span className="inline-flex items-center gap-0.5">
                    {item.rate > 0 ? (
                      <>
                        <span className="text-accent-light">★</span>
                        {item.rate}
                      </>
                    ) : null}
                  </span>
                  {showProgress ? (
                    <span className="font-mono">
                      {item.epStatus}/{eps || "?"}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 flex-1 p-4 md:p-5">
            {/* 标题：两行截断 + 固定高度（行卡等高协同，用户决策）；全名经 title 提示与 Bangumi 兜底 */}
            <h3
              className="text-text line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug"
              title={name}
            >
              {name}
            </h3>
            {/* 原名：恒渲染（暮紫与简介灰区分，用户决策），无则占位 */}
            <p
              className="text-twilight-dark dark:text-twilight mt-0.5 min-h-5 truncate text-xs"
              title={original || undefined}
            >
              {original}
            </p>
            {/* 简介 + 短评共享定高 3 行区：无短评 → 简介×3；有短评 → 简介×1 + 短评×2（行卡等高） */}
            <div className="text-text-muted mt-2 h-[4.3rem] overflow-hidden text-sm leading-relaxed">
              {item.comment ? (
                <>
                  <p className="line-clamp-1">{item.subject.summary}</p>
                  <p className="border-sakura mt-1 line-clamp-2 border-l-2 pl-3">
                    {item.comment}
                  </p>
                </>
              ) : (
                <p className="line-clamp-3">{item.subject.summary}</p>
              )}
            </div>
            {/* 标签：恒渲染（无则空行占位） */}
            <p className="text-text-muted mt-3 min-h-5 truncate text-xs">
              {item.subject.tags.length > 0 ? `${item.subject.tags.join(" / ")} /` : ""}
            </p>
          </div>

          {/* 数据面板（编辑档案式）：我的评分 + 元信息 */}
          <div className="border-border/60 bg-bg/60 hidden w-28 shrink-0 flex-col border-l p-4 text-right sm:flex">
            <p className="text-text-muted text-xs">我的评分</p>
            <p className="text-accent-dark dark:text-accent mt-1 font-mono text-2xl font-bold">
              {item.rate > 0 ? item.rate : "—"}
            </p>
            <span className="bg-accent/25 mx-auto mt-2 block h-1 w-8 rounded-full" aria-hidden />
            <dl className="text-text-muted mt-auto space-y-2 pt-4 text-xs">
              <div>
                <dt className="sr-only">Bangumi 评分</dt>
                <dd className="text-text font-mono">{score > 0 ? `★ ${score.toFixed(1)}` : "—"}</dd>
              </div>
              {rank > 0 ? (
                <div>
                  <dt className="sr-only">排名</dt>
                  <dd className="font-mono">Rank {rank}</dd>
                </div>
              ) : null}
              {item.subject.date ? (
                <div>
                  <dt className="sr-only">放送日期</dt>
                  <dd className="font-mono">{formatAirDate(item.subject.date)}</dd>
                </div>
              ) : null}
              {showProgress ? (
                <div>
                  <dt className="sr-only">观看进度</dt>
                  <dd className="font-mono">
                    {item.epStatus}/{eps || "?"}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
