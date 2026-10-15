import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Clock, CalendarDays, BarChart3, Check, ShoppingBag } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { paths, pathTones } from '../data/paths';
import { getCourse } from '../data/courses';
import CourseCover from '../components/course/CourseCover';
import { PageHeader } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { usePageReady } from '../context/TransitionContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatHours, formatMoney } from '../lib/format';

const PathCard = ({ path, index }) => {
  const tone = pathTones[path.tone];
  const { addToCart, isEnrolled, getProgress } = useLearning();
  const toast = useToast();
  const list = path.courses.map((id) => getCourse(id));
  const remaining = list.filter((c) => !isEnrolled(c.id));
  const total = remaining.reduce((s, c) => s + c.price, 0);
  const minutes = list.reduce((s, c) => s + c.totalMinutes, 0);
  const done = list.filter((c) => getProgress(c.id).percent === 100).length;

  const addAll = () => {
    remaining.filter((c) => c.price > 0).forEach((c) => addToCart(c.id));
    toast({ title: `${path.title} path added to cart`, description: `${remaining.filter((c) => c.price > 0).length} courses, ${formatMoney(total)}` });
  };

  return (
    <article
      id={path.id}
      className="path-card sticky top-24 grid min-h-[min(82vh,760px)] origin-top gap-10 overflow-hidden rounded-[32px] border p-6 sm:p-10 lg:grid-cols-12 lg:p-14"
      style={{ backgroundColor: tone.bg, color: tone.text, borderColor: `${tone.text}1a` }}
    >
      {/* Darkens gradually while the next card slides over this one */}
      <div className="path-shade pointer-events-none absolute inset-0 z-10 bg-coal opacity-0" aria-hidden="true" />
      <div className="flex flex-col lg:col-span-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm opacity-60">0{index + 1}</span>
          <span className="h-px w-10 opacity-30" style={{ backgroundColor: tone.text }} />
          <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase opacity-70">Career path</span>
        </div>
        <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.045em]">{path.title}</h2>
        <p className="mt-5 max-w-md text-lg opacity-80">{path.tagline}</p>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2"><CalendarDays size={15} className="opacity-60" /><dt className="sr-only">Duration</dt><dd>{path.months} months</dd></div>
          <div className="flex items-center gap-2"><Clock size={15} className="opacity-60" /><dt className="sr-only">Weekly time</dt><dd>{path.hoursPerWeek} h / week</dd></div>
          <div className="flex items-center gap-2"><BarChart3 size={15} className="opacity-60" /><dt className="sr-only">Level</dt><dd>{path.level}</dd></div>
        </dl>

        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {path.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5 text-[0.95rem]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ backgroundColor: tone.accent, color: '#161614' }}>
                <Check size={12} strokeWidth={3} />
              </span>
              {o}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase opacity-60">Leads to roles like</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {path.roles.map((r) => (
              <span key={r} className="rounded-full border px-3 py-1 text-sm" style={{ borderColor: `${tone.text}33` }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:col-span-6">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase opacity-60">{list.length} courses in order</p>
          <p className="text-sm opacity-70">{formatHours(minutes)} total</p>
        </div>
        <ol className="mt-5 space-y-2">
          {list.map((course, i) => {
            const pct = getProgress(course.id).percent;
            return (
              <li key={course.id}>
                <Link
                  to={`/courses/${course.slug}`}
                  className="group flex items-center gap-4 rounded-2xl p-2.5 transition-colors"
                  style={{ backgroundColor: `${tone.text}0d` }}
                >
                  <CourseCover course={course} size="sm" className="aspect-square w-14 shrink-0 rounded-xl [&>div]:hidden" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] opacity-60">Step {i + 1}</span>
                    <span className="block truncate font-medium group-hover:underline">{course.title}</span>
                  </span>
                  <span className="shrink-0 pr-2 font-mono text-xs opacity-70">
                    {isEnrolled(course.id) ? `${pct}%` : formatHours(course.totalMinutes)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-auto pt-8">
          {done > 0 && (
            <p className="mb-3 text-sm opacity-75">
              You have completed {done} of {list.length} courses on this path.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {remaining.some((c) => c.price > 0) ? (
              <button
                type="button"
                onClick={addAll}
                className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-coal transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
                style={{ backgroundColor: tone.accent }}
              >
                <ShoppingBag size={16} /> Add path to cart, {formatMoney(total)}
              </button>
            ) : (
              <span className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-coal" style={{ backgroundColor: tone.accent }}>
                You own every course on this path
              </span>
            )}
            <Link to={`/courses/${list[0].slug}`} className="inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm" style={{ borderColor: `${tone.text}40` }}>
              Start with step 1 <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

const Paths = () => {
  const root = useRef(null);
  const ready = usePageReady();
  usePageTitle('Learning paths');
  useScrollReveal(root);

  // Each card shrinks back as the next one slides over it
  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    const cards = gsap.utils.toArray('.path-card', root.current);
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      // Explicit from/to values: an opacity overlay instead of a CSS filter, which GSAP
      // cannot interpolate from "none" and which is expensive to repaint on large cards
      gsap
        .timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 96px', scrub: true } })
        .fromTo(card, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
        .fromTo(card.querySelector('.path-shade'), { opacity: 0 }, { opacity: 0.35, ease: 'none' }, 0);
    });
  }, { scope: root, dependencies: [ready] });

  return (
    <div ref={root} className="pb-28">
      <PageHeader label="Learning paths" index={String(paths.length).padStart(2, '0')} title="A clear route from first lesson to first job.">
        <p className="max-w-xl text-lg text-ink-2" data-reveal>
          Each path is a sequence of courses chosen and ordered by our instructors, with the projects that hiring managers
          actually ask about.
        </p>
      </PageHeader>

      <div className="shell space-y-8">
        {paths.map((path, i) => (
          <PathCard key={path.id} path={path} index={i} />
        ))}
      </div>

      <section className="shell mt-28 text-center">
        <p className="eyebrow text-ink-3">Not sure which path fits?</p>
        <h2 className="display-md mx-auto mt-4 max-w-3xl">Start with a free course and see how it feels.</h2>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/courses?price=free" icon={ArrowRight}>
            Free courses
          </Button>
          <Button to="/contact?topic=advice" variant="outline">
            Ask for advice
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Paths;
