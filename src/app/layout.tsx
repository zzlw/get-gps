import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BodyScrollbars } from "@/components/body-scrollbars";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPS 经纬度",
  description: "在带有 GPS 的设备上读取当前纬度和经度。没有 GPS 时无法获取。",
  applicationName: "GPS 经纬度",
  appleWebApp: {
    capable: true,
    title: "GPS 经纬度",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2030" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <BodyScrollbars />
          {children}
        </Providers>
      </body>
    </html>
  );
}
