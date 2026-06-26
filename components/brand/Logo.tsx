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
  const [imgSrc, setImgSrc] = useState(BRAND.logo.src);
  const size = LOGO_SIZES[variant];

  const image = (
    <Image
      src={imgSrc}
      alt={BRAND.logo.alt}
      width={size.width}
      height={size.height}
      className={styles.image}
      priority={variant === "navbar"}
      onError={() => setImgSrc(BRAND.logo.fallback)}
    />
  );

  const content = (
    <>
      <span className={cn(styles.mark, styles[variant])}>{image}</span>
      {showText && variant !== "icon" && (
        <span className={cn(styles.text, styles[`text_${variant}`])}>
          <span className={styles.name}>
            {variant === "footer" ? BRAND.name : BRAND.shortName}
          </span>
          {variant !== "login" && (
            <span className={styles.tagline}>Indian Gym</span>
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
