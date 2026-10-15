import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { instructors } from '../../data/instructors';
import { coursesByInstructor } from '../../data/courses';
import { SectionLabel } from '../ui/Bits';
import Button from '../ui/Button';

export const InstructorCard = ({ instructor, className = '' }) => {
  const count = coursesByInstructor(instructor.id).length;
  return (
    <Link to={`/instructors/${instructor.id}`} className={`group block ${className}`} data-cursor="Profile">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-2">
        <img
          src={instructor.photo}
          alt={instructor.name}
          loading="lazy"
          className="media-tone size-full scale-[1.02] object-cover group-hover:scale-[1.07] group-hover:grayscale-0"
        />
        <span className="absolute top-3 left-3 rounded-full bg-coal/55 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-cream uppercase backdrop-blur-md">
          {count} {count === 1 ? 'course' : 'courses'}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-[-0.02em]">{instructor.name}</h3>
          <p className="mt-0.5 text-sm text-ink-3">{instructor.role}</p>
        </div>
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

const InstructorsSection = () => (
  <section className="shell py-20 sm:py-28">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <SectionLabel index="06">The faculty</SectionLabel>
        <h2 data-split className="display-lg mt-6 max-w-3xl">
          Taught by people who still do the work.
        </h2>
      </div>
      <Button to="/instructors" variant="outline" icon={ArrowRight} className="self-start lg:self-auto">
        All instructors
      </Button>
    </div>
    <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" data-stagger>
      {instructors.slice(0, 4).map((instructor) => (
        <InstructorCard key={instructor.id} instructor={instructor} />
      ))}
    </div>
  </section>
);

export default InstructorsSection;
