import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { testimonials } from '../../data/site';
import { SectionLabel } from '../ui/Bits';

const DURATION = 7000;

const Testimonials = () => {
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = testimonials[index];

  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), DURATION);
    return () => clearTimeout(timer);
  }, [index, paused]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo('.tm-word', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.012, ease: 'expo.out' });
    gsap.fromTo('.tm-meta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'expo.out' });
  }, { scope: root, dependencies: [index] });

  return (
    <section
      ref={root}
      className="border-y border-line bg-paper-2/60 py-20 sm:py-28"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="07">In their words</SectionLabel>
          <ol className="mt-10 hidden space-y-1 lg:block">
            {testimonials.map((t, i) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={clsx('w-full py-3 text-left transition-colors', i === index ? 'text-ink' : 'text-ink-3 hover:text-ink-2')}
                >
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="mt-2.5 block h-px w-full bg-line">
                    <span
                      key={`${index}-${paused}`}
                      className={clsx('block h-px origin-left bg-ink', i === index ? 'animate-[grow-x_linear_forwards]' : 'scale-x-0')}
                      style={i === index ? { animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' } : undefined}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <figure className="lg:col-span-9">
          <svg viewBox="0 0 48 36" className="w-12 text-clay" aria-hidden="true">
            <path
              fill="currentColor"
              d="M0 36V22.4C0 9.6 6.2 2.1 18.6 0l2.2 4.6C14 6.4 10.6 10.4 10.4 16.8H20V36H0zm28 0V22.4C28 9.6 34.2 2.1 46.6 0L48 4.6c-6.8 1.8-10.2 5.8-10.4 12.2H48V36H28z"
            />
          </svg>
          <blockquote key={index} className="mt-8 font-display text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.14] tracking-[-0.025em]">
            {current.quote.split(' ').map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <span className="tm-word inline-block">{word}&nbsp;</span>
              </span>
            ))}
          </blockquote>
          <figcaption className="tm-meta mt-10 flex items-center gap-4">
            <img src={current.photo} alt="" className="size-14 rounded-full object-cover" loading="lazy" />
            <div>
              <p className="font-medium">{current.name}</p>
              <p className="text-sm text-ink-3">
                {current.role}, {current.from.toLowerCase()}
              </p>
            </div>
            <div className="ml-auto flex gap-2 lg:hidden">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  className={clsx('h-1.5 rounded-full transition-all duration-500', i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25')}
                />
              ))}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Testimonials;
