import { Link } from 'react-router';
import clsx from 'clsx';

export const LogoMark = ({ className }) => (
  <svg viewBox="0 0 64 64" className={clsx('shrink-0', className)} aria-hidden="true">
    <rect width="64" height="64" rx="14" className="fill-forest" />
    <path d="M18 44V20h22v5H24v4.5h14v5H24V39h16.5v5H18Z" className="fill-on-forest" />
    <circle cx="46.5" cy="41.5" r="4.5" className="fill-lime" />
  </svg>
);

const Logo = ({ className, onClick }) => (
  <Link to="/" onClick={onClick} className={clsx('group inline-flex items-center gap-2.5', className)} aria-label="EduLearn home">
    <LogoMark className="size-8 transition-transform duration-700 ease-out-expo group-hover:-rotate-[8deg]" />
    <span className="font-display text-[1.45rem] leading-none tracking-[-0.04em]">
      Edu<span className="italic">Learn</span>
    </span>
  </Link>
);

export default Logo;
