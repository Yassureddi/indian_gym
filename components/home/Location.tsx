import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";
import styles from "./Location.module.css";

export default function Location() {
  const mapsQuery = encodeURIComponent(CONTACT.address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section className="section" id="location">
      <div className="container">
        <SectionHeading
          subtitle="Visit Us"
          title="Our Location"
          description="Find us in Asilmetta, Visakhapatnam. Walk in or message us on WhatsApp."
        />
        <div className={styles.grid}>
          <FadeIn direction="left">
            <GlassCard className={styles.info} hover={false} padding="lg">
              <ul className={styles.list}>
                <li>
                  <span className={styles.icon}>📍</span>
                  <div>
                    <strong>Address</strong>
                    {CONTACT.addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </li>
                <li>
                  <span className={styles.icon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>
                      <a href={`tel:+91${CONTACT.phone}`}>{CONTACT.phone}</a>
                    </p>
                  </div>
                </li>
                <li>
                  <span className={styles.icon}>🕐</span>
                  <div>
                    <strong>Hours</strong>
                    <p>{CONTACT.hours.weekday.label}: {CONTACT.hours.weekday.slots.join(", ")}</p>
                    <p>{CONTACT.hours.sunday.label}: {CONTACT.hours.sunday.slots.join(", ")}</p>
                  </div>
                </li>
                <li>
                  <span className={styles.icon}>📷</span>
                  <div>
                    <strong>Instagram</strong>
                    <p>
                      <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                        @{CONTACT.instagram}
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
              <div className={styles.actions}>
                <Button href={mapsUrl} variant="primary" size="md">
                  Get Directions
                </Button>
                <Button href="/contact" variant="outline" size="md">
                  Contact Us
                </Button>
              </div>
            </GlassCard>
          </FadeIn>

          <FadeIn direction="right">
            <div className={styles.mapWrap}>
              <iframe
                title="KN Raju Fitness Location"
                src={`https://maps.google.com/maps?q=${mapsQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className={styles.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={styles.mapOverlay} aria-hidden="true" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
