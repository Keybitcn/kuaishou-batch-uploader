import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createPageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/posts";
import "./globals.css";

export const metadata: Metadata = createPageMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();

  return (
    <html lang="zh-CN" suppressHydrationWarning className="dark h-full" style={{ colorScheme: "dark" }}>
      <body className="h-full" style={{ background: "#0a0a0a", color: "#f0f0f0" }}>
        <ThemeProvider>
          <AppShell posts={posts}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}