import { siteConfig } from "@/lib/site";

export function StatusBar() {
  return (
    <footer className="hermes-statusbar">
      <div className="flex items-stretch">
        <span className="hermes-statusbar-item" style={{ cursor: "default" }}>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "#60a5fa", boxShadow: "0 0 6px #3b82f6" }}
          />
          {siteConfig.author}
        </span>
        <a href="/feed.xml" className="hermes-statusbar-item">
          RSS
        </a>
      </div>
      <div className="flex items-stretch">
        <a href="/admin/" className="hermes-statusbar-item">
          后台
        </a>
      </div>
    </footer>
  );
}