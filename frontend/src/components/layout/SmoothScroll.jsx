import { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

const ScrollTriggerSync = () => {
  useLenis(ScrollTrigger.update);
  return null;
};

// Lenis drives the page scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync
const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const update = (time) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: reduced ? 1 : 0.1,
        smoothWheel: !reduced,
        wheelMultiplier: 1,
        anchors: { offset: -100 },
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
