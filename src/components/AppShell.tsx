"use client";

import { Sidebar } from "@/components/Sidebar";
import { StatusBar } from "@/components/StatusBar";
import type { PostMeta } from "@/lib/types";

interface AppShellProps {
  children: React.ReactNode;
  posts: PostMeta[];
}

export function AppShell({ children, posts }: AppShellProps) {
  return (
    <div className="hermes-shell">
      <Sidebar posts={posts} />
      <div className="hermes-main">
        <div className="hermes-content">{children}</div>
        <StatusBar />
      </div>
    </div>
  );
}