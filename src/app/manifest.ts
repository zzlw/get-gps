import type { MetadataRoute } from "next";
import messages from "../../messages/zh.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: messages.Metadata.applicationName,
    short_name: "GPS",
    description: messages.Metadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "zh-Hans",
    dir: "ltr",
  };
}
