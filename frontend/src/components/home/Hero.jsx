import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Flame, Play } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, isFinePointer } from '../../lib/gsap';
import { usePageReady } from '../../context/TransitionContext';
import { useAuth } from '../../hooks/useAuth';
import { courses, getCourse } from '../../data/courses';
import CourseCover from '../course/CourseCover';
import Button from '../ui/Button';
import Magnetic from '../ui/Magnetic';
import { ProgressBar } from '../ui/Progress';

const chipCourses = [13, 1, 9, 3].map((id) => getCourse(id));
const featured = getCourse(13);

const Hero = () => {
  const root = useRef(null);
  const ready = usePageReady();
  const navigate = useNavigate();
  const { isAuthenticated, loginDemo } = useAuth();

  const tryDemo = () => {
    if (!isAuthenticated) loginDemo();
    navigate('/dashboard');
  };

  useGSAP(() => {
    if (!ready) return undefined;
    const reduced = prefersReducedMotion();

    if (!reduced) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from('.hero-line', { yPercent: 110, duration: 1.3, stagger: 0.1, ease: 'expo.out' })
        .from('.hero-chip', { width: 0, duration: 1.2, ease: 'expo.inOut' }, 0.35)
        .from('.hero-fade', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.55)
        .from('.hero-card', {
          autoAlpha: 0,
          y: 80,
          rotate: (i) => [-8, 6, -4][i],
          duration: 1.4,
          stagger: 0.12,
          ease: 'expo.out',
        }, 0.45);

      // Covers inside the headline pill rotate on a loop
      gsap.timeline({ repeat: -1, delay: 2 })
        .to('.chip-track', { yPercent: -25, duration: 0.9, ease: 'expo.inOut' }, '+=1.2')
        .to('.chip-track', { yPercent: -50, duration: 0.9, ease: 'expo.inOut' }, '+=1.2')
        .to('.chip-track', { yPercent: -75, duration: 0.9, ease: 'expo.inOut' }, '+=1.2')
        .set('.chip-track', { yPercent: 0 }, '+=1.2');

      // Gentle idle float
      gsap.utils.toArray('.hero-float').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });

      // Headline drifts up slower than the page
      gsap.to('.hero-title', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-cards', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    if (reduced || !isFinePointer()) return undefined;

    // Cards lean toward the pointer
    const cards = gsap.utils.toArray('.hero-parallax');
    const setters = cards.map((card) => ({
      x: gsap.quickTo(card, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(card, 'y', { duration: 1.2, ease: 'power3' }),
      depth: Number(card.dataset.depth || 20),
    }));
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setters.forEach((s) => {
        s.x(nx * s.depth);
        s.y(ny * s.depth);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:min-h-[100svh] lg:pb-10">
      <div className="shell relative">
        <div className="hero-fade flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow flex items-center gap-3 text-ink-3">
            <span className="text-ink">(EL)</span>
            <span className="h-px w-8 bg-line-strong" />
            An online school for people who make things
          </p>
          <p className="eyebrow flex items-center gap-2 text-ink-3">
            <span className="size-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-clay" />
            Autumn term 2026, enrolment open
          </p>
        </div>

        <h1 className="hero-title display-xl relative z-10 mt-10 sm:mt-14">
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="hero-line inline-block">Learn by</span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span className="hero-line inline-flex items-center gap-[0.18em]">
              <span
                className="hero-chip relative inline-block h-[0.72em] w-[1.55em] shrink-0 overflow-hidden rounded-full align-middle"
                aria-hidden="true"
              >
                <span className="chip-track absolute inset-x-0 top-0 flex h-[400%] flex-col">
                  {chipCourses.map((c) => (
                    <CourseCover key={c.id} course={c} size="sm" className="h-1/4 w-full [&>div]:hidden" />
                  ))}
                </span>
              </span>
              <span className="italic">building</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line inline-block">
              real things<span className="text-clay">.</span>
            </span>
          </span>
        </h1>

        <div className="relative z-10 mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="hero-fade max-w-md text-lg leading-relaxed text-ink-2">
              Project-led courses in engineering, data, design and product. Taught by practitioners, paced by you, and
              built so the skill is still there a year from now.
            </p>
            <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button to="/courses" size="lg" icon={ArrowRight}>
                  Explore {courses.length} courses
                </Button>
              </Magnetic>
              <Button variant="outline" size="lg" iconLeft={Play} onClick={tryDemo}>
                {isAuthenticated ? 'Open your dashboard' : 'Try the live demo'}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="hero-fade mt-5 text-sm text-ink-3">
                No sign-up needed for the demo. It opens a sample learner account with real progress.
              </p>
            )}
          </div>
        </div>

        {/* Floating product cards */}
        <div
          className="hero-cards pointer-events-none relative mt-14 h-[400px] sm:h-[440px] lg:absolute lg:top-10 lg:right-[clamp(1rem,4vw,3rem)] lg:mt-0 lg:h-[620px] lg:w-[46%] xl:w-[42%]"
          aria-hidden="true"
        >
          <div className="hero-parallax absolute top-[2%] left-[18%] w-[58%] max-w-[300px] lg:top-[8%] lg:left-[24%]" data-depth="34">
            <div className="hero-card hero-float rotate-[4deg] overflow-hidden rounded-3xl bg-card shadow-soft">
              <CourseCover course={featured} showTitle className="aspect-[4/5]" />
            </div>
          </div>

          <div className="hero-parallax absolute top-[68%] right-0 w-[64%] max-w-[320px] lg:top-[62%] lg:right-0" data-depth="18">
            <div className="hero-card hero-float -rotate-[3deg] rounded-3xl border border-line bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-ink-3">Continue</span>
                <span className="font-mono text-xs text-ink-3">64%</span>
              </div>
              <p className="mt-3 font-display text-lg leading-tight">Timelines with GSAP</p>
              <p className="mt-1 text-sm text-ink-3">Lesson 9 of 14 / Motion Design</p>
              <ProgressBar value={64} className="mt-4" tone="ink" />
            </div>
          </div>

          <div className="hero-parallax absolute top-[30%] left-0 lg:top-[34%] lg:left-[2%]" data-depth="48">
            <div className="hero-card hero-float flex -rotate-[6deg] items-center gap-3 rounded-full bg-lime py-2.5 pr-5 pl-2.5 text-coal shadow-soft">
              <span className="grid size-9 place-items-center rounded-full bg-coal text-lime">
                <Flame size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-tight">12 day streak</span>
                <span className="block text-xs opacity-70">Weekly goal reached</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-fade relative z-10 mt-12 flex items-end justify-between border-t border-line pt-5 lg:mt-24">
          <div className="flex gap-8 text-sm text-ink-2 sm:gap-12">
            <span>
              <span className="font-display text-2xl text-ink">4.8</span> average rating
            </span>
            <span className="hidden sm:inline">
              <span className="font-display text-2xl text-ink">2.5M</span> learners
            </span>
            <span>
              <span className="font-display text-2xl text-ink">30-day</span> refunds
            </span>
          </div>
          <span className="eyebrow hidden items-center gap-2 text-ink-3 md:flex">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-ink" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
