import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface PostNavigationProps {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid sm:grid-cols-2 gap-4">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group">
          <p className="text-[0.6875rem] text-[var(--hermes-muted)] mb-1">上一篇</p>
          <p className="text-[0.8125rem] font-medium group-hover:text-[var(--hermes-blue)] transition-colors">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="group sm:text-right">
          <p className="text-[0.6875rem] text-[var(--hermes-muted)] mb-1">下一篇</p>
          <p className="text-[0.8125rem] font-medium group-hover:text-[var(--hermes-blue)] transition-colors">
            {next.title}
          </p>
        </Link>
      ) : null}
    </nav>
  );
}