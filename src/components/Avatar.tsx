import Image from "next/image";
import { siteConfig } from "@/lib/site";

interface AvatarProps {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { class: "h-8 w-8", px: 32 },
  md: { class: "h-12 w-12", px: 48 },
  lg: { class: "h-16 w-16", px: 64 },
};

export function Avatar({ size = "md" }: AvatarProps) {
  const s = sizes[size];

  return (
    <Image
      src={siteConfig.avatar}
      alt={siteConfig.author}
      width={s.px}
      height={s.px}
      className={`${s.class} rounded-full border border-[var(--hermes-border)] object-cover`}
      priority
    />
  );
}