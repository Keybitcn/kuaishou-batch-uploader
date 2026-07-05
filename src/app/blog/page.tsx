import { PostCard } from "@/components/PostCard";
import { createPageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/posts";

export const metadata = createPageMetadata({
  title: "文章",
  description: "全部博客文章",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 animate-fade-in">
      <div className="mb-4 px-1">
        <h1 className="text-lg font-semibold">全部文章</h1>
        <p className="text-[0.75rem] text-[var(--hermes-muted)] mt-0.5">
          {posts.length} 篇
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="hermes-card p-8 text-center text-[var(--hermes-muted)]">
          暂无文章
        </div>
      ) : (
        <div className="hermes-card overflow-hidden">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}