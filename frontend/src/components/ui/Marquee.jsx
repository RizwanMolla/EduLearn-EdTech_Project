import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

/**
 * Infinite horizontal loop driven by GSAP's ticker. Scrolling speeds it up and
 * flips its direction, so the band feels physically connected to the page.
 */
const Marquee = ({ children, speed = 60, reverse = false, className, itemClassName }) => {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return undefined;
    const el = track.current;
    const setX = gsap.quickSetter(el, 'x', 'px');
    let distance = el.scrollWidth / 2;
    let wrap = gsap.utils.wrap(-distance, 0);
    let x = 0;
    let factor = 1;
    let target = 1;
    let scrollDir = 1;
    let resetTimer;

    const tick = (time, delta) => {
      factor += (target - factor) * 0.08;
      x = wrap(x + (reverse ? 1 : -1) * scrollDir * speed * (delta / 1000) * factor);
      setX(x);
    };
    gsap.ticker.add(tick);

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollDir = self.direction;
        target = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 5);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          target = 1;
        }, 150);
      },
    });

    const measure = () => {
      distance = el.scrollWidth / 2;
      wrap = gsap.utils.wrap(-distance, 0);
    };
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', measure);
      clearTimeout(resetTimer);
    };
  }, { scope: root });

  return (
    <div ref={root} className={clsx('relative flex overflow-hidden', className)}>
      <div ref={track} className="flex w-max shrink-0 will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className={clsx('flex shrink-0 items-center', itemClassName)} aria-hidden={copy === 1}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
