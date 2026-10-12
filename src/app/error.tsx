"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="font-semibold text-xl">页面出错了</h1>
      <p className="text-muted-foreground text-sm">可以重试一次。</p>
      <Button className="min-h-11 w-fit" onClick={reset}>
        重试
      </Button>
    </main>
  );
}
