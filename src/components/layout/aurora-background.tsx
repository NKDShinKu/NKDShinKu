/**
 * 极光光斑背景（与 design-system-preview 同源）：blur 120px、低透明度（亮 0.22 / 暗 0.16）、
 * 有机 blob 形状静态化（不规则 border-radius），动画仅 transform 位移 + 旋转（§1.7 GPU 合成，避免
 * border-radius 逐帧重绘），三个光斑不同时长错峰。
 * 装饰元素 aria-hidden，prefers-reduced-motion 下静止。
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-accent animate-blob absolute top-[-200px] left-[-150px] size-[600px] opacity-[0.22] blur-[120px] [border-radius:40%_60%_60%_40%_/_60%_30%_70%_40%] motion-reduce:animate-none dark:opacity-[0.16]" />
      <div className="bg-sakura animate-blob absolute top-[40%] right-[-200px] size-[500px] opacity-[0.22] blur-[120px] [animation-delay:-4s] [animation-duration:14s] [border-radius:60%_40%_40%_60%_/_40%_60%_40%_60%] motion-reduce:animate-none dark:opacity-[0.16]" />
      <div className="bg-twilight animate-blob absolute bottom-[-150px] left-[30%] size-[400px] opacity-[0.22] blur-[120px] [animation-delay:-8s] [animation-duration:10s] [border-radius:55%_45%_50%_50%_/_50%_55%_45%_50%] motion-reduce:animate-none dark:opacity-[0.16]" />
    </div>
  );
}
