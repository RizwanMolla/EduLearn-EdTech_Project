import { useRef } from 'react';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { usePageReady } from '../../context/TransitionContext';
import { SectionLabel } from '../ui/Bits';
import Counter from '../ui/Counter';
import { stats } from '../../data/site';

// Words brighten one by one as the paragraph scrolls through the viewport
const Manifesto = () => {
  const root = useRef(null);
  const text = useRef(null);
  const ready = usePageReady();

  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    SplitText.create(text.current, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: text.current, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
          }
        ),
    });
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} className="shell py-24 sm:py-36">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="01">Our position</SectionLabel>
        </div>
        <p
          ref={text}
          className="font-display text-[clamp(1.85rem,3.9vw,3.6rem)] leading-[1.08] tracking-[-0.03em] lg:col-span-9"
        >
          Most online courses are built to be finished, not remembered. EduLearn is built around projects, short
          lessons and honest feedback, so what you learn here is still with you a year from now, and shows up in the
          work you ship.
        </p>
      </div>

      <dl className="mt-24 grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`border-b border-line py-8 pr-4 lg:border-b-0 ${i % 2 === 0 ? 'border-r' : ''} ${i < 3 ? 'lg:border-r' : ''} ${i > 0 ? 'lg:pl-8' : ''} ${i % 2 === 1 ? 'pl-6' : ''}`}
          >
            <dt className="eyebrow text-ink-3">{s.label}</dt>
            <dd className="mt-4 font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-none tracking-[-0.04em]">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Manifesto;
