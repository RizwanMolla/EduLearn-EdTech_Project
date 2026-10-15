import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { useLenis } from 'lenis/react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, PanelLeftClose, PanelLeftOpen, Award, NotebookPen,
  FileDown, Info, X,
} from 'lucide-react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { getCourse } from '../data/courses';
import { getInstructor } from '../data/instructors';
import FauxPlayer from '../components/course/FauxPlayer';
import Quiz from '../components/course/Quiz';
import { lessonIcons, lessonTypeLabel } from '../components/course/lessonMeta';
import { LogoMark } from '../components/ui/Logo';
import { ProgressRing } from '../components/ui/Progress';
import Button from '../components/ui/Button';
import { ThemeToggle } from '../components/layout/Navbar';
import NotFound from './NotFound';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatMinutes } from '../lib/format';

const ReadingLesson = ({ course, lesson }) => (
  <article className="prose-edu rounded-3xl border border-line bg-card p-6 sm:p-10">
    <p className="eyebrow text-ink-3">Reading / {formatMinutes(lesson.duration)}</p>
    <h2 className="!mt-4">{lesson.title}</h2>
    <p>
      This reading accompanies <strong>{course.title}</strong>. It slows down on one idea that the video lessons move
      through quickly, so you can build a sturdier mental model before the next project.
    </p>
    <p>
      Read it once without taking notes. Then read it again and write down, in your own words, the one sentence you
      would use to explain {lesson.title.toLowerCase()} to a friend. If you cannot write that sentence yet, that is the
      part to revisit.
    </p>
    <blockquote>Understanding is the ability to explain something simply, not the ability to recognise it.</blockquote>
    <h3>Key ideas</h3>
    <ul>
      <li>Start from the problem the idea solves, not from its definition.</li>
      <li>Find the smallest example that shows the idea working, then change one thing at a time.</li>
      <li>Connect it to something you already know from an earlier section.</li>
    </ul>
    <p>
      When you are done, mark the lesson complete and use the notes tab to keep your one-sentence summary. You will
      see it again when you review the course.
    </p>
  </article>
);

