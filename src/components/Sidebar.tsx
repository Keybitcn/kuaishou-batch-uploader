"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/SearchDialog";
import { siteConfig } from "@/lib/site";
import type { PostMeta } from "@/lib/types";

const icons = {
  home: (
    <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5L1 7v7.5h4.5V10h5v4.5H15V7L8 1.5z" />
    </svg>
  ),
  blog: (
    <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm1 2v8h8V4H4zm1 1h6v1H5V5zm0 2h4v1H5V7z" />
    </svg>
  ),
  tags: (
    <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 3h5l1.5 1.5L10 3h4v4l-1.5 1.5L14 10l-1.5 1.5L12 13H8L6.5 11.5 5 13H2V3zm2 2v6h.5l1.5-1.5L7.5 11H9l1-1V5H4z" />
    </svg>
  ),
  about: (
    <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1 1 0 110 2 1 1 0 010-2zm-1 3h2v5H7V7z" />
    </svg>
  ),
};

const navIcons: Record<string, React.ReactNode> = {
  "/": icons.home,
  "/blog": icons.blog,
  "/tags": icons.tags,
  "/about": icons.about,
};

interface SidebarProps {
  posts: PostMeta[];
}

export function Sidebar({ posts }: SidebarProps) {
  const pathname = usePathname();
  const recentPosts = posts.slice(0, 5);

  return (
    <aside className="hermes-sidebar">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--hermes-border)]">
        <div
          className="flex h-6 w-6 items-center justify-center rounded text-[0.625rem] font-bold text-white"
          style={{
            background: "var(--hermes-blue)",
            boxShadow: "0 0 10px color-mix(in srgb, var(--hermes-blue) 60%, transparent)",
          }}
        >
          K
        </div>
        <span className="text-sm font-medium tracking-wide">{siteConfig.name}</span>
      </div>

      <div className="px-3 py-2 border-b border-[var(--hermes-border)]">
        <SearchDialog posts={posts} variant="sidebar" />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <p className="hermes-section-label">导航</p>
        {siteConfig.nav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`hermes-nav-item ${isActive ? "active" : ""}`}
            >
              {navIcons[item.href]}
              {item.label}
            </Link>
          );
        })}

        {recentPosts.length > 0 && (
          <>
            <p className="hermes-section-label mt-3">最近文章</p>
            {recentPosts.map((post) => {
              const isActive = pathname === `/blog/${post.slug}`;
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`hermes-nav-item text-[0.75rem] ${isActive ? "active" : ""}`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0 opacity-50" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="3" />
                  </svg>
                  <span className="truncate">{post.title}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
}