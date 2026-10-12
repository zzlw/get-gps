import { Compass } from "lucide-react";
import { GpsPanel } from "@/components/gps-panel";

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="survey-grid pointer-events-none absolute inset-0"
        aria-hidden
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-20 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring"
      >
        跳到主内容
      </a>
      <header className="sticky top-0 z-10 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))]">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Compass className="size-4" aria-hidden />
            </span>
            <p className="font-medium tracking-wide">测站</p>
          </div>
          <p className="text-muted-foreground text-xs">本机 GPS · 不上传</p>
        </div>
      </header>
      <main
        id="main"
        className="relative mx-auto grid w-full max-w-5xl flex-1 items-start gap-8 px-[max(1rem,env(safe-area-inset-left))] py-8 pe-[max(1rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-14"
      >
        <div className="flex flex-col gap-4 lg:pt-6">
          <p className="font-medium text-primary text-xs tracking-[0.18em]">
            FIELD FIX
          </p>
          <h1 className="text-balance font-semibold text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
            读取当前经纬度
          </h1>
          <p className="max-w-prose text-muted-foreground text-sm leading-7">
            只认高精度卫星定位。精度要在 50 米以内，网络估算和没有 GPS
            的设备都不会给出坐标。
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              点击后由浏览器询问定位权限
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-foreground" />
              室外空旷处更容易锁住卫星
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
              坐标留在这台设备上，可以复制
            </li>
          </ul>
        </div>
        <GpsPanel />
      </main>
      <footer className="relative mt-auto border-t bg-background/80">
        <p className="mx-auto w-full max-w-5xl px-[max(1rem,env(safe-area-inset-left))] py-4 pe-[max(1rem,env(safe-area-inset-right))] text-muted-foreground text-xs">
          需要系统定位权限。室内或高楼之间可能暂时锁不住卫星。
        </p>
      </footer>
    </div>
  );
}
