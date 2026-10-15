import { Link } from 'react-router';
import clsx from 'clsx';

const variants = {
  primary: 'bg-ink text-paper hover:bg-ink/88',
  lime: 'bg-lime text-coal hover:brightness-95',
  outline: 'border border-line-strong text-ink hover:border-ink',
  ghost: 'text-ink hover:bg-ink/6',
  light: 'bg-on-forest text-forest hover:bg-white',
  'outline-light': 'border border-on-forest/30 text-on-forest hover:border-on-forest',
  danger: 'border border-danger/40 text-danger hover:bg-danger hover:text-paper',
};

const sizes = {
  sm: 'h-9 gap-1.5 px-4 text-[0.8125rem]',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-14 gap-2.5 px-7 text-[0.9375rem]',
};

/**
 * Pill button that renders a router Link (`to`), an anchor (`href`) or a button.
 * The label rolls upward on hover.
 */
const Button = ({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconLeft: IconLeft,
  className,
  children,
  fullWidth,
  loading,
  disabled,
  ...props
}) => {
  const classes = clsx(
    'group/btn relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,filter,opacity] duration-300',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'pointer-events-none opacity-55',
    className
  );

  const content = (
    <>
      {IconLeft && <IconLeft size={size === 'sm' ? 15 : 17} strokeWidth={1.8} className="shrink-0" />}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">
          {loading ? 'Please wait...' : children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
        >
          {loading ? 'Please wait...' : children}
        </span>
      </span>
      {Icon && (
        <Icon
          size={size === 'sm' ? 15 : 17}
          strokeWidth={1.8}
          className="shrink-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
};

export default Button;
