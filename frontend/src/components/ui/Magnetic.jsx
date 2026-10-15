import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from '../../lib/gsap';

// Pulls its child toward the cursor while hovered, then springs back
const Magnetic = ({ children, strength = 0.35, className }) => {
  const ref = useRef(null);

  useGSAP((context, contextSafe) => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });

    const move = contextSafe((e) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    });
    const leave = contextSafe(() => {
      xTo(0);
      yTo(0);
    });

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, { scope: ref });

  return (
    <span ref={ref} className={clsx('will-change-transform', className || 'inline-block')}>
      {children}
    </span>
  );
};

export default Magnetic;
