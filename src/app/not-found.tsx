import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="font-semibold text-xl">页面不存在</h1>
      <p className="text-muted-foreground text-sm">这个地址没有对应的页面。</p>
      <a
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "min-h-11 w-fit")}
      >
        返回首页
      </a>
    </main>
  );
}
