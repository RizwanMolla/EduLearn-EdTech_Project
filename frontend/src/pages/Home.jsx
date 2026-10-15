import { Fragment, useRef } from 'react';
import Hero from '../components/home/Hero';
import Manifesto from '../components/home/Manifesto';
import FeaturedCourses from '../components/home/FeaturedCourses';
import HowItWorks from '../components/home/HowItWorks';
import CategoryList from '../components/home/CategoryList';
import PathsTeaser from '../components/home/PathsTeaser';
import InstructorsSection from '../components/home/InstructorsSection';
import Testimonials from '../components/home/Testimonials';
import CtaBand from '../components/home/CtaBand';
import Marquee from '../components/ui/Marquee';
import { SectionLabel } from '../components/ui/Bits';
import { FaqList } from '../components/ui/Accordion';
import { faqs } from '../data/site';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';

const skills = ['TypeScript', 'PyTorch', 'Figma', 'SQL', 'Kubernetes', 'SwiftUI', 'React', 'dbt', 'GSAP', 'Terraform', 'pandas', 'Flutter'];

const Asterisk = () => (
  <svg viewBox="0 0 24 24" className="mx-[0.5em] size-[0.42em] shrink-0 text-clay" aria-hidden="true">
    <path fill="currentColor" d="M10.8 0h2.4l-.5 9.4 7.9-5.2 1.2 2.1-8.4 4.2 8.4 4.2-1.2 2.1-7.9-5.2.5 9.4h-2.4l.5-9.4-7.9 5.2-1.2-2.1 8.4-4.2-8.4-4.2 1.2-2.1 7.9 5.2z" />
  </svg>
);

const Home = () => {
  const root = useRef(null);
  usePageTitle();
  useScrollReveal(root);

  return (
    <div ref={root}>
      <Hero />

      <div className="border-y border-line py-5 sm:py-7">
        <Marquee speed={70} itemClassName="font-display text-[clamp(2rem,5vw,4.25rem)] leading-none tracking-[-0.035em]">
          {skills.map((skill, i) => (
            <Fragment key={skill}>
              <span className={i % 2 ? 'italic text-ink-3' : ''}>{skill}</span>
              <Asterisk />
            </Fragment>
          ))}
        </Marquee>
      </div>

      <Manifesto />
      <FeaturedCourses />
      <HowItWorks />
      <CategoryList />
      <PathsTeaser />
      <InstructorsSection />
      <Testimonials />

      <section className="shell grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="08">Questions</SectionLabel>
          <h2 data-split className="display-md mt-6">
            Good to know before you start.
          </h2>
        </div>
        <FaqList items={faqs} className="lg:col-span-8" />
      </section>

      <CtaBand />
    </div>
  );
};

export default Home;
