import { useRef } from 'react';
import { Check, Play, Pause, Award } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { usePageReady } from '../../context/TransitionContext';
import { SectionLabel } from '../ui/Bits';
import { paths } from '../../data/paths';

const PathsIllustration = () => (
  <div className="space-y-2.5">
    {paths.map((p, i) => (
      <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-on-forest/15 bg-on-forest/5 p-3.5">
        <span className="grid size-9 place-items-center rounded-full bg-on-forest/10 font-mono text-xs">0{i + 1}</span>
        <span className="flex-1">
          <span className="block text-sm font-medium">{p.title}</span>
          <span className="block text-xs text-on-forest/55">{p.courses.length} courses / {p.months} months</span>
        </span>
        <span className={`size-2.5 rounded-full ${i === 0 ? 'bg-lime' : 'bg-on-forest/20'}`} />
      </div>
    ))}
  </div>
);

const PlayerIllustration = () => (
  <div className="overflow-hidden rounded-2xl border border-on-forest/15 bg-coal">
    <div className="relative grid aspect-video place-items-center bg-[radial-gradient(circle_at_30%_30%,#24493a,#141412_70%)]">
      <span className="grid size-14 place-items-center rounded-full bg-lime text-coal">
        <Play size={20} fill="currentColor" />
      </span>
      <span className="absolute bottom-3 left-3 rounded-full bg-coal/70 px-2.5 py-1 font-mono text-[0.65rem] text-cream">08:42</span>
    </div>
    <div className="flex items-center gap-3 p-3.5 text-cream">
      <Pause size={14} />
      <div className="h-1 flex-1 rounded-full bg-cream/15">
        <div className="h-full w-2/3 rounded-full bg-lime" />
      </div>
      <span className="font-mono text-[0.65rem] text-cream/60">1.5x</span>
    </div>
  </div>
);

const ProjectIllustration = () => (
  <div className="rounded-2xl border border-on-forest/15 bg-on-forest/5 p-4 font-mono text-[0.72rem] leading-relaxed">
    <p className="text-on-forest/50">// project brief</p>
    <p>
      <span className="text-lime">build</span>(<span className="text-[#f6e3c8]">"searchable catalogue"</span>)
    </p>
    <div className="mt-4 space-y-2 font-sans text-sm">
      {['Fetch and render course data', 'Filter by category and level', 'Sync filters to the URL', 'Ship it'].map((t, i) => (
        <div key={t} className="flex items-center gap-2.5">
          <span className={`grid size-5 place-items-center rounded-md ${i < 3 ? 'bg-lime text-coal' : 'border border-on-forest/30'}`}>
            {i < 3 && <Check size={12} strokeWidth={3} />}
          </span>
          <span className={i < 3 ? 'text-on-forest/60 line-through' : ''}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const CertificateIllustration = () => (
  <div className="rounded-2xl bg-[#f6f2e8] p-5 text-coal shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
    <div className="rounded-xl border border-coal/15 p-5 text-center">
      <Award size={22} className="mx-auto text-[#cf5a31]" />
      <p className="mt-3 font-mono text-[0.6rem] tracking-[0.2em] uppercase opacity-60">Certificate of completion</p>
      <p className="mt-2 font-display text-2xl italic">Alex Morgan</p>
      <p className="mt-1 text-xs opacity-70">SQL & Analytics Engineering</p>
      <div className="mx-auto mt-4 h-px w-24 bg-coal/20" />
      <p className="mt-2 font-mono text-[0.55rem] opacity-50">EDU-7F3A-19C2-B04E</p>
    </div>
  </div>
);

const steps = [
  {
    title: 'Choose a direction',
    text: 'Start from a career path or a single course. Every course lists exactly what you will build and what you need first.',
    visual: PathsIllustration,
  },
  {
    title: 'Learn in short lessons',
    text: 'Lessons average twelve minutes. Change the playback speed, take notes that save as you type, and pick up where you left off.',
    visual: PlayerIllustration,
  },
  {
    title: 'Build the real thing',
    text: 'Each module ends in a project with a clear brief and checklist, then a walkthrough of how the instructor approached it.',
    visual: ProjectIllustration,
  },
  {
    title: 'Earn proof you can show',
    text: 'Finish every lesson and the knowledge check to unlock a certificate with a unique verification ID.',
    visual: CertificateIllustration,
  },
];

// Desktop: the section pins and the steps scroll sideways. Mobile: a simple vertical stack.
const HowItWorks = () => {
  const root = useRef(null);
  const track = useRef(null);
  const ready = usePageReady();

  useGSAP(() => {
    if (!ready || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.to('.hiw-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      });
      gsap.utils.toArray('.hiw-visual').forEach((el) => {
        gsap.from(el, {
          rotate: 6,
          y: 60,
          ease: 'none',
          scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} className="relative overflow-hidden bg-forest text-on-forest lg:h-svh">
      <div className="flex h-full flex-col">
        <div className="shell flex items-end justify-between gap-6 pt-20 lg:pt-24">
          <div>
            <SectionLabel index="03" light>
              How it works
            </SectionLabel>
            <h2 className="display-md mt-5 max-w-2xl">
              Four steps from <span className="italic text-lime">curious</span> to capable.
            </h2>
          </div>
          <div className="hidden w-64 lg:block">
            <div className="h-px w-full bg-on-forest/15">
              <div className="hiw-progress h-px w-full origin-left scale-x-0 bg-lime" />
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex lg:items-center">
          <div
            ref={track}
            className="flex flex-col gap-6 px-[clamp(1rem,4vw,3rem)] py-14 lg:w-max lg:flex-row lg:gap-8 lg:py-0"
          >
            {steps.map((step, i) => {
              const Visual = step.visual;
              return (
                <article
                  key={step.title}
                  className="grid gap-8 rounded-[28px] border border-on-forest/12 bg-forest-2/40 p-6 sm:p-8 lg:h-[min(60vh,520px)] lg:w-[min(78vw,880px)] lg:grid-cols-2 lg:p-10"
                >
                  <div className="flex flex-col justify-between">
                    <span className="font-display text-[clamp(4rem,8vw,7.5rem)] leading-none tracking-[-0.05em] text-on-forest/20">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">{step.title}</h3>
                      <p className="mt-4 max-w-sm leading-relaxed text-on-forest/70">{step.text}</p>
                    </div>
                  </div>
                  <div className="hiw-visual self-center">
                    <Visual />
                  </div>
                </article>
              );
            })}
            <div className="hidden w-[10vw] shrink-0 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
