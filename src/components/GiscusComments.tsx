"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { isGiscusConfigured, siteConfig } from "@/lib/site";

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!isGiscusConfigured() || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.setAttribute("data-repo", siteConfig.giscus.repo);
    script.setAttribute("data-repo-id", siteConfig.giscus.repoId);
    script.setAttribute("data-category", siteConfig.giscus.category);
    script.setAttribute("data-category-id", siteConfig.giscus.categoryId);
    script.setAttribute("data-mapping", siteConfig.giscus.mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", siteConfig.giscus.reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [resolvedTheme]);

  if (!isGiscusConfigured()) {
    return (
      <div className="hermes-card p-6 text-center text-[0.75rem] text-[var(--hermes-muted)]">
        配置 Giscus 后开启评论。
        <a
          href="https://giscus.app/zh-CN"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-[var(--hermes-blue)] hover:underline"
        >
          前往设置
        </a>
      </div>
    );
  }

  return <div ref={containerRef} className="hermes-card p-4" />;
}