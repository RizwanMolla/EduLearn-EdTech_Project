import { useRef } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from '../lib/gsap';
import Button from '../components/ui/Button';
import { openSearch } from '../lib/nav';
import { usePageTitle } from '../hooks/usePageTitle';

const NotFound = () => {
  const root = useRef(null);
  usePageTitle('Page not found');

  useGSAP(() => {
    if (prefersReducedMotion()) return undefined;
    gsap.from('.nf-digit', { yPercent: 120, rotate: (i) => [-12, 8, -6][i], duration: 1.4, stagger: 0.1, ease: 'expo.out' });
    gsap.from('.nf-fade', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08, delay: 0.4, ease: 'expo.out' });
    if (!isFinePointer()) return undefined;
    const digits = gsap.utils.toArray('.nf-digit');
    const setters = digits.map((d) => gsap.quickTo(d, 'rotation', { duration: 1, ease: 'power3' }));
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      setters.forEach((set, i) => set(nx * (i % 2 ? -14 : 14)));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, { scope: root });

  return (
    <section ref={root} className="shell flex min-h-[88vh] flex-col justify-center pt-32 pb-20">
      <p className="nf-fade eyebrow text-ink-3">Error 404</p>
      <div className="flex overflow-hidden py-4" aria-hidden="true">
        {['4', '0', '4'].map((d, i) => (
          <span key={i} className={`nf-digit inline-block font-display text-[clamp(8rem,30vw,24rem)] leading-[0.8] tracking-[-0.06em] ${i === 1 ? 'italic text-clay' : ''}`}>
            {d}
          </span>
        ))}
      </div>
      <h1 className="nf-fade display-md mt-6 max-w-2xl">This page skipped class.</h1>
      <p className="nf-fade mt-4 max-w-md text-lg text-ink-2">The link might be old, or the page moved. Try searching, or head somewhere useful.</p>
      <div className="nf-fade mt-10 flex flex-wrap gap-3">
        <Button to="/" icon={ArrowRight}>
          Back home
        </Button>
        <Button variant="outline" iconLeft={Search} onClick={openSearch}>
          Search EduLearn
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
