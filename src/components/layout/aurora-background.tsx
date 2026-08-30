/**
 * 极光光斑背景（与 design-system-preview 同源）：blur 120px、低透明度（亮 0.22 / 暗 0.16）、
 * border-radius 形变 + 位移 + 旋转的有机 blob，三个光斑不同时长错峰。
 * 装饰元素 aria-hidden，prefers-reduced-motion 下静止。
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-accent animate-blob absolute top-[-200px] left-[-150px] size-[600px] rounded-full opacity-[0.22] blur-[120px] motion-reduce:animate-none dark:opacity-[0.16]" />
      <div className="bg-sakura animate-blob absolute top-[40%] right-[-200px] size-[500px] rounded-full opacity-[0.22] blur-[120px] [animation-delay:-4s] [animation-duration:14s] motion-reduce:animate-none dark:opacity-[0.16]" />
      <div className="bg-twilight animate-blob absolute bottom-[-150px] left-[30%] size-[400px] rounded-full opacity-[0.22] blur-[120px] [animation-delay:-8s] [animation-duration:10s] motion-reduce:animate-none dark:opacity-[0.16]" />
    </div>
  );
}
