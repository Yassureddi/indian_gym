import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AboutStory from "@/components/about/AboutStory";
import MissionVision from "@/components/about/MissionVision";
import GymTimeline from "@/components/about/GymTimeline";
import AboutFacilities from "@/components/about/AboutFacilities";
import AboutCounters from "@/components/about/AboutCounters";
import HomeCTA from "@/components/home/HomeCTA";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "About Us",
  "Discover the story, mission, and vision of INDIAN GYM K N RAJU FITNESS. Premium facilities, certified trainers, and 15+ years of excellence.",
  "/about"
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Building stronger bodies and stronger communities since 2010"
        breadcrumb="Our Story"
      />
      <AboutStory />
      <MissionVision />
      <GymTimeline />
      <AboutFacilities />
      <AboutCounters />
      <HomeCTA />
    </>
  );
}
