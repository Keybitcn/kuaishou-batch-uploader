export const siteConfig = {
  name: "Key",
  title: "Key 的个人博客",
  description: "记录思考、技术与生活",
  author: "Key",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quna.fun",
  github: "https://github.com",
  email: "key@example.com",
  locale: "zh_CN",
  avatar: "/avatar.svg",
  accent: {
    primary: "#3B82F6",
    secondary: "#60A5FA",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "文章", href: "/blog" },
    { label: "标签", href: "/tags" },
    { label: "关于", href: "/about" },
  ],
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Announcements",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
    mapping: "pathname" as const,
    reactionsEnabled: true,
  },
} as const;

export function isGiscusConfigured(): boolean {
  return Boolean(
    siteConfig.giscus.repo &&
      siteConfig.giscus.repoId &&
      siteConfig.giscus.categoryId
  );
}