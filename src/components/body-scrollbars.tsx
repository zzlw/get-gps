"use client";

import { OverlayScrollbars } from "overlayscrollbars";
import { useEffect } from "react";

export function BodyScrollbars() {
  useEffect(() => {
    const instance = OverlayScrollbars(document.body, {
      scrollbars: {
        theme: "os-theme-zinc",
        autoHide: "scroll",
      },
    });

    return () => {
      instance.destroy();
    };
  }, []);

  return null;
}
