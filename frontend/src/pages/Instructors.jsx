import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { instructors } from '../data/instructors';
import { categories } from '../data/categories';
import { courses } from '../data/courses';
import { InstructorCard } from '../components/home/InstructorsSection';
import { PageHeader } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatCompact } from '../lib/format';

const Instructors = () => {
  const root = useRef(null);
  const grid = useRef(null);
  const [filter, setFilter] = useState('all');
  usePageTitle('Instructors');
  useScrollReveal(root);

  const used = categories.filter((c) => instructors.some((i) => i.category === c.id));
  const list = filter === 'all' ? instructors : instructors.filter((i) => i.category === filter);
  const avgExperience = Math.round(instructors.reduce((s, i) => s + i.experience, 0) / instructors.length);
  const learners = courses.reduce((s, c) => s + c.students, 0);

  useGSAP(() => {
    if (prefersReducedMotion() || !grid.current) return;
    gsap.fromTo(grid.current.children, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' });
  }, { dependencies: [filter] });

  return (
    <div ref={root} className="pb-28">
      <PageHeader label="The faculty" index={String(instructors.length).padStart(2, '0')} title="Practitioners first, teachers by choice.">
        <dl className="grid max-w-3xl grid-cols-3 border-t border-line" data-reveal>
          {[
            { label: 'Average years in industry', value: avgExperience },
            { label: 'Courses taught', value: courses.length },
            { label: 'Learners taught', value: formatCompact(learners) },
          ].map((s, i) => (
            <div key={s.label} className={clsx('pt-5 pr-4', i > 0 && 'border-l border-line pl-5')}>
              <dd className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-ink-3">{s.label}</dt>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className="shell">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Filter by subject" data-reveal>
          {[{ id: 'all', name: 'Everyone' }, ...used].map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={clsx(
                'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
                filter === c.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div ref={grid} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>

        <section className="mt-28 grid gap-8 overflow-hidden rounded-[32px] bg-forest p-8 text-on-forest sm:p-12 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-8">
            <p className="eyebrow text-on-forest/60">Teach on EduLearn</p>
            <h2 className="display-md mt-4">
              Know something deeply? <span className="italic text-lime">Teach it</span> to people who will use it.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-on-forest/70">We work with a small number of instructors each term and pay them fairly.</p>
            <Button to="/contact?topic=teaching" variant="lime" className="mt-6" icon={ArrowRight}>
              Apply to teach
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Instructors;
