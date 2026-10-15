import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { usePageReady } from '../../context/TransitionContext';

// Counts up to `value` the first time it scrolls into view
const Counter = ({ value, decimals = 0, prefix = '', suffix = '', duration = 2, className }) => {
  const ref = useRef(null);
  const ready = usePageReady();
  const format = (n) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    const state = { n: 0 };
    ref.current.textContent = format(0);
    gsap.to(state, {
      n: value,
      duration,
      ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      onUpdate: () => {
        if (ref.current) ref.current.textContent = format(state.n);
      },
    });
  }, { dependencies: [ready, value], revertOnUpdate: true });

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
};

export default Counter;
