import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Captions, Maximize2 } from 'lucide-react';
import clsx from 'clsx';
import CourseCover from './CourseCover';
import { getCategory } from '../../data/categories';
import { pad } from '../../lib/format';

// Playback is simulated: a full lesson plays back in REAL_SECONDS at 1x
const REAL_SECONDS = 24;
const speeds = [1, 1.25, 1.5, 2];

const captionsFor = (course, lesson) => [
  `Welcome back. In this lesson we are looking at ${lesson.title.toLowerCase()}.`,
  `This builds directly on the previous section of ${course.title}, so keep your project open.`,
  'First, the mental model. Then we will write it out step by step, and break it on purpose.',
  'Pause whenever you want to try something yourself. That is where most of the learning happens.',
  'Notice how small this change is, and how much it simplifies everything that comes after it.',
  'Before the next lesson, write down one question you still have. We will come back to it.',
];

const clock = (seconds) => `${pad(Math.floor(seconds / 60))}:${pad(Math.floor(seconds % 60))}`;

const FauxPlayer = ({ course, lesson, lessonLabel, onComplete, className }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const completed = useRef(false);
  const frame = useRef(null);
  const last = useRef(null);
  const stage = useRef(null);
  const palette = getCategory(course.category).palette;
  const total = lesson.duration * 60;
  const captions = captionsFor(course, lesson);
  const caption = captions[Math.min(captions.length - 1, Math.floor(progress * captions.length))];

  useEffect(() => {
    if (!playing) return undefined;
    const tick = (now) => {
      if (last.current !== null) {
        const delta = (now - last.current) / 1000;
        setProgress((p) => Math.min(1, p + (delta * speed) / REAL_SECONDS));
      }
      last.current = now;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      last.current = null;
    };
  }, [playing, speed]);

  useEffect(() => {
    if (progress >= 1 && !completed.current) {
      completed.current = true;
      setPlaying(false);
      onComplete?.();
    }
  }, [progress, onComplete]);

  const toggle = () => {
    if (progress >= 1) {
      setProgress(0);
      completed.current = false;
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  };

  const onKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'ArrowRight') {
      setProgress((p) => Math.min(1, p + 10 / total));
    } else if (e.key === 'ArrowLeft') {
      setProgress((p) => Math.max(0, p - 10 / total));
    }
  };

  return (
    <div
      ref={stage}
      className={clsx('group/player relative overflow-hidden rounded-2xl bg-coal text-cream outline-none', className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Video player: ${lesson.title}`}
    >
      <div className="relative aspect-video">
        <div
          className={clsx(
            'absolute inset-0 transition-all duration-[1.2s] ease-out-expo',
            playing ? 'scale-110 opacity-45 blur-[2px]' : 'scale-100 opacity-80'
          )}
        >
          <CourseCover course={course} className="size-full [&>div]:hidden" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,18,0.1),rgba(20,20,18,0.85))]" />

        <button type="button" onClick={toggle} className="absolute inset-0 flex flex-col items-start justify-end p-5 text-left sm:p-8" aria-label={playing ? 'Pause' : 'Play'}>
          <span className="eyebrow text-cream/60">{lessonLabel}</span>
          <span className="mt-2 max-w-xl font-display text-[clamp(1.4rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.03em]">
            {lesson.title}
          </span>
        </button>

        <span
          className={clsx(
            'pointer-events-none absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-all duration-500 ease-out-expo',
            playing ? 'scale-75 opacity-0 group-hover/player:scale-90 group-hover/player:opacity-100' : 'scale-100 opacity-100'
          )}
          style={{ backgroundColor: palette.fg === '#161614' ? '#d4f36a' : palette.fg, color: '#161614' }}
        >
          {playing ? <Pause size={26} fill="currentColor" /> : progress >= 1 ? <RotateCcw size={26} /> : <Play size={26} fill="currentColor" className="ml-1" />}
        </span>

        {playing && (
          <span className="pointer-events-none absolute top-4 left-4 flex items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] animate-[pulse-dot_0.9s_ease-in-out_infinite] rounded-full bg-lime"
                style={{ height: 8 + (i % 2) * 8, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}

        {showCaptions && progress > 0 && (
          <p className="pointer-events-none absolute inset-x-6 bottom-24 mx-auto max-w-2xl text-center text-sm sm:bottom-28 sm:text-base">
            <span className="rounded-md bg-coal/80 px-2 py-1 leading-loose [box-decoration-break:clone]">{caption}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
        <button type="button" onClick={toggle} className="grid size-9 shrink-0 place-items-center rounded-full transition hover:bg-cream/10" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="w-24 shrink-0 font-mono text-[0.7rem] text-cream/70 tabular-nums">
          {clock(progress * total)} / {clock(total)}
        </span>
        <div
          className="group/seek relative h-6 flex-1 cursor-pointer"
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={-1}
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cream/15 transition-[height] group-hover/seek:h-1.5">
            <div className="h-full rounded-full bg-lime" style={{ width: `${progress * 100}%` }} />
          </div>
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime opacity-0 transition-opacity group-hover/seek:opacity-100"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setSpeed((s) => speeds[(speeds.indexOf(s) + 1) % speeds.length])}
          className="w-12 shrink-0 rounded-md py-1 font-mono text-[0.7rem] transition hover:bg-cream/10"
          aria-label={`Playback speed ${speed}x`}
        >
          {speed}x
        </button>
        <button
          type="button"
          onClick={() => setShowCaptions((v) => !v)}
          className={clsx('hidden size-9 shrink-0 place-items-center rounded-full transition hover:bg-cream/10 sm:grid', showCaptions ? 'text-lime' : 'text-cream/60')}
          aria-pressed={showCaptions}
          aria-label="Toggle captions"
        >
          <Captions size={17} />
        </button>
        <button
          type="button"
          onClick={() => stage.current?.requestFullscreen?.()}
          className="hidden size-9 shrink-0 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 sm:grid"
          aria-label="Full screen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default FauxPlayer;
