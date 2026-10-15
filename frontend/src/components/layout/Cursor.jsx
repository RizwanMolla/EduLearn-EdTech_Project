import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from '../../lib/gsap';

// A lime label that follows the pointer over elements marked with data-cursor="Label"
const Cursor = () => {
  const root = useRef(null);
  const label = useRef(null);

  useGSAP(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const el = root.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    let current = null;

    const show = (target) => {
      label.current.textContent = target.dataset.cursor;
      gsap.to(el, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
    };
    const hide = () => gsap.to(el, { scale: 0, autoAlpha: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target.closest?.('[data-cursor]') || null;
      if (target !== current) {
        current = target;
        if (target) show(target);
        else hide();
      }
    };
    const leave = () => {
      current = null;
      hide();
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  });

  return (
    <div
      ref={root}
      className="pointer-events-none fixed top-0 left-0 z-[96] hidden size-[88px] items-center justify-center gap-1 rounded-full bg-lime text-[0.8rem] font-medium text-coal opacity-0 md:flex"
      aria-hidden="true"
      data-print-hide
    >
      <span ref={label}>View</span>
      <ArrowUpRight size={14} />
    </div>
  );
};

export default Cursor;
