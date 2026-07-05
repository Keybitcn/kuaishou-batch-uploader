"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="inline-block h-4 w-4" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="label-caps text-muted transition-colors hover:text-primary"
      aria-label={isDark ? "浅色" : "深色"}
    >
      {isDark ? "浅色" : "深色"}
    </button>
  );
}