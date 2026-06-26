"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ensureGsapPlugins } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import { HERO_HEADLINE, CONTACT, HERO_VIDEO, HERO_VIDEO_POSTER } from "@/lib/constants";
import { BRAND } from "@/lib/branding";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        brandRef.current,
        { opacity: 0, scale: 0.9, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1 }
      )
        .fromTo(
          copyRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.9 },
          "-=0.55"
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.65"
        )
        .fromTo(
          ctaRef.current?.children || [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 },
          "-=0.45"
        );

      if (videoWrapRef.current) {
        gsap.to(videoWrapRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const phoneHref = `tel:+91${CONTACT.phone}`;
  const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi! I'd like to know more about KN Raju Fitness.")}`;

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="Hero">
      <div ref={videoWrapRef} className={styles.videoWrap}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_VIDEO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className={styles.overlay} />
        <div className={styles.vignette} aria-hidden="true" />
      </div>

      <div className={styles.glowOrb} aria-hidden="true" />
      <div className={`${styles.glowOrb2} premium-glow-pulse`} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div ref={brandRef} className={styles.brandPanel}>
          <div className={styles.logoFrame}>
            <Logo variant="hero" showText={false} href="/" />
          </div>
          <div className={styles.brandMeta}>
            <p className={styles.brandEyebrow}>Indian Gym</p>
            <p className={styles.brandTitle}>{BRAND.shortName}</p>
            <p className={styles.brandMotto}>Be Strong</p>
            <p className={styles.brandLocation}>Visakhapatnam</p>
          </div>
        </div>

        <div ref={copyRef} className={styles.copyPanel}>
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Premium Fitness Experience
          </motion.span>

          <h1 ref={headlineRef} className={styles.headline}>
            <span className={styles.headlineMain}>{HERO_HEADLINE}</span>
          </h1>

          <motion.p
            className={styles.subline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
          >
            Elite training. World-class equipment. A community that pushes you
            beyond limits.
          </motion.p>

          <div ref={ctaRef} className={styles.cta}>
            <Button href="/membership" variant="primary" size="lg">
              Join Now
            </Button>
            <Button href="/free-trial" variant="outline" size="lg">
              Book Free Trial
            </Button>
            <a href={phoneHref} className={styles.actionBtn}>
              <PhoneIcon />
              Call Now
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.whatsapp}`}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>

        <motion.div
          className={`${styles.scrollIndicator} animate-scroll-hint`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>Discover</span>
          <div className={styles.scrollLine} />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
