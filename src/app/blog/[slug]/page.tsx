import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { GiscusComments } from "@/components/GiscusComments";
import { PostNavigation } from "@/components/PostNavigation";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TagBadge } from "@/components/TagBadge";
import { createPageMetadata } from "@/lib/metadata";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const postUrl = `${siteConfig.url}/blog/${slug}`;

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-6 py-8 animate-fade-in">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[0.75rem] text-[var(--hermes-muted)] hover:text-[var(--hermes-fg)] mb-6"
        >
          ← 返回文章列表
        </Link>

        <div className="hermes-card p-8 mb-6">
          <div className="flex flex-wrap items-center gap-3 text-[0.6875rem] text-[var(--hermes-muted)] mb-4">
            <time dateTime={post.date}>
              {format(new Date(post.date), "yyyy.MM.dd", { locale: zhCN })}
            </time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <CopyLinkButton url={postUrl} />
          </div>

          <h1 className="text-xl font-semibold leading-snug mb-4">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div
          className="hermes-card p-8 prose-blog"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="hermes-card p-6 mt-4">
          <PostNavigation prev={prev} next={next} />
        </div>

        <section className="mt-4">
          <p className="hermes-section-label mb-2">评论</p>
          <GiscusComments />
        </section>
      </article>
    </>
  );
}