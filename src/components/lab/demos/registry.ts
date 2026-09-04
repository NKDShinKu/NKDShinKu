import type { ComponentType } from "react";
import { FortuneDraw } from "@/components/lab/demos/fortune-draw";

/**
 * 站内 demo 注册表：slug → demo 组件
 *
 * 新增站内条目：content/lab.ts 登记（kind: "internal" + description）
 * → src/components/lab/demos/ 建组件 → 此处登记。
 * 未登记的站内条目页不渲染 demo 区（说明区照常）。
 */
export const LAB_DEMOS: Record<string, ComponentType> = {
  "hello-lab": FortuneDraw,
};
