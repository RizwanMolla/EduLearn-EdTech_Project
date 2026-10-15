import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from '../../lib/gsap';
import { categories } from '../../data/categories';
import { coursesByCategory } from '../../data/courses';
import CourseCover from '../course/CourseCover';
import { SectionLabel } from '../ui/Bits';

// Rows of categories; hovering one floats a cover preview that follows the pointer
const CategoryList = () => {
  const root = useRef(null);
  const preview = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP((context, contextSafe) => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    const el = preview.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' });
    let lastX = 0;

    const move = contextSafe((e) => {
      const rect = root.current.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    });
    const list = root.current.querySelector('.cat-list');
    list.addEventListener('pointermove', move);
    return () => list.removeEventListener('pointermove', move);
  }, { scope: root });

  useGSAP(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    gsap.to(preview.current, {
      autoAlpha: active ? 1 : 0,
      scale: active ? 1 : 0.6,
      duration: 0.5,
      ease: 'expo.out',
    });
  }, { dependencies: [active], scope: root });

  return (
    <section ref={root} className="relative shell py-24 sm:py-32">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="04">Browse by subject</SectionLabel>
          <h2 data-split className="display-md mt-6">
            Eight subjects. One standard.
          </h2>
          <p className="mt-6 max-w-sm text-ink-2" data-reveal>
            Every course is reviewed by a working practitioner and rebuilt when the field moves on.
          </p>
        </div>

        <ul className="cat-list border-t border-line lg:col-span-8" onPointerLeave={() => setActive(null)}>
          {categories.map((cat, i) => {
            const count = coursesByCategory(cat.id).length;
            return (
              <li key={cat.id} onPointerEnter={() => setActive(cat.id)}>
                <Link
                  to={`/courses?category=${cat.id}`}
                  className="group relative flex items-center gap-4 overflow-hidden border-b border-line py-6 sm:gap-8 sm:py-7"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                  <span className="relative font-mono text-xs text-ink-3 transition-colors duration-500 group-hover:text-paper/50 sm:pl-4">
                    0{i + 1}
                  </span>
                  <span className="relative flex-1 whitespace-nowrap font-display text-[clamp(1.6rem,3.6vw,3.25rem)] leading-none tracking-[-0.035em] transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-paper">
                    {cat.name}
                  </span>
                  <span className="relative hidden max-w-[15rem] text-sm text-ink-3 transition-colors duration-500 group-hover:text-paper/60 2xl:block">
                    {cat.blurb}
                  </span>
                  <span className="relative font-mono text-xs text-ink-3 transition-colors duration-500 group-hover:text-paper/60">
                    {count} {count === 1 ? 'course' : 'courses'}
                  </span>
                  <span className="relative grid size-10 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-coal sm:mr-4">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={preview}
        className="pointer-events-none absolute top-0 left-0 z-20 hidden w-60 overflow-hidden rounded-2xl shadow-soft md:block"
        aria-hidden="true"
      >
        {categories.map((cat) => {
          const course = coursesByCategory(cat.id)[0];
          return (
            <div key={cat.id} className={active === cat.id ? 'block' : 'hidden'}>
              <CourseCover course={course} showTitle className="aspect-[4/5]" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryList;
