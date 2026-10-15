import clsx from 'clsx';

const Star = ({ fill }) => (
  <svg viewBox="0 0 20 20" className="size-full" aria-hidden="true">
    <defs>
      <linearGradient id={`star-${fill}`}>
        <stop offset={`${fill}%`} stopColor="currentColor" />
        <stop offset={`${fill}%`} stopColor="currentColor" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#star-${fill})`}
      d="M10 1.6l2.47 5.3 5.8.68-4.28 3.97 1.14 5.73L10 14.4l-5.13 2.88 1.14-5.73L1.73 7.58l5.8-.68L10 1.6z"
    />
  </svg>
);

const Stars = ({ rating, size = 14, className }) => (
  <span
    className={clsx('inline-flex items-center gap-0.5 text-clay', className)}
    role="img"
    aria-label={`Rated ${rating} out of 5`}
  >
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.round(Math.max(0, Math.min(1, rating - i)) * 100);
      return (
        <span key={i} style={{ width: size, height: size }} className="inline-block">
          <Star fill={fill} />
        </span>
      );
    })}
  </span>
);

export default Stars;
