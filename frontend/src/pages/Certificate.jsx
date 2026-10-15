import { useRef } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Printer, Link2, Lock } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { getCourse } from '../data/courses';
import { getInstructor } from '../data/instructors';
import { LogoMark } from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { ProgressBar } from '../components/ui/Progress';
import NotFound from './NotFound';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate, formatHours } from '../lib/format';

const Certificate = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const root = useRef(null);
  const { user } = useAuth();
  const { certificateFor, getProgress } = useLearning();
  const toast = useToast();
  usePageTitle(course ? `Certificate: ${course.title}` : 'Certificate');

  const certificate = course ? certificateFor(course.id) : null;

  useGSAP(() => {
    if (prefersReducedMotion() || !certificate) return;
    gsap.from('.cert-sheet', { autoAlpha: 0, y: 60, rotateX: 12, duration: 1.4, ease: 'expo.out', delay: 0.15 });
    gsap.from('.cert-line', { scaleX: 0, duration: 1.2, ease: 'expo.inOut', stagger: 0.1, delay: 0.5 });
    gsap.from('.cert-seal', { rotate: -90, scale: 0.4, autoAlpha: 0, duration: 1.4, ease: 'back.out(1.6)', delay: 0.8 });
  }, { scope: root, dependencies: [Boolean(certificate)] });

  if (!course) return <NotFound />;

  if (!certificate) {
    const progress = getProgress(course.id);
    return (
      <div className="grid min-h-dvh place-items-center px-5">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink/6">
            <Lock size={22} />
          </span>
          <h1 className="mt-6 font-display text-4xl tracking-[-0.03em]">Certificate locked</h1>
          <p className="mt-3 text-ink-2">Complete every lesson and the final knowledge check in {course.title} to unlock it.</p>
          <div className="mt-8 text-left">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-ink-2">{progress.count} of {progress.total} lessons</span>
              <span className="font-mono">{progress.percent}%</span>
            </div>
            <ProgressBar value={progress.percent} />
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button to={`/learn/${course.slug}`}>Continue course</Button>
            <Button to="/dashboard" variant="outline">
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const instructor = getInstructor(course.instructor);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/certificate/${course.slug}?id=${certificate.id}`);
      toast({ title: 'Link copied', description: `Verification ID ${certificate.id}`, tone: 'info' });
    } catch {
      toast({ title: 'Could not copy the link', tone: 'error' });
    }
  };

  return (
    <div ref={root} className="min-h-dvh bg-paper-2/60 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3" data-print-hide>
        <Button to="/dashboard?tab=completed" variant="ghost" size="sm" iconLeft={ArrowLeft}>
          Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" iconLeft={Link2} onClick={copyLink}>
            Copy link
          </Button>
          <Button size="sm" iconLeft={Printer} onClick={() => window.print()}>
            Print or save PDF
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl [perspective:1600px]">
        <article
          data-print-area
          className="cert-sheet relative mx-auto aspect-[1.414] w-full overflow-hidden rounded-xl bg-[#f7f3ea] text-[#161614] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
        >
          {/* Border ornament */}
          <div className="absolute inset-[2.2%] rounded-md border border-[#161614]/20" />
          <div className="absolute inset-[3.2%] rounded-sm border border-[#161614]/10" />
          <svg viewBox="0 0 400 400" className="absolute -right-[8%] -bottom-[20%] w-[46%] opacity-[0.12]" aria-hidden="true">
            {[60, 110, 160, 210, 260, 310].map((r) => (
              <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="#173528" strokeWidth="16" />
            ))}
          </svg>

          <div className="absolute inset-[7%] flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-[1.2cqw] [container-type:inline-size]">
                <LogoMark className="size-[clamp(1.5rem,3.4vw,2.6rem)]" />
                <span className="font-display text-[clamp(1rem,2.4vw,1.9rem)] tracking-[-0.04em]">
                  Edu<span className="italic">Learn</span>
                </span>
              </div>
              <p className="text-right font-mono text-[clamp(0.45rem,0.95vw,0.75rem)] tracking-[0.18em] uppercase opacity-60">
                Certificate of completion
                <br />
                No. {certificate.id}
              </p>
            </div>

            <div className="mt-auto">
              <p className="font-mono text-[clamp(0.5rem,1vw,0.8rem)] tracking-[0.2em] uppercase opacity-60">This certifies that</p>
              <h1 className="mt-[1.5%] font-display text-[clamp(2rem,7.2vw,6rem)] leading-[0.95] tracking-[-0.045em] italic">{user?.name}</h1>
              <div className="cert-line mt-[2.5%] h-px w-full origin-left bg-[#161614]/25" />
              <p className="mt-[2.5%] max-w-[80%] text-[clamp(0.7rem,1.55vw,1.25rem)] leading-snug">
                has completed all {course.lessonCount} lessons, {course.projectCount} project{course.projectCount === 1 ? '' : 's'} and the final knowledge check
                of <span className="font-display italic">{course.title}</span> ({formatHours(course.totalMinutes)} of study).
              </p>
            </div>

            <div className="mt-auto flex items-end justify-between gap-6 pt-[4%]">
              <div className="flex gap-[6%] [flex:1]">
                <div className="min-w-0">
                  <p className="font-display text-[clamp(1rem,2.4vw,2rem)] leading-none italic">{instructor.name}</p>
                  <div className="cert-line mt-[8%] h-px w-full origin-left bg-[#161614]/40" />
                  <p className="mt-[6%] font-mono text-[clamp(0.42rem,0.85vw,0.7rem)] tracking-[0.14em] uppercase opacity-60">Instructor</p>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[clamp(1rem,2.4vw,2rem)] leading-none">{formatDate(certificate.at, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <div className="cert-line mt-[8%] h-px w-full origin-left bg-[#161614]/40" />
                  <p className="mt-[6%] font-mono text-[clamp(0.42rem,0.85vw,0.7rem)] tracking-[0.14em] uppercase opacity-60">Date issued</p>
                </div>
              </div>
              <div className="cert-seal grid aspect-square w-[14%] shrink-0 place-items-center rounded-full bg-[#173528] text-[#d4f36a]">
                <svg viewBox="0 0 100 100" className="size-full p-[6%]" aria-hidden="true">
                  <defs>
                    <path id="seal-circle" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                  </defs>
                  <text fontSize="8.5" letterSpacing="2.6" fill="currentColor" fontFamily="Geist Mono Variable, monospace">
                    <textPath href="#seal-circle">VERIFIED / EDULEARN / VERIFIED / EDULEARN /</textPath>
                  </text>
                  <path d="M38 51l8 8 17-18" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </article>
        <p className="mt-6 text-center text-sm text-ink-3" data-print-hide>
          Verify at edulearn-rm.vercel.app with ID <span className="font-mono text-ink">{certificate.id}</span>
        </p>
      </div>
    </div>
  );
};

export default Certificate;
