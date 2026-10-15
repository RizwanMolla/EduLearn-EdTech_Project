import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { instructors } from '../data/instructors';
import { stats } from '../data/site';
import { InstructorCard } from '../components/home/InstructorsSection';
import { SectionLabel } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import Counter from '../components/ui/Counter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';

const img = (id, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;

const values = [
  { title: 'Projects over passive watching', text: 'Every module ends with something you build. Watching is not learning; doing is.' },
  { title: 'Practitioners teach', text: 'Our instructors still work in their fields. They teach what is used today, and rebuild courses when it changes.' },
  { title: 'Short, honest lessons', text: 'Lessons average twelve minutes. If an idea can be explained faster, we explain it faster.' },
  { title: 'Respect for your time', text: 'No dark patterns, no fake countdowns, and a 30-day refund on every purchase.' },
];

const timeline = [
  { year: '2024', text: 'EduLearn starts as a weekend side project: six courses, a basic catalogue and a lot of ambition.' },
  { year: '2025', text: 'Accounts, profiles and purchases ship. The first learners finish courses and send feedback, lots of it.' },
  { year: '2026', text: 'A full rebuild: learning paths, a real classroom with progress and notes, certificates, and a new design.' },
  { year: 'Next', text: 'Mentor reviews for projects, cohort-based courses and offline downloads for learning on the move.' },
];

const About = () => {
  const root = useRef(null);
  usePageTitle('About');
  useScrollReveal(root);

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-36 sm:pt-44">
        <SectionLabel>About EduLearn</SectionLabel>
        <h1 data-split className="display-xl mt-8 max-w-6xl">
          We build courses we wish we had.
        </h1>
      </header>

      <section className="shell mt-16 grid gap-4 sm:grid-cols-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:col-span-5">
          <img src={img('photo-1522202176988-66273c2fd55f')} alt="Learners working together around laptops" className="media-tone absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover" data-parallax="0.1" loading="lazy" />
        </div>
        <div className="grid gap-4 sm:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <img src={img('photo-1531482615713-2afd69097998')} alt="A small team reviewing work on a laptop" className="media-tone absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover" data-parallax="0.08" loading="lazy" />
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-forest p-7 text-on-forest sm:flex-row sm:items-end">
            <p className="max-w-sm font-display text-2xl leading-snug">
              Most online learning optimises for sign-ups. We optimise for what you can do afterwards.
            </p>
            <span className="eyebrow shrink-0 text-on-forest/60">Since 2024</span>
          </div>
        </div>
      </section>

      <section className="shell mt-28 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="01">The story</SectionLabel>
        </div>
        <div className="prose-edu max-w-3xl text-xl lg:col-span-8" data-reveal>
          <p>
            EduLearn started as a first full-stack project: a catalogue, a login page and a purchase flow. It worked, and
            it taught its builder a lot. It also looked like every other course site, and it stopped exactly where the
            learning should begin.
          </p>
          <p>
            This version starts there instead. It has a real classroom with progress you can see, notes that save as you
            type, knowledge checks that explain their answers, and certificates you can verify. The courses are
            organised into paths so you always know what comes next.
          </p>
        </div>
      </section>

      <section className="shell mt-28">
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`border-b border-line py-8 pr-4 lg:border-b-0 ${i % 2 === 0 ? 'border-r' : 'pl-6'} ${i < 3 ? 'lg:border-r' : ''} ${i > 0 ? 'lg:pl-8' : ''}`}>
              <dt className="eyebrow text-ink-3">{s.label}</dt>
              <dd className="mt-4 font-display text-[clamp(2.6rem,5vw,4.25rem)] leading-none tracking-[-0.04em]">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-28 bg-paper-2/60 py-24">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="02">What we believe</SectionLabel>
            <h2 data-split className="display-md mt-6">
              Four principles, applied to every course.
            </h2>
          </div>
          <ol className="border-t border-line lg:col-span-8" data-stagger>
            {values.map((v, i) => (
              <li key={v.title} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[80px_1fr_1.2fr] sm:gap-8">
                <span className="font-mono text-sm text-ink-3">0{i + 1}</span>
                <h3 className="font-display text-2xl leading-tight tracking-[-0.02em]">{v.title}</h3>
                <p className="text-ink-2">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell mt-28">
        <SectionLabel index="03">Timeline</SectionLabel>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {timeline.map((t, i) => (
            <li key={t.year} className={`flex min-h-64 flex-col justify-between rounded-3xl p-6 ${i === 2 ? 'bg-lime text-coal' : 'border border-line'}`}>
              <span className="font-display text-5xl tracking-[-0.04em]">{t.year}</span>
              <p className={i === 2 ? 'text-coal/80' : 'text-ink-2'}>{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="04">The people</SectionLabel>
            <h2 data-split className="display-md mt-6">
              Meet some of the faculty.
            </h2>
          </div>
          <Button to="/instructors" variant="outline" icon={ArrowRight} className="self-start sm:self-auto">
            Everyone
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" data-stagger>
          {instructors.slice(4, 8).map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
