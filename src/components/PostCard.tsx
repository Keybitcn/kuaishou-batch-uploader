import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { PostMeta } from "@/lib/types";

interface PostCardProps {
  post: PostMeta;
  index?: number;
  compact?: boolean;
}

export function PostCard({ post, index = 0, compact = false }: PostCardProps) {
  return (
    <article
      className="group animate-fade-in border-b border-[var(--hermes-border)] last:border-b-0"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`block transition-colors hover:bg-[var(--hermes-hover)] ${compact ? "px-5 py-4" : "px-6 py-5"}`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <time dateTime={post.date} className="text-[0.6875rem] text-[var(--hermes-muted)]">
            {format(new Date(post.date), "yyyy.MM.dd", { locale: zhCN })}
          </time>
          <span className="text-[0.6875rem] text-[var(--hermes-muted)]">
            {post.readingTime} min
          </span>
        </div>

        <h2 className="text-[0.875rem] font-medium mb-1 group-hover:text-[var(--hermes-blue)] transition-colors">
          {post.title}
        </h2>

        {!compact && (
          <p className="text-[0.75rem] text-[var(--hermes-muted)] leading-relaxed mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="hermes-tag">{tag}</span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}