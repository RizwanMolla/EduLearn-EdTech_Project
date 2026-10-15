import { memo } from 'react';
import clsx from 'clsx';
import { getCategory } from '../../data/categories';
import { seeded } from '../../lib/format';

// Geometric motifs drawn in a 400x400 box; covers slice them to any aspect ratio
const Motif = ({ type, fg, seed }) => {
  const rand = seeded(seed);

  switch (type) {
    case 'arcs':
      return (
        <g fill="none" stroke={fg} strokeWidth="18">
          {[70, 125, 180, 235, 290, 345].map((r) => (
            <circle key={r} cx="400" cy="400" r={r} />
          ))}
        </g>
      );
    case 'grid': {
      const dots = [];
      for (let x = 0; x < 9; x += 1) {
        for (let y = 0; y < 9; y += 1) {
          const big = rand() > 0.82;
          dots.push(<circle key={`${x}-${y}`} cx={40 + x * 40} cy={40 + y * 40} r={big ? 12 : 3.5} fill={fg} />);
        }
      }
      return <g>{dots}</g>;
    }
    case 'stripes':
      return (
        <g>
          <defs>
            <clipPath id={`clip-${seed}`}>
              <circle cx="250" cy="170" r="150" />
            </clipPath>
          </defs>
          <g clipPath={`url(#clip-${seed})`} stroke={fg} strokeWidth="16">
            {Array.from({ length: 16 }, (_, i) => (
              <line key={i} x1={i * 34 - 60} y1="0" x2={i * 34 + 240} y2="400" />
            ))}
          </g>
        </g>
      );
    case 'orbit':
      return (
        <g fill="none" stroke={fg} strokeWidth="2.5">
          <circle cx="250" cy="170" r="130" />
          <ellipse cx="250" cy="170" rx="210" ry="70" transform="rotate(-24 250 170)" />
          <circle cx="250" cy="170" r="54" fill={fg} />
          <circle cx="378" cy="122" r="16" fill={fg} />
        </g>
      );
    case 'blocks':
      return (
        <g fill={fg}>
          {Array.from({ length: 6 }, (_, i) => {
            const w = 120 + rand() * 220;
            return <rect key={i} x={400 - w} y={40 + i * 46} width={w} height="30" rx="15" />;
          })}
        </g>
      );
    case 'wave':
      return (
        <g fill="none" stroke={fg} strokeWidth="12" strokeLinecap="round">
          {Array.from({ length: 6 }, (_, i) => {
            const y = 60 + i * 44;
            const a = 18 + rand() * 18;
            return <path key={i} d={`M-20 ${y} C 60 ${y - a}, 120 ${y + a}, 200 ${y} S 340 ${y - a}, 420 ${y}`} />;
          })}
        </g>
      );
    case 'stairs':
    default:
      return (
        <g fill={fg}>
          <path d="M120 400V320h70v-70h70v-70h70v-70h70v290z" />
          <circle cx="110" cy="110" r="38" fill="none" stroke={fg} strokeWidth="14" />
        </g>
      );
  }
};

const CourseCover = memo(({ course, className, showTitle = false, size = 'md', children }) => {
  const { palette, name } = getCategory(course.category);
  return (
    <div
      className={clsx('relative isolate overflow-hidden', className)}
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 -z-10 size-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
        aria-hidden="true"
      >
        <Motif type={course.motif} fg={palette.fg} seed={course.slug} />
      </svg>

      <div
        className={clsx(
          'flex h-full flex-col justify-between',
          size === 'sm' ? 'p-3' : size === 'lg' ? 'p-5 sm:p-7' : 'p-3 sm:p-4'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={clsx('rounded-full font-mono tracking-[0.12em] uppercase', size === 'sm' ? 'text-[0.55rem]' : 'px-2 py-1 text-[0.65rem]')}
            style={size === 'sm' ? undefined : { backgroundColor: palette.bg }}
          >
            No. {course.number}
          </span>
          {size !== 'sm' && (
            <span className="rounded-full px-2 py-1 font-mono text-[0.65rem] tracking-[0.12em] uppercase" style={{ backgroundColor: palette.bg }}>
              {name}
            </span>
          )}
        </div>
        {showTitle && (
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-3/5"
            style={{ background: `linear-gradient(to top, ${palette.bg} 25%, ${palette.bg}00)` }}
            aria-hidden="true"
          />
        )}
        {showTitle && (
          <p
            className={clsx(
              'font-display leading-[0.95] tracking-[-0.03em]',
              size === 'lg' ? 'text-[clamp(2rem,4vw,3.4rem)]' : 'text-2xl'
            )}
            style={{ maxWidth: '12ch' }}
          >
            {course.title}
          </p>
        )}
        {children}
      </div>
    </div>
  );
});

CourseCover.displayName = 'CourseCover';

export default CourseCover;
