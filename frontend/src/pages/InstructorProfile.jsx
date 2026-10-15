import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { getInstructor, instructors } from '../data/instructors';
import { coursesByInstructor } from '../data/courses';
import { getCategory } from '../data/categories';
import { CourseCard } from '../components/course/CourseCard';
import { InstructorCard } from '../components/home/InstructorsSection';
import { SectionLabel } from '../components/ui/Bits';
import Stars from '../components/ui/Stars';
import NotFound from './NotFound';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatCompact, formatNumber } from '../lib/format';

const InstructorProfile = () => {
  const { instructorId } = useParams();
  const instructor = getInstructor(instructorId);
  const root = useRef(null);
  usePageTitle(instructor?.name || 'Instructor not found');
  useScrollReveal(root);

  if (!instructor) return <NotFound />;

  const taught = coursesByInstructor(instructor.id);
  const learners = taught.reduce((s, c) => s + c.students, 0);
  const reviews = taught.reduce((s, c) => s + c.reviews, 0);
  const rating = taught.length ? Math.round((taught.reduce((s, c) => s + c.rating * c.reviews, 0) / reviews) * 10) / 10 : 0;
  const others = instructors.filter((i) => i.id !== instructor.id).slice(0, 4);

  return (
    <div ref={root} className="pb-28">
      <section className="shell pt-32 sm:pt-40">
        <Link to="/instructors" className="eyebrow inline-flex items-center gap-2 text-ink-3 hover:text-ink" data-reveal>
          <ArrowLeft size={13} /> All instructors
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-paper-2">
              <img
                src={instructor.photo}
                alt={instructor.name}
                className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
                data-parallax="0.08"
              />
            </div>
          </div>

          <div className="flex flex-col lg:col-span-7">
            <SectionLabel>{getCategory(instructor.category).name}</SectionLabel>
            <h1 data-split className="display-xl mt-6 !text-[clamp(3rem,8vw,7.5rem)]">
              {instructor.name}
            </h1>
            <p className="mt-4 text-xl text-ink-2" data-reveal>
              {instructor.role}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-3" data-reveal>
              <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{instructor.location}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase size={15} />{instructor.experience} years in industry</span>
            </div>

            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-2" data-reveal>
              {instructor.bio}
            </p>
            <blockquote className="mt-8 max-w-2xl border-l-2 border-clay pl-6 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug italic" data-reveal>
              "{instructor.quote}"
            </blockquote>

            <div className="mt-10 flex flex-wrap gap-2" data-reveal>
              {instructor.focus.map((f) => (
                <Link key={f} to={`/courses?q=${encodeURIComponent(f)}`} className="rounded-full border border-line px-3.5 py-1.5 text-sm transition hover:border-ink">
                  {f}
                </Link>
              ))}
            </div>

            <dl className="mt-auto grid grid-cols-3 border-t border-line pt-6" data-reveal>
              <div>
                <dd className="font-display text-4xl tracking-[-0.04em]">{taught.length}</dd>
                <dt className="mt-1 text-sm text-ink-3">Courses</dt>
              </div>
              <div className="border-l border-line pl-5">
                <dd className="font-display text-4xl tracking-[-0.04em]">{formatCompact(learners)}</dd>
                <dt className="mt-1 text-sm text-ink-3">Learners</dt>
              </div>
              <div className="border-l border-line pl-5">
                <dd className="flex items-center gap-2 font-display text-4xl tracking-[-0.04em]">{rating}</dd>
                <dt className="mt-1 flex items-center gap-2 text-sm text-ink-3">
                  <Stars rating={rating} size={11} /> {formatNumber(reviews)}
                </dt>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="shell mt-28">
        <SectionLabel index={String(taught.length).padStart(2, '0')}>Courses by {instructor.name.split(' ')[0]}</SectionLabel>
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
          {taught.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="shell mt-28 border-t border-line pt-16">
        <SectionLabel>More instructors</SectionLabel>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" data-stagger>
          {others.map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default InstructorProfile;
