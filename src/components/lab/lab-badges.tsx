import { Tag, type TagVariant } from "@/components/ui/tag";
import { LAB_STATUS_LABELS, LAB_TYPE_LABELS, type LabStatus, type LabType } from "@/lib/lab";

const TYPE_STYLES: Record<LabType, { variant: TagVariant; icon: string }> = {
  project: { variant: "accent", icon: "icon-[mdi--cube-outline]" },
  tool: { variant: "twilight", icon: "icon-[mdi--tools]" },
  experiment: { variant: "sakura", icon: "icon-[mdi--flask-outline]" },
};

/** 类型徽章（lab.md §2.2）：静态展示非交互；sakura/twilight 彩底按纪律配对图标 */
export function LabTypeBadge({ type }: { type: LabType }) {
  const { variant, icon } = TYPE_STYLES[type];
  return (
    <Tag variant={variant} className="gap-1 px-2.5">
      <span className={`${icon} size-3.5`} aria-hidden />
      {LAB_TYPE_LABELS[type]}
    </Tag>
  );
}

const STATUS_STYLES: Record<LabStatus, { icon: string; color: string }> = {
  active: { icon: "icon-[mdi--circle-small]", color: "text-success" },
  completed: { icon: "icon-[mdi--check-circle-outline]", color: "text-success" },
  archived: { icon: "icon-[mdi--archive-outline]", color: "text-text-muted" },
  planned: { icon: "icon-[mdi--lightbulb-outline]", color: "text-warning" },
};

/** 状态指示（lab.md §2.3）：颜色仅点缀，语义由文字承载（非仅颜色纪律） */
export function LabStatusBadge({ status }: { status: LabStatus }) {
  const { icon, color } = STATUS_STYLES[status];
  return (
    <span className="text-text-muted border-border/60 inline-flex items-center gap-1 rounded-full border bg-bg/60 px-2.5 py-1 text-xs">
      <span className={`${icon} ${color} size-3.5`} aria-hidden />
      {LAB_STATUS_LABELS[status]}
    </span>
  );
}
