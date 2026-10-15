import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { paths, pathTones } from '../../data/paths';
import { getCourse } from '../../data/courses';
import { SectionLabel } from '../ui/Bits';

const PathsTeaser = () => (
  <section className="shell py-20 sm:py-28">
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <SectionLabel index="05">Learning paths</SectionLabel>
        <h2 data-split className="display-lg mt-6">
          Not sure where to start? Follow a path.
        </h2>
      </div>
      <p className="text-ink-2 lg:col-span-4 lg:col-start-9" data-reveal>
        Curated sequences of courses that take you from first principles to job-ready, in an order that makes sense.
      </p>
    </div>

    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
      {paths.map((path) => {
        const tone = pathTones[path.tone];
        return (
          <Link
            key={path.id}
            to={`/paths#${path.id}`}
            className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-transform duration-700 ease-out-expo hover:-translate-y-2"
            style={{ backgroundColor: tone.bg, color: tone.text, borderColor: `${tone.text}1a` }}
            data-cursor="Explore"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[0.65rem] tracking-[0.14em] uppercase opacity-70">{path.months} months</span>
              <span
                className="grid size-10 place-items-center rounded-full transition-transform duration-700 ease-out-expo group-hover:rotate-45"
                style={{ backgroundColor: tone.accent, color: '#161614' }}
              >
                <ArrowUpRight size={17} />
              </span>
            </div>
            <div>
              <h3 className="font-display text-[2rem] leading-none tracking-[-0.035em]">{path.title}</h3>
              <p className="mt-3 text-sm opacity-75">{path.tagline}</p>
              <ul className="mt-6 space-y-1.5 border-t pt-4 text-[0.8rem] opacity-80" style={{ borderColor: `${tone.text}26` }}>
                {path.courses.map((id) => (
                  <li key={id} className="truncate">
                    {getCourse(id).title}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

export default PathsTeaser;
