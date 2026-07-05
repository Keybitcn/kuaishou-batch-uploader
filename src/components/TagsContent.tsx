"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { TagBadge } from "@/components/TagBadge";
import type { PostMeta } from "@/lib/types";

interface TagsContentProps {
  tags: { tag: string; count: number }[];
  posts: PostMeta[];
}

export function TagsContent({ tags, posts }: TagsContentProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";
  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 animate-fade-in">
      <div className="mb-4 px-1">
        <h1 className="text-lg font-semibold">标签</h1>
      </div>

      {tags.length === 0 ? (
        <div className="hermes-card p-8 text-center text-[var(--hermes-muted)]">
          暂无标签
        </div>
      ) : (
        <div className="hermes-card p-5 mb-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <TagBadge key={t.tag} tag={t.tag} count={t.count} />
          ))}
        </div>
      )}

      {activeTag && (
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[0.8125rem] font-medium">{activeTag}</h2>
            <div className="flex items-center gap-3 text-[0.75rem] text-[var(--hermes-muted)]">
              <span>{filteredPosts.length} 篇</span>
              <Link href="/tags/" className="text-[var(--hermes-blue)] hover:underline">
                清除
              </Link>
            </div>
          </div>
          <div className="hermes-card overflow-hidden">
            {filteredPosts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}