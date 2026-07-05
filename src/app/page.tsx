import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 animate-fade-in">
      <div className="hermes-card p-8 mb-6">
        <div className="flex items-start gap-5">
          <Avatar size="md" />
          <div>
            <h1 className="text-xl font-semibold mb-1">{siteConfig.author}</h1>
            <p className="text-[0.8125rem] text-[var(--hermes-muted)] leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex gap-2">
              <Link href="/blog" className="hermes-btn hermes-btn-primary">
                阅读文章
              </Link>
              <Link href="/about" className="hermes-btn">
                关于
              </Link>
            </div>
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[0.8125rem] font-medium text-[var(--hermes-muted)]">
              最新文章
            </h2>
            <Link
              href="/blog"
              className="text-[0.75rem] text-[var(--hermes-blue)] hover:underline"
            >
              查看全部
            </Link>
          </div>
          <div className="hermes-card overflow-hidden">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}