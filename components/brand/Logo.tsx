"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, LOGO_SIZES, type LogoVariant } from "@/lib/branding";
import { cn } from "@/lib/utils";
import styles from "./Logo.module.css";

interface LogoProps {
  variant?: LogoVariant;
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({
  variant = "navbar",
  showText = true,
  className,
  href = "/",
}: LogoProps) {
  const logoAsset = variant === "login" ? BRAND.loginLogo : BRAND.logo;
  const [imgSrc, setImgSrc] = useState(logoAsset.src);
  const size = LOGO_SIZES[variant];

  const isSvg = imgSrc.endsWith(".svg");

  const image = isSvg ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={logoAsset.alt}
      width={size.width}
      height={size.height}
      className={styles.image}
      onError={() => setImgSrc(logoAsset.fallback)}
    />
  ) : (
    <Image
      src={imgSrc}
      alt={logoAsset.alt}
      width={size.width}
      height={size.height}
      className={styles.image}
      priority={variant === "navbar" || variant === "hero" || variant === "login"}
      onError={() => setImgSrc(logoAsset.fallback)}
    />
  );

  const content = (
    <>
      <span className={cn(styles.mark, styles[variant])}>{image}</span>
      {showText && variant !== "icon" && variant !== "hero" && (
        <span className={cn(styles.text, styles[`text_${variant}`])}>
          <span className={styles.name}>
            {variant === "footer" ? BRAND.name : BRAND.shortName}
          </span>
          {variant !== "login" && (
            <>
              <span className={styles.tagline}>Indian Gym</span>
              {variant === "navbar" && (
                <span className={styles.motto}>Be Strong</span>
              )}
            </>
          )}
        </span>
      )}
    </>
  );

  const classes = cn(styles.logo, styles[`layout_${variant}`], className);

  if (href && variant !== "login") {
    return (
      <Link href={href} className={classes} aria-label={BRAND.name}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
