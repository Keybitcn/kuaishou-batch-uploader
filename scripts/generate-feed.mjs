import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsDir = path.join(root, "content/posts");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const siteFile = path.join(root, "content/site.json");
const siteData = fs.existsSync(siteFile)
  ? JSON.parse(fs.readFileSync(siteFile, "utf8"))
  : { name: "Key", description: "记录思考、技术与生活" };
const siteName = siteData.name;
const siteDescription = siteData.description;

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, fileName), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? new Date().toISOString(),
        excerpt: data.excerpt ?? content.slice(0, 120).replace(/\n/g, " "),
        tags: data.tags ?? [],
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const posts = getAllPosts();
const items = posts
  .map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}/</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
  )
  .join("");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

const outDir = path.join(root, "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "feed.xml"), feed);
console.log("Generated public/feed.xml");