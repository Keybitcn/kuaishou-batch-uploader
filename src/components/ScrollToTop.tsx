"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="label-caps fixed bottom-10 right-10 z-40 border border-default bg-background px-4 py-3 text-muted transition-colors hover:border-primary hover:text-primary"
      aria-label="回到顶部"
    >
      顶部
    </button>
  );
}