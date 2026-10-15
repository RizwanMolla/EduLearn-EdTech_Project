import { useState } from 'react';
import clsx from 'clsx';
import { todayKey, formatMinutes } from '../../lib/format';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Sequential scale: one hue (forest in light mode, lime in dark mode), light to dark by minutes
const level = (minutes) => {
  if (!minutes) return 0;
  if (minutes < 20) return 1;
  if (minutes < 40) return 2;
  if (minutes < 60) return 3;
  return 4;
};

const levelClass = [
  'bg-ink/[0.07]',
  'bg-forest/25 dark:bg-lime/20',
  'bg-forest/50 dark:bg-lime/45',
  'bg-forest/75 dark:bg-lime/70',
  'bg-forest dark:bg-lime',
];

const mondayIndex = (date) => (date.getDay() + 6) % 7;

export const ActivityHeatmap = ({ activity, weeks = 12 }) => {
  const [hover, setHover] = useState(null);
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - mondayIndex(today) - (weeks - 1) * 7);

  const columns = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = todayKey(date);
      return { key, date, minutes: activity[key] || 0, future: date > today };
    })
  );
  const activeDays = columns.flat().filter((c) => c.minutes > 0).length;

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="grid grid-rows-7 gap-[3px] pt-5 text-[0.6rem] text-ink-3" aria-hidden="true">
          {DAY_NAMES.map((d, i) => (
            <span key={d} className="flex h-full items-center leading-none">
              {i % 2 === 0 ? d : ''}
            </span>
          ))}
        </div>
        <div className="flex-1">
          <div className="mb-1.5 grid gap-[3px] text-[0.6rem] text-ink-3" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }} aria-hidden="true">
            {columns.map((col, i) => (
              <span key={col[0].key}>{i % 4 === 0 ? col[0].date.toLocaleDateString('en-US', { month: 'short' }) : ''}</span>
            ))}
          </div>
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`Learning activity heatmap: ${activeDays} active days in the last ${weeks} weeks`}
          >
            {columns.map((col) => (
              <div key={col[0].key} className="grid grid-rows-7 gap-[3px]">
                {col.map((cell) => (
                  <span
                    key={cell.key}
                    onPointerEnter={(e) => {
                      if (cell.future) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parent = e.currentTarget.closest('.relative').getBoundingClientRect();
                      setHover({ ...cell, x: rect.left - parent.left + rect.width / 2, y: rect.top - parent.top });
                    }}
                    className={clsx(
                      'aspect-square rounded-[3px] transition-transform duration-200 hover:scale-125',
                      cell.future ? 'bg-transparent' : levelClass[level(cell.minutes)],
                      cell.key === todayKey() && 'ring-1 ring-ink ring-offset-1 ring-offset-card'
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[0.7rem] text-ink-3">
        <span>{activeDays} active days</span>
        <span className="flex items-center gap-1.5">
          Less
          {levelClass.map((c) => (
            <span key={c} className={clsx('size-2.5 rounded-[2px]', c)} />
          ))}
          More
        </span>
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-coal px-2.5 py-1.5 text-xs whitespace-nowrap text-cream shadow-soft"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          <span className="font-medium">{hover.minutes ? formatMinutes(hover.minutes) : 'No activity'}</span>
          <span className="text-cream/60"> / {hover.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      )}

      <table className="sr-only">
        <caption>Minutes learned per day</caption>
        <tbody>
          {columns.flat().filter((c) => !c.future && c.minutes).map((c) => (
            <tr key={c.key}>
              <td>{c.key}</td>
              <td>{c.minutes} minutes</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WeekBars = ({ activity }) => {
  const [hover, setHover] = useState(null);
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayIndex(today));
  const days = DAY_NAMES.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { name, date, minutes: activity[todayKey(date)] || 0, future: date > today };
  });
  const max = Math.max(60, ...days.map((d) => d.minutes));

  return (
    <div>
      <div className="relative flex h-36 items-end gap-2 border-b border-line" onPointerLeave={() => setHover(null)} role="img" aria-label="Minutes learned each day this week">
        {[0.5, 1].map((t) => (
          <span key={t} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${t * 100}%` }} aria-hidden="true" />
        ))}
        {days.map((d, i) => (
          <div
            key={d.name}
            className="relative flex h-full flex-1 items-end justify-center"
            onPointerEnter={() => setHover(i)}
          >
            <div
              className={clsx(
                'w-full max-w-7 rounded-t-[4px] transition-[height,background-color] duration-700 ease-out-expo',
                d.date.toDateString() === today.toDateString() ? 'bg-clay' : hover === i ? 'bg-ink' : 'bg-ink/75'
              )}
              style={{ height: `${d.future ? 0 : Math.max(d.minutes ? 4 : 0, (d.minutes / max) * 100)}%` }}
            />
            {hover === i && !d.future && (
              <span className="pointer-events-none absolute bottom-full mb-1 rounded-md bg-coal px-2 py-1 text-[0.7rem] whitespace-nowrap text-cream">
                {d.minutes ? formatMinutes(d.minutes) : 'Rest day'}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-center text-[0.65rem] text-ink-3">
        {days.map((d) => (
          <span key={d.name} className={clsx('flex-1', d.date.toDateString() === today.toDateString() && 'font-semibold text-ink')}>
            {d.name.slice(0, 1)}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Minutes learned this week</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{d.minutes} minutes</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
