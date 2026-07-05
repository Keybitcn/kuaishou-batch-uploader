"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[var(--hermes-muted)] hover:text-[var(--hermes-blue)] transition-colors"
    >
      {copied ? "已复制" : "复制链接"}
    </button>
  );
}