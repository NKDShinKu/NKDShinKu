/**
 * 主题（REQ-G2）：class 策略挂 <html>，手动偏好存 localStorage。
 * 静态导出无运行时，主题初始化以内联脚本在首屏渲染前执行（见 layout.tsx），避免亮暗闪烁。
 */
export const themeStorageKey = "theme";

export type ThemeChoice = "system" | "light" | "dark";

export const themeInitScript = `(function(){try{var s=localStorage.getItem("${themeStorageKey}"),d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches),r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;
