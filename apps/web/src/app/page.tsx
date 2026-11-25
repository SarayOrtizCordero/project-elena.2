import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { About, Gallery, Marquee, Method, Services, Testimonials } from "@/components/sections";
import { Plans } from "@/components/plans";
import { AppSection } from "@/components/app-section";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <Services />
        <Method />
        <AppSection />
        <Plans />
        <Gallery />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
