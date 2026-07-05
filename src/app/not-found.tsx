import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
      <p className="text-4xl font-semibold mb-2">404</p>
      <p className="text-[0.8125rem] text-[var(--hermes-muted)] mb-6">页面未找到</p>
      <Link href="/" className="hermes-btn hermes-btn-primary">
        返回首页
      </Link>
    </div>
  );
}