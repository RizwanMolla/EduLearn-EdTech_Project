import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { gsap, Flip, useGSAP } from '../../lib/gsap';
import { courses } from '../../data/courses';
import { categories } from '../../data/categories';
import { CourseCard } from '../course/CourseCard';
import { SectionLabel } from '../ui/Bits';
import Button from '../ui/Button';

const filters = [{ id: 'all', name: 'All' }, ...categories.filter((c) => ['development', 'data', 'design', 'ai'].includes(c.id))];

const FeaturedCourses = () => {
  const root = useRef(null);
  const [filter, setFilter] = useState('all');
  const flipState = useRef(null);

  const list = (filter === 'all' ? [...courses].sort((a, b) => b.students - a.students) : courses.filter((c) => c.category === filter)).slice(0, 6);

  const choose = (id) => {
    if (id === filter) return;
    flipState.current = Flip.getState(gsap.utils.toArray('.fc-item', root.current));
    setFilter(id);
  };

  // Cards glide to their new positions when the filter changes
  useGSAP(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      targets: gsap.utils.toArray('.fc-item', root.current),
      duration: 0.8,
      ease: 'expo.inOut',
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }),
    });
    flipState.current = null;
  }, { scope: root, dependencies: [filter] });

  return (
    <section ref={root} className="shell py-20 sm:py-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="02">Featured this term</SectionLabel>
          <h2 data-split className="display-lg mt-6 max-w-3xl">
            Courses people finish, and then use.
          </h2>
        </div>
        <Button to="/courses" variant="outline" icon={ArrowRight} className="self-start lg:self-auto">
          Full catalogue
        </Button>
      </div>

      <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Filter featured courses">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => choose(f.id)}
            className={clsx(
              'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors duration-300',
              filter === f.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
        {list.map((course) => (
          <div key={course.id} className="fc-item" data-flip-id={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
