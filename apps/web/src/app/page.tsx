import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { About, Marquee, Method, Results, Services, Testimonials } from "@/components/sections";
import { Plans } from "@/components/plans";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Method />
        <Plans />
        <Results />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
