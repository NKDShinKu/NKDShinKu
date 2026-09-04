import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/posts/back-button";
import { ExternalLinkButton } from "@/components/lab/external-link-button";
import { LabDemoShell } from "@/components/lab/lab-demo-shell";
import { LabStatusBadge, LabTypeBadge } from "@/components/lab/lab-badges";
import { LAB_DEMOS } from "@/components/lab/demos/registry";
import { renderMarkdown } from "@/lib/markdown";
import { getLabItemBySlug } from "@/lib/lab";
import { LAB_ITEMS } from "@content/lab";

export const dynamicParams = false;

/** 静态路由派生自 content/lab.ts 的站内型条目（slug 恒 ASCII，见 lib 校验） */
export function generateStaticParams() {
  return LAB_ITEMS.filter((item) => item.kind === "internal").map((item) => ({ slug: item.slug }));
}

function getInternalItem(slug: string) {
  const item = getLabItemBySlug(LAB_ITEMS, slug);
  return item && item.kind === "internal" ? item : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = getInternalItem((await params).slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.tagline,
    alternates: { canonical: `/lab/${item.slug}/` },
    openGraph: {
      title: item.name,
      description: item.tagline,
      url: `/lab/${item.slug}/`,
    },
  };
}

/**
 * 站内条目页（/lab/[slug]，design-system/lab.md §2.5）：返回栏 + 元信息 + demo 壳 + 说明区
 * 整页 data-pagefind-ignore：站内实验页不进搜索索引（lab.md L-9，REQ-S2 首期仅文章）
 */
export default async function LabItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getInternalItem((await params).slug);
  if (!item) notFound();

  const Demo = LAB_DEMOS[item.slug];
  const { html } = item.description ? await renderMarkdown(item.description) : { html: "" };

  return (
    <div
      className="mx-auto w-full max-w-[880px] px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24"
      data-pagefind-ignore
    >
      <BackButton fallbackHref="/lab/" />

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <LabTypeBadge type={item.type} />
          <LabStatusBadge status={item.status} />
        </div>
        <h1 className="font-display mt-3 text-3xl leading-tight font-bold [text-wrap:balance] md:text-4xl">
          {item.name}
        </h1>
        <p className="text-text-muted border-sakura mt-4 border-l-2 pl-4 text-lg leading-relaxed">
          {item.tagline}
        </p>
      </header>

      {Demo ? (
        <div className="mt-8">
          <LabDemoShell>
            <Demo />
          </LabDemoShell>
        </div>
      ) : null}

      {html ? (
        <section
          aria-label="条目说明"
          className="post-body mt-10 max-w-[720px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}

      {item.links.length > 0 ? (
        <div className="border-border mt-8 flex items-center gap-2 border-t pt-5">
          <span className="text-text-muted text-sm">相关链接</span>
          <div className="ml-auto flex">
            {item.links.map((link) => (
              <ExternalLinkButton
                key={link.href}
                href={link.href}
                label={`${item.name} ${link.label}`}
                icon="icon-[mdi--open-in-new]"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
