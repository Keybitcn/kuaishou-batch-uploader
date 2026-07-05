"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/site";
import type { PostMeta } from "@/lib/types";

interface HeaderProps {
  posts: PostMeta[];
}

export function Header({ posts }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-default"
      style={{ background: "var(--header-bg)" }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex w-28 items-center gap-3">
            <SearchDialog posts={posts} />
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="font-serif text-3xl font-normal tracking-[0.12em] text-primary transition-colors hover:text-accent"
          >
            {siteConfig.name}
          </Link>

          <div className="w-28" />
        </div>

        <nav className="flex items-center justify-center gap-10 border-t border-default py-4">
          {siteConfig.nav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`label-caps border-b pb-1 transition-colors ${
                  isActive
                    ? "border-accent text-primary"
                    : "border-transparent text-muted hover:border-default hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}