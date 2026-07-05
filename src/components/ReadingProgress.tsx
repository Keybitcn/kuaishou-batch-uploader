"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="reading-progress fixed top-0 left-[14.8125rem] right-0 z-50 h-0.5 max-md:left-0"
      style={{ background: "var(--hermes-border)" }}
    >
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--hermes-blue), var(--hermes-blue-glow))",
          boxShadow: "0 0 8px color-mix(in srgb, var(--hermes-blue) 50%, transparent)",
        }}
      />
    </div>
  );
}