import { Avatar } from "@/components/Avatar";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "关于",
  description: `关于 ${siteConfig.author}`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 animate-fade-in">
      <div className="hermes-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar size="lg" />
          <div>
            <h1 className="text-lg font-semibold">{siteConfig.author}</h1>
            <p className="text-[0.75rem] text-[var(--hermes-muted)]">博主</p>
          </div>
        </div>

        <p className="text-[0.8125rem] text-[var(--hermes-muted)] leading-relaxed mb-6">
          这个博客是我记录学习、思考与创作的个人空间。
          关注 Web 开发、开源工具与效率提升。
        </p>

        <div className="border border-[var(--hermes-border)] rounded-lg p-5">
          <p className="hermes-section-label mb-3 !px-0">联系方式</p>
          <div className="space-y-2 text-[0.8125rem]">
            <p>
              <span className="text-[var(--hermes-muted)]">邮箱 · </span>
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--hermes-blue)] hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p>
              <span className="text-[var(--hermes-muted)]">GitHub · </span>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--hermes-blue)] hover:underline"
              >
                {siteConfig.github}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}