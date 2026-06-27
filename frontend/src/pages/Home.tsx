import Hero from '../components/sections/Hero';
import TrustedTechnologies from '../components/sections/TrustedTechnologies';
import ServicesSection from '../components/sections/Services';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Process from '../components/sections/Process';
import ProjectsSection from '../components/sections/Projects';
import Statistics from '../components/sections/Statistics';
import TestimonialsSection from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedTechnologies />
      <ServicesSection />
      <WhyChooseUs />
      <Process />
      <ProjectsSection />
      <Statistics />
      <TestimonialsSection />
      <FAQ />
      <CTA />
    </>
  );
}
