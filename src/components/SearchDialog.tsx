"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface SearchDialogProps {
  posts: PostMeta[];
  variant?: "sidebar" | "default";
}

export function SearchDialog({ posts, variant = "default" }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      )
    : [];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const triggerClass =
    variant === "sidebar"
      ? "flex w-full items-center gap-2 rounded-md border border-[var(--hermes-border)] bg-[var(--hermes-card)] px-2.5 py-1.5 text-[0.75rem] text-[var(--hermes-muted)] transition-colors hover:bg-[var(--hermes-hover)]"
      : "hermes-btn";

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={triggerClass} aria-label="搜索">
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.5 10h-.79l-.28-.27A3.5 3.5 0 1010 11.5c.24 0 .47-.03.69-.08l.27.28v.79l3 3 1.5-1.5-3-3zm-2 0a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
        <span className="flex-1 text-left">搜索文章…</span>
        <kbd className="text-[0.625rem] opacity-50">Ctrl K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={() => setOpen(false)}
      />
      <div className="relative mx-4 w-full max-w-lg hermes-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--hermes-border)] px-3">
          <svg className="h-4 w-4 text-[var(--hermes-muted)]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.5 10h-.79l-.28-.27A3.5 3.5 0 1010 11.5c.24 0 .47-.03.69-.08l.27.28v.79l3 3 1.5-1.5-3-3zm-2 0a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、摘要或标签"
            className="w-full bg-transparent py-3 text-[0.8125rem] outline-none placeholder:text-[var(--hermes-muted)]"
            style={{ color: "var(--hermes-fg)" }}
          />
          <button
            onClick={() => setOpen(false)}
            className="text-[0.6875rem] text-[var(--hermes-muted)] hover:text-[var(--hermes-fg)]"
          >
            ESC
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {query.trim() === "" ? (
            <p className="px-4 py-8 text-center text-[0.75rem] text-[var(--hermes-muted)]">
              输入关键词开始搜索
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-[0.75rem] text-[var(--hermes-muted)]">
              未找到匹配文章
            </p>
          ) : (
            filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={() => setOpen(false)}
                className="block border-b border-[var(--hermes-border)] px-4 py-3 transition-colors hover:bg-[var(--hermes-hover)]"
              >
                <p className="text-[0.8125rem] font-medium">{post.title}</p>
                <p className="mt-0.5 truncate text-[0.6875rem] text-[var(--hermes-muted)]">
                  {post.excerpt}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}