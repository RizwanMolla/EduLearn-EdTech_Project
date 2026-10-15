import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { usePageReady } from '../../context/TransitionContext';
import { getCourse } from '../../data/courses';
import { testimonials } from '../../data/site';
import CourseCover from '../course/CourseCover';

const stack = [9, 13, 1].map((id) => getCourse(id));

// Split layout used by sign in and sign up: a forest panel with a floating cover stack, then the form
const AuthShell = ({ eyebrow, title, children, quoteIndex = 0 }) => {
  const root = useRef(null);
  const ready = usePageReady();
  const quote = testimonials[quoteIndex];

  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    gsap.from('.auth-fade', { autoAlpha: 0, y: 30, duration: 1, stagger: 0.07, ease: 'expo.out' });
    gsap.from('.auth-cover', { autoAlpha: 0, y: 80, rotate: (i) => [-14, 6, -4][i], duration: 1.4, stagger: 0.12, ease: 'expo.out', delay: 0.15 });
    gsap.utils.toArray('.auth-cover').forEach((el, i) => {
      gsap.to(el, { y: i % 2 ? 12 : -12, duration: 3.4 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
  }, { scope: root, dependencies: [ready] });

  return (
    <div ref={root} className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest p-10 pt-32 text-on-forest lg:flex lg:flex-col lg:justify-between xl:p-14 xl:pt-32">
        <div className="relative h-[46vh]">
          {stack.map((course, i) => (
            <div
              key={course.id}
              className="auth-cover absolute w-[44%] max-w-[260px] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
              style={{ left: `${8 + i * 24}%`, top: `${[14, 0, 22][i]}%`, rotate: `${[-8, 3, 9][i]}deg`, zIndex: [1, 3, 2][i] }}
            >
              <CourseCover course={course} showTitle className="aspect-[4/5]" />
            </div>
          ))}
        </div>
        <figure className="auth-fade relative max-w-lg">
          <blockquote className="font-display text-[1.9rem] leading-[1.15] tracking-[-0.02em]">"{quote.quote}"</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm">
            <img src={quote.photo} alt="" className="size-10 rounded-full object-cover" />
            <span>
              <span className="block font-medium">{quote.name}</span>
              <span className="block text-on-forest/60">{quote.role}</span>
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="flex items-center justify-center px-5 pt-28 pb-16 sm:px-10 lg:pt-32">
        <div className="w-full max-w-md">
          <p className="auth-fade eyebrow text-ink-3">{eyebrow}</p>
          <h1 className="auth-fade display-md mt-4">{title}</h1>
          <div className="auth-fade mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
