"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/** 签文库：段位 + 一句话（技术 × 二次元口味） */
const FORTUNES = [
  { level: "大吉", message: "今天适合重构那段你一直不敢碰的代码。" },
  { level: "大吉", message: "灵感指针已对齐——写下的东西都会一次编译通过。" },
  { level: "中吉", message: "平平无奇的一天，适合读一篇收藏夹里吃灰的文章。" },
  { level: "中吉", message: "bug 会主动现形，记得顺手修掉。" },
  { level: "小吉", message: "慎点依赖更新，跑完测试再提交。" },
  { level: "吉", message: "稳定运行。摸鱼也是一种缓存策略。" },
  { level: "末吉", message: "进度 99%——就差一个重启。" },
  { level: "凶", message: "今天别碰生产环境，真的。" },
] as const;

type Phase =
  | { kind: "idle" }
  | { kind: "shuffling" }
  | { kind: "done"; level: string; message: string };

const SHUFFLE_TICKS = 8;
const SHUFFLE_INTERVAL_MS = 80;

/**
 * 「今日运势」抽签（hello-lab 条目的在线 demo）
 *
 * 站内实验页机制的最小可交互示例：验证壳挂载、reduced-motion 降级与结果播报。
 * 逻辑刻意保持纯前端零依赖——替换成自己的小工具时改本文件并在 registry 登记。
 */
export function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [tick, setTick] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  function finish() {
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setPhase({ kind: "done", level: fortune.level, message: fortune.message });
  }

  function draw() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setPhase({ kind: "shuffling" });
    for (let i = 1; i <= SHUFFLE_TICKS; i++) {
      timers.current.push(window.setTimeout(() => setTick((t) => t + 1), i * SHUFFLE_INTERVAL_MS));
    }
    timers.current.push(window.setTimeout(finish, SHUFFLE_TICKS * SHUFFLE_INTERVAL_MS + 60));
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-text-muted text-sm">今天的手气如何？</p>

      {phase.kind === "idle" ? (
        <Button onClick={draw}>抽一签</Button>
      ) : (
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
          <p
            className={`font-display text-4xl font-bold ${
              phase.kind === "shuffling"
                ? "text-text-muted animate-pulse motion-reduce:animate-none"
                : phase.level === "大吉"
                  ? "bg-gradient-to-r from-accent to-twilight bg-clip-text text-transparent"
                  : "text-text"
            }`}
          >
            {phase.kind === "shuffling" ? FORTUNES[tick % FORTUNES.length].level : phase.level}
          </p>
          {phase.kind === "done" ? (
            <>
              <p className="text-text-muted text-sm leading-relaxed">{phase.message}</p>
              <Button variant="ghost" onClick={draw}>
                再抽一次
              </Button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
