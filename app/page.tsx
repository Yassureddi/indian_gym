import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import HomeServices from "@/components/home/HomeServices";
import HomeMembership from "@/components/home/HomeMembership";
import TransformationCounter from "@/components/home/TransformationCounter";
import HomeBMI from "@/components/home/HomeBMI";
import HomeTrainers from "@/components/home/HomeTrainers";
import Testimonials from "@/components/home/Testimonials";
import HomeGallery from "@/components/home/HomeGallery";
import HomeBlogs from "@/components/home/HomeBlogs";
import HomeCTA from "@/components/home/HomeCTA";
import Location from "@/components/home/Location";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <HomeServices />
      <HomeMembership />
      <TransformationCounter />
      <HomeBMI />
      <HomeTrainers />
      <Testimonials />
      <HomeGallery />
      <HomeBlogs />
      <HomeCTA />
      <Location />
    </>
  );
}
