import clsx from 'clsx';

export const ProgressBar = ({ value, className, tone = 'ink', label }) => (
  <div
    className={clsx('h-1.5 w-full overflow-hidden rounded-full bg-ink/10', className)}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label || 'Progress'}
  >
    <div
      className={clsx(
        'h-full rounded-full transition-[width] duration-1000 ease-out-expo',
        tone === 'lime' ? 'bg-lime' : tone === 'clay' ? 'bg-clay' : 'bg-ink'
      )}
      style={{ width: `${value}%` }}
    />
  </div>
);

export const ProgressRing = ({ value, size = 120, stroke = 8, children, className, trackClass = 'text-ink/10', barClass = 'text-ink' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, value) / 100);
  return (
    <div className={clsx('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} stroke="currentColor" className={trackClass} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={clsx('transition-[stroke-dashoffset] duration-1000 ease-out-expo', barClass)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
};
