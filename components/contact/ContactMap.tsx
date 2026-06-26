import { CONTACT } from "@/lib/constants";
import styles from "./ContactMap.module.css";

export default function ContactMap() {
  const mapsQuery = encodeURIComponent(CONTACT.address);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Find Us on Google Maps</h3>
      <div className={styles.mapWrap}>
        <iframe
          title="INDIAN GYM K N RAJU FITNESS Location"
          src={`https://maps.google.com/maps?q=${mapsQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
          className={styles.map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>
    </div>
  );
}
