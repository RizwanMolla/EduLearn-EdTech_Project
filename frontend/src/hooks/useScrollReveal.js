import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { usePageReady } from '../context/TransitionContext';

/**
 * Declarative scroll animations for everything inside `scope`:
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="fade"     fade only
 *   data-stagger           children rise in sequence
 *   data-split             heading lines slide up from a mask
 *   data-parallax="0.15"   element drifts while scrolling
 *   data-scale-in          media scales down into place
 */
export const useScrollReveal = (scope, dependencies = []) => {
  const ready = usePageReady();

  useGSAP(() => {
    if (!ready || prefersReducedMotion() || !scope.current) return;
    const q = (selector) => gsap.utils.toArray(selector, scope.current);

    q('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.15,
            stagger: 0.09,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }),
      });
    });

    q('[data-reveal]').forEach((el) => {
      const fadeOnly = el.dataset.reveal === 'fade';
      gsap.from(el, {
        autoAlpha: 0,
        y: fadeOnly ? 0 : 36,
        duration: 1.1,
        ease: 'expo.out',
        delay: Number(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });

    q('[data-stagger]').forEach((group) => {
      if (!group.children.length) return;
      gsap.from(group.children, {
        autoAlpha: 0,
        y: 32,
        duration: 1,
        ease: 'expo.out',
        stagger: Number(group.dataset.stagger) || 0.07,
        scrollTrigger: { trigger: group, start: 'top 90%', once: true },
      });
    });

    q('[data-scale-in]').forEach((el) => {
      gsap.from(el, {
        scale: 1.18,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    q('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(
        el,
        { yPercent: -amount * 100 },
        {
          yPercent: amount * 100,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });

    ScrollTrigger.refresh();
  }, { scope, dependencies: [ready, ...dependencies], revertOnUpdate: true });
};
