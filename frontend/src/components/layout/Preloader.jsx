import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const word = 'EduLearn';

// First-visit intro: a counter runs to 100 while the wordmark rises, then the panel lifts away
const Preloader = ({ onDone }) => {
  const root = useRef(null);
  const counter = useRef(null);

  useGSAP(() => {
    const progress = { value: 0 };
    document.documentElement.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        gsap.set(root.current, { display: 'none' });
      },
    });

    tl.from('.pl-char', { yPercent: 115, duration: 1, stagger: 0.05, ease: 'expo.out' })
      .from('.pl-meta', { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.2)
      .to(progress, {
        value: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(progress.value)).padStart(3, '0');
        },
      }, 0.1)
      .to('.pl-bar', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.1)
      .to('.pl-char', { yPercent: -115, duration: 0.7, stagger: 0.03, ease: 'expo.in' }, '+=0.1')
      .to('.pl-meta, .pl-count', { autoAlpha: 0, duration: 0.3 }, '<')
      .add(() => onDone?.(), '-=0.1')
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.15');
  }, { scope: root });

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[110] flex flex-col justify-between bg-forest p-6 text-on-forest sm:p-10"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <span className="pl-meta eyebrow text-on-forest/60">Learn by building</span>
        <span className="pl-meta eyebrow text-on-forest/60">Est. 2024</span>
      </div>

      <div className="flex flex-col items-start gap-8">
        <div className="flex overflow-hidden" aria-label={word}>
          {word.split('').map((char, i) => (
            <span
              key={i}
              className={`pl-char inline-block font-display text-[clamp(4rem,16vw,15rem)] leading-[0.85] tracking-[-0.05em] ${i >= 3 ? 'italic text-lime' : ''}`}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="w-full">
          <div className="mb-3 flex items-end justify-between">
            <span className="pl-meta eyebrow text-on-forest/60">Preparing your classroom</span>
            <span ref={counter} className="pl-count font-mono text-sm tabular-nums">000</span>
          </div>
          <div className="h-px w-full bg-on-forest/15">
            <div className="pl-bar h-px w-full origin-left scale-x-0 bg-lime" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
