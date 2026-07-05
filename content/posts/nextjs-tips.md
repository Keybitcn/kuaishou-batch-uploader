---
title: Next.js 博客开发笔记
date: 2026-07-03
excerpt: 用 Next.js App Router 搭建静态博客的几个实用技巧。
tags: [技术, Next.js, Web]
---

Next.js 的 App Router 让博客开发变得异常简单。以下是几个核心要点。

## 文件系统路由

```
src/app/blog/page.tsx        → /blog
src/app/blog/[slug]/page.tsx → /blog/:slug
```

动态路由配合 `generateStaticParams` 可以在构建时预渲染所有文章页面，SEO 友好且加载极快。

## Markdown 处理流程

1. 用 `gray-matter` 解析 frontmatter
2. 用 `remark` + `remark-gfm` 转 HTML
3. 在页面中渲染

```typescript
const processed = await remark()
  .use(remarkGfm)
  .use(html)
  .process(content);
```

## 部署建议

本地验证通过后，推荐以下海外部署方案：

- **Vercel** — 零配置，自动 HTTPS，免费额度充足
- **Cloudflare Pages** — 全球 CDN，国内访问也相对友好
- **VPS + Nginx** — 完全自主控制，适合有运维经验的用户

无论选择哪种方式，只需修改 `src/lib/site.ts` 中的 `url` 字段即可完成站点配置。