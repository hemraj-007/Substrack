"use client";

import type { IconType } from "react-icons";
import { SiFigma, SiNetflix, SiSpotify, SiYoutube } from "react-icons/si";
import { getMerchantBrand } from "@/lib/merchantLogos";

const ICONS: Record<string, { Icon: IconType; color: string }> = {
  netflix: { Icon: SiNetflix, color: "#E50914" },
  spotify: { Icon: SiSpotify, color: "#1DB954" },
  youtube: { Icon: SiYoutube, color: "#FF0000" },
  figma: { Icon: SiFigma, color: "#A259FF" },
};

function AmazonIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#FF9900"
        d="M13.5 18.2c-4.9.3-9.6-.6-13.2-2.4-.3-.1-.7.1-.3.5 1.2 1.4 4.1 2.4 7.1 2.5.4 0 .5.5.1.7-1.1.6-2.3 1-3.5 1.2-.2 0-.4.2-.1.4 1.8 1.2 5.4 1.5 8.1.8.3-.1.4-.4.1-.6-.9-.7-2.2-1.2-3.5-1.5z"
      />
      <path
        fill="#232F3E"
        d="M18.9 15.6c-3.8 2.8-9.3 4.3-14 4.3-2.7 0-5.4-.5-7.7-1.5-.4-.2 0-.7.4-.5 2.3 1.4 5.1 2.2 8 2.2 3.2 0 6.3-1.1 8.8-3 .3-.2.7.2.5.5z"
      />
      <text x="4" y="14" fill="#232F3E" fontSize="11" fontWeight="bold" fontFamily="Arial,sans-serif">
        a
      </text>
    </svg>
  );
}

type Props = {
  merchant: string;
  size?: number;
  className?: string;
};

/** Brand SVG when known; colored initial fallback otherwise. */
export function MerchantLogoIcon({ merchant, size = 28, className = "" }: Props) {
  const key = merchant.toLowerCase().trim();

  if (key.includes("amazon")) {
    return <AmazonIcon size={size} />;
  }

  for (const [pattern, { Icon, color }] of Object.entries(ICONS)) {
    if (key.includes(pattern)) {
      return <Icon className={className} size={size} color={color} aria-hidden />;
    }
  }

  const brand = getMerchantBrand(merchant);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg text-xs font-bold ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: brand.bg,
        color: brand.color,
      }}
      aria-hidden
    >
      {brand.initial}
    </span>
  );
}
