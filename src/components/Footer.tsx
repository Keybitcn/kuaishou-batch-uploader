import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-default">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="font-serif mb-8 text-2xl font-light tracking-[0.1em] text-primary">
          {siteConfig.name}
        </p>
        <div className="mb-8 flex items-center justify-center gap-8">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps link-editorial text-muted"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="label-caps link-editorial text-muted"
          >
            联系
          </a>
          <a href="/feed.xml" className="label-caps link-editorial text-muted">
            RSS
          </a>
        </div>
        <p className="label-caps text-muted">
          © {year} {siteConfig.author}
        </p>
      </div>
    </footer>
  );
}