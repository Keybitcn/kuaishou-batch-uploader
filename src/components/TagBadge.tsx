import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  count?: number;
}

export function TagBadge({ tag, count }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/?tag=${encodeURIComponent(tag)}`}
      className="hermes-tag hover:bg-[var(--hermes-hover)] transition-colors"
    >
      {tag}
      {count !== undefined && (
        <span className="ml-1 opacity-60">{count}</span>
      )}
    </Link>
  );
}