const ProjectLesson = ({ lesson, done, onSubmit }) => {
  const steps = ['Read the brief and sketch your approach', 'Build the smallest version that works', 'Refine, then test the edge cases', 'Write a short note on your trade-offs'];
  const [checked, setChecked] = useState(() => (done ? steps.map((_, i) => i) : []));
  const ready = checked.length === steps.length;
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card">
      <div className="bg-forest p-6 text-on-forest sm:p-10">
        <p className="eyebrow text-on-forest/60">Project brief / about {formatMinutes(lesson.duration)}</p>
        <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.75rem)] leading-tight tracking-[-0.03em]">{lesson.title}</h2>
        <p className="mt-4 max-w-2xl text-on-forest/75">
          Apply everything from this section in one focused build. Aim for something that works end to end before
          making it beautiful. When you finish, compare your approach with the walkthrough.
        </p>
      </div>
      <div className="p-6 sm:p-10">
        <p className="eyebrow text-ink-3">Checklist</p>
        <ul className="mt-4 space-y-2">
          {steps.map((step, i) => {
            const on = checked.includes(i);
            return (
              <li key={step}>
                <button
                  type="button"
                  onClick={() => setChecked((list) => (on ? list.filter((x) => x !== i) : [...list, i]))}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-ink/4"
                  aria-pressed={on}
                >
                  <span className={clsx('grid size-6 shrink-0 place-items-center rounded-lg border transition-colors', on ? 'border-ink bg-ink text-paper' : 'border-line-strong')}>
                    {on && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span className={clsx(on && 'text-ink-3 line-through')}>{step}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button onClick={onSubmit} disabled={!ready || done} icon={done ? Check : ArrowRight}>
            {done ? 'Project submitted' : 'Submit project'}
          </Button>
          {!ready && !done && <p className="text-sm text-ink-3">Tick off every step to submit.</p>}
        </div>
      </div>
    </div>
  );
};

const Learn = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  usePageTitle(course ? `Learning: ${course.title}` : 'Course not found');
  if (!course) return <NotFound />;
  return <Classroom key={course.id} course={course} />;
};

const Classroom = ({ course }) => {
  const root = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const lenis = useLenis();
  const [params, setParams] = useSearchParams();
  const { isEnrolled, enroll, getProgress, setLessonComplete, setLastLesson, saveNote, saveQuiz, data, certificateFor } = useLearning();
  const [sidebar, setSidebar] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [tab, setTab] = useState('notes');

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const instructor = getInstructor(course.instructor);
  const certificate = certificateFor(course.id);

  const lessonId = useMemo(() => {
    const requested = params.get('lesson');
    if (requested && course.lessons.some((l) => l.id === requested)) return requested;
    if (progress.last && course.lessons.some((l) => l.id === progress.last)) return progress.last;
    return (course.lessons.find((l) => !progress.done.includes(l.id)) || course.lessons[0]).id;
  }, [params, course, progress.last, progress.done]);

  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const lesson = course.lessons[lessonIndex];
  const sectionIndex = Number(lesson.id.split('-')[0]);
  const section = course.curriculum[sectionIndex];
  const prev = course.lessons[lessonIndex - 1];
  const next = course.lessons[lessonIndex + 1];
  const done = progress.done.includes(lesson.id);
  const note = data.notes[String(course.id)]?.[lesson.id] || '';
  const [draft, setDraft] = useState(note);
  const [savedAt, setSavedAt] = useState(null);
  const [draftFor, setDraftFor] = useState(lesson.id);

  // Reset the notes draft when switching lessons (derived during render)
  if (draftFor !== lesson.id) {
    setDraftFor(lesson.id);
    setDraft(note);
    setSavedAt(null);
  }

  useEffect(() => {
    if (enrolled) setLastLesson(course.id, lesson.id);
  }, [enrolled, course.id, lesson.id, setLastLesson]);

  // Debounced autosave of notes
  useEffect(() => {
    if (draft === note) return undefined;
    const timer = setTimeout(() => {
      saveNote(course.id, lesson.id, draft);
      setSavedAt(new Date());
    }, 600);
    return () => clearTimeout(timer);
  }, [draft, note, course.id, lesson.id, saveNote]);

  const goTo = useCallback((id) => {
    setParams({ lesson: id }, { replace: false, preventScrollReset: true });
    setMobileSidebar(false);
    if (lenis) lenis.scrollTo(0, { duration: 0.9 });
    else window.scrollTo({ top: 0 });
  }, [setParams, lenis]);

  const complete = useCallback((silent = false) => {
    setLessonComplete(course.id, lesson.id, true);
    const willFinish = !done && progress.count + 1 === course.lessonCount;
    if (willFinish) {
      toast({ title: 'Course complete', description: 'Your certificate is ready.', duration: 6000 });
    } else if (!silent) {
      toast({ title: 'Lesson complete', description: next ? `Up next: ${next.title}` : undefined });
    }
  }, [course.id, course.lessonCount, lesson.id, done, progress.count, next, setLessonComplete, toast]);

  // Keyboard: Alt + arrow keys move between lessons
  useEffect(() => {
    const onKey = (e) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowRight' && next) goTo(next.id);
      if (e.key === 'ArrowLeft' && prev) goTo(prev.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo]);

  useGSAP(() => {
    if (prefersReducedMotion() || !contentRef.current) return;
    gsap.from(contentRef.current, { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out' });
  }, { dependencies: [lesson.id], scope: root });

  if (!enrolled) {
    return (
      <div className="grid min-h-dvh place-items-center px-5">
        <div className="max-w-md text-center">
          <LogoMark className="mx-auto size-12" />
          <h1 className="mt-6 font-display text-4xl tracking-[-0.03em]">You are not enrolled in this course yet</h1>
          <p className="mt-3 text-ink-2">{course.title} is waiting for you. Enrol to unlock every lesson, project and the certificate.</p>
          <div className="mt-8 flex justify-center gap-3">
            {course.price === 0 ? (
              <Button onClick={() => enroll(course.id)}>Enroll for free</Button>
            ) : (
              <Button to={`/courses/${course.slug}`}>View course</Button>
            )}
            <Button to="/dashboard" variant="outline">
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const Curriculum = (
    <div className="p-3">
      {course.curriculum.map((sec, s) => {
        const secDone = sec.lessons.filter((l) => progress.done.includes(l.id)).length;
        return (
          <div key={sec.title} className="mb-2">
            <div className="flex items-baseline justify-between gap-3 px-3 pt-4 pb-2">
              <p className="text-sm font-medium">
                <span className="mr-2 font-mono text-xs text-ink-3">{String(s + 1).padStart(2, '0')}</span>
                {sec.title}
              </p>
              <span className="shrink-0 font-mono text-[0.65rem] text-ink-3">
                {secDone}/{sec.lessons.length}
              </span>
            </div>
            <ul>
              {sec.lessons.map((l) => {
                const isDone = progress.done.includes(l.id);
                const isActive = l.id === lesson.id;
                const Icon = lessonIcons[l.type];
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => goTo(l.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={clsx(
                        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-[0.875rem] transition-colors',
                        isActive ? 'bg-ink text-paper' : 'hover:bg-ink/5'
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 size={16} className={isActive ? 'text-lime' : 'text-success'} />
                        ) : (
                          <Circle size={16} className={isActive ? 'text-paper/50' : 'text-ink-3'} />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block leading-snug">{l.title}</span>
                        <span className={clsx('mt-1 flex items-center gap-1.5 text-xs', isActive ? 'text-paper/60' : 'text-ink-3')}>
                          <Icon size={12} /> {lessonTypeLabel[l.type]} / {formatMinutes(l.duration)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={root} className="min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl" data-print-hide>
        <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
          <Link to={`/courses/${course.slug}`} className="flex items-center gap-2.5 rounded-full py-1.5 pr-3 pl-1.5 text-sm transition hover:bg-ink/6">
            <LogoMark className="size-8" />
            <ArrowLeft size={15} className="hidden sm:block" />
            <span className="hidden sm:block">Course page</span>
          </Link>
          <span className="hidden h-6 w-px bg-line md:block" />
          <p className="hidden min-w-0 flex-1 truncate font-display text-lg md:block">{course.title}</p>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2.5 pr-2">
              <ProgressRing value={progress.percent} size={34} stroke={3.5}>
                <span className="text-[0.55rem] font-semibold">{progress.percent}</span>
              </ProgressRing>
              <span className="hidden text-sm text-ink-2 lg:block">
                {progress.count} of {progress.total} complete
              </span>
            </div>
            {certificate && (
              <Button to={`/certificate/${course.slug}`} size="sm" variant="lime" iconLeft={Award} className="hidden sm:inline-flex">
                Certificate
              </Button>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => (window.innerWidth >= 1024 ? setSidebar((v) => !v) : setMobileSidebar(true))}
              className="grid size-10 place-items-center rounded-full transition hover:bg-ink/6"
              aria-label="Toggle course contents"
            >
              {sidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-ink/8">
          <div className="h-full bg-lime transition-[width] duration-1000 ease-out-expo" style={{ width: `${progress.percent}%` }} />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            'sticky top-[66px] hidden h-[calc(100dvh-66px)] shrink-0 overflow-y-auto border-r border-line transition-[width,opacity] duration-500 ease-out-expo lg:block',
            sidebar ? 'w-[340px] opacity-100' : 'w-0 opacity-0'
          )}
          data-lenis-prevent
          aria-label="Course contents"
        >
          <div className="w-[340px]">{Curriculum}</div>
        </aside>

        {/* Lesson */}
        <main className="min-w-0 flex-1 px-4 pt-8 pb-28 sm:px-8 lg:px-12">
          <div ref={contentRef} className="mx-auto max-w-4xl">
            <p className="eyebrow text-ink-3">
              Section {sectionIndex + 1}: {section.title}
            </p>

            {progress.percent === 100 && (
              <div className="mt-5 flex flex-col gap-4 rounded-3xl bg-lime p-5 text-coal sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full bg-coal text-lime">
                    <Award size={20} />
                  </span>
                  <div>
                    <p className="font-medium">You completed this course</p>
                    <p className="text-sm opacity-70">Your certificate has a unique verification ID.</p>
                  </div>
                </div>
                <Button to={`/certificate/${course.slug}`} size="sm" className="!bg-coal !text-cream">
                  View certificate
                </Button>
              </div>
            )}

            <div className="mt-5">
              {lesson.type === 'video' && (
                <FauxPlayer
                  key={lesson.id}
                  course={course}
                  lesson={lesson}
                  lessonLabel={`Lesson ${lessonIndex + 1} of ${course.lessonCount}`}
                  onComplete={() => !done && complete()}
                />
              )}
              {lesson.type === 'reading' && <ReadingLesson course={course} lesson={lesson} />}
              {lesson.type === 'project' && <ProjectLesson key={lesson.id} lesson={lesson} done={done} onSubmit={() => complete()} />}
              {lesson.type === 'quiz' && (
                <Quiz
                  key={lesson.id}
                  course={course}
                  best={data.quiz[String(course.id)]}
                  onPass={(score, total) => {
                    saveQuiz(course.id, score, total);
                    if (!done) complete(true);
                  }}
                />
              )}
            </div>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[-0.03em]">{lesson.title}</h1>
                <p className="mt-2 text-sm text-ink-3">
                  {lessonTypeLabel[lesson.type]} / {formatMinutes(lesson.duration)} / {instructor.name}
                </p>
              </div>
              {lesson.type !== 'quiz' && (
                <button
                  type="button"
                  onClick={() => (done ? setLessonComplete(course.id, lesson.id, false) : complete())}
                  className={clsx(
                    'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-medium transition',
                    done ? 'border-success bg-success/10 text-success' : 'border-line-strong hover:border-ink'
                  )}
                >
                  {done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                  {done ? 'Completed' : 'Mark as complete'}
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-10 border-b border-line" role="tablist">
              {[
                { id: 'notes', label: 'Notes', icon: NotebookPen },
                { id: 'overview', label: 'About this lesson', icon: Info },
                { id: 'resources', label: 'Resources', icon: FileDown },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={clsx(
                    'relative -mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors',
                    tab === id ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink'
                  )}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            <div className="py-8" role="tabpanel">
              {tab === 'notes' && (
                <div>
                  <label htmlFor="lesson-notes" className="sr-only">
                    Notes for this lesson
                  </label>
                  <textarea
                    id="lesson-notes"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={7}
                    placeholder="Write the one sentence you would use to explain this lesson to a friend..."
                    className="field resize-y leading-relaxed"
                  />
                  <p className="mt-2 text-xs text-ink-3">
                    {savedAt ? `Saved at ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Notes save automatically as you type.'}
                  </p>
                </div>
              )}
              {tab === 'overview' && (
                <div className="max-w-2xl space-y-4 leading-relaxed text-ink-2">
                  <p>
                    This {lessonTypeLabel[lesson.type].toLowerCase()} is part of <span className="text-ink">{section.title}</span>, section{' '}
                    {sectionIndex + 1} of {course.curriculum.length} in {course.title}.
                  </p>
                  <p>
                    Expect to spend about {formatMinutes(lesson.duration)} here, plus time to try things yourself. Use
                    Alt + Left and Alt + Right to move between lessons.
                  </p>
                </div>
              )}
              {tab === 'resources' && (
                <ul className="max-w-xl divide-y divide-line rounded-2xl border border-line">
                  {['Lesson slides (PDF)', 'Starter files', 'Further reading list'].map((r) => (
                    <li key={r} className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm">
                      <span className="flex items-center gap-3">
                        <FileDown size={16} className="text-ink-3" /> {r}
                      </span>
                      <span className="eyebrow text-ink-3">Demo</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Prev / next */}
            <div className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <button type="button" onClick={() => goTo(prev.id)} className="group rounded-2xl border border-line p-5 text-left transition hover:border-ink">
                  <span className="eyebrow flex items-center gap-2 text-ink-3">
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> Previous
                  </span>
                  <span className="mt-2 block font-medium">{prev.title}</span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button type="button" onClick={() => goTo(next.id)} className="group rounded-2xl bg-ink p-5 text-left text-paper transition hover:bg-ink/90 sm:text-right">
                  <span className="eyebrow flex items-center gap-2 text-paper/60 sm:justify-end">
                    Next <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block font-medium">{next.title}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(certificate ? `/certificate/${course.slug}` : '/dashboard')}
                  className="rounded-2xl bg-lime p-5 text-left text-coal sm:text-right"
                >
                  <span className="eyebrow opacity-60">End of course</span>
                  <span className="mt-2 block font-medium">{certificate ? 'View your certificate' : 'Back to dashboard'}</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile curriculum drawer */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden" data-lenis-prevent>
          <button type="button" aria-label="Close contents" onClick={() => setMobileSidebar(false)} className="absolute inset-0 animate-[fade-in_0.3s_ease] bg-coal/50" />
          <div className="absolute inset-y-0 right-0 w-[min(360px,90vw)] animate-[pop-in_0.4s_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-display text-xl">Course contents</p>
              <button type="button" onClick={() => setMobileSidebar(false)} className="grid size-9 place-items-center rounded-full border border-line" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            {Curriculum}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
