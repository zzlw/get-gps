import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GPS 经纬度",
    short_name: "GPS",
    description: "在带有 GPS 的设备上读取当前纬度和经度。",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "zh-CN",
  };
}
