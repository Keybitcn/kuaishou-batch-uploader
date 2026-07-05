import { Suspense } from "react";
import { TagsContent } from "@/components/TagsContent";
import { createPageMetadata } from "@/lib/metadata";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata = createPageMetadata({
  title: "标签",
  description: "按主题浏览文章",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getAllTags();
  const posts = getAllPosts();

  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--hermes-muted)]">加载中…</div>}>
      <TagsContent tags={tags} posts={posts} />
    </Suspense>
  );
}