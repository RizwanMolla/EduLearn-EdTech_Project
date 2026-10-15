import clsx from 'clsx';
import { initials } from '../../lib/format';

// Section label like "(02) — Featured"
export const SectionLabel = ({ index, children, className, light }) => (
  <p className={clsx('eyebrow flex items-center gap-3', light ? 'text-on-forest/60' : 'text-ink-3', className)}>
    {index && <span className={light ? 'text-on-forest' : 'text-ink'}>({index})</span>}
    <span className={clsx('h-px w-8', light ? 'bg-on-forest/30' : 'bg-line-strong')} />
    <span>{children}</span>
  </p>
);

export const Tag = ({ children, className, tone = 'default' }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium tracking-[-0.005em]',
      tone === 'default' && 'border border-line text-ink-2',
      tone === 'lime' && 'bg-lime text-coal',
      tone === 'ink' && 'bg-ink text-paper',
      tone === 'clay' && 'bg-clay text-coal',
      tone === 'glass' && 'bg-coal/55 text-cream backdrop-blur-md',
      className
    )}
  >
    {children}
  </span>
);

export const Avatar = ({ user, size = 40, className }) => {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  if (user?.image) {
    return <img src={user.image} alt="" style={style} className={clsx('shrink-0 rounded-full object-cover', className)} />;
  }
  return (
    <span
      style={style}
      className={clsx('grid shrink-0 place-items-center rounded-full bg-forest font-medium text-on-forest', className)}
    >
      {initials(user?.name)}
    </span>
  );
};

export const EmptyState = ({ title, description, action, className }) => (
  <div className={clsx('flex flex-col items-center rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center', className)}>
    <svg viewBox="0 0 120 80" className="mb-6 w-28 text-ink-3" aria-hidden="true">
      <rect x="10" y="14" width="64" height="52" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="24" width="64" height="52" rx="6" className="fill-paper" stroke="currentColor" strokeWidth="1.5" />
      <path d="M58 40h40M58 50h28M58 60h34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="28" r="4" className="fill-lime" />
    </svg>
    <h3 className="font-display text-2xl">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-ink-2">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const PageHeader = ({ label, index, title, children, className }) => (
  <header className={clsx('shell pt-36 pb-12 sm:pt-44 sm:pb-16', className)}>
    {label && <SectionLabel index={index}>{label}</SectionLabel>}
    <h1 data-split className="display-lg mt-6 max-w-5xl">
      {title}
    </h1>
    {children && <div className="mt-8">{children}</div>}
  </header>
);
