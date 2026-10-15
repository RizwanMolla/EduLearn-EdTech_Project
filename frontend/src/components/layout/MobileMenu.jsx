import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLenis } from 'lenis/react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '../../lib/gsap';
import { navLinks } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const MobileMenu = ({ open, onClose }) => {
  const root = useRef(null);
  const tl = useRef(null);
  const lenis = useLenis();
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useGSAP(() => {
    tl.current = gsap
      .timeline({ paused: true })
      .set(root.current, { display: 'flex' })
      .fromTo(root.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
      .from('.mm-link', { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, '-=0.35')
      .from('.mm-foot', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.05 }, '-=0.6');
  }, { scope: root });

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      lenis?.stop();
      tl.current.timeScale(1).play();
    } else {
      lenis?.start();
      tl.current.timeScale(1.6).reverse();
    }
  }, [open, lenis]);

  const links = [{ to: '/', label: 'Home' }, ...navLinks, { to: '/about', label: 'About' }];

  return (
    <div
      ref={root}
      className="fixed inset-0 z-40 hidden flex-col justify-between overflow-y-auto bg-forest px-5 pt-28 pb-8 text-on-forest lg:hidden"
      data-lenis-prevent
      aria-hidden={!open}
    >
      <nav aria-label="Mobile">
        <ul className="space-y-1">
          {links.map((link, i) => (
            <li key={link.to} className="overflow-hidden">
              <Link
                to={link.to}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="mm-link flex items-baseline gap-4 font-display text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.02] tracking-[-0.04em]"
              >
                <span className="font-mono text-xs tracking-normal text-on-forest/50">0{i + 1}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-6">
        <div className="mm-foot flex flex-wrap gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={onClose} tabIndex={open ? 0 : -1} className="rounded-full bg-lime px-5 py-3 text-sm font-medium text-coal">
                Dashboard
              </Link>
              <Link to="/profile" onClick={onClose} tabIndex={open ? 0 : -1} className="rounded-full border border-on-forest/25 px-5 py-3 text-sm">
                Profile
              </Link>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  logout();
                  onClose();
                  navigate('/');
                }}
                className="rounded-full border border-on-forest/25 px-5 py-3 text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={onClose} tabIndex={open ? 0 : -1} className="rounded-full bg-lime px-5 py-3 text-sm font-medium text-coal">
                Get started
              </Link>
              <Link to="/login" onClick={onClose} tabIndex={open ? 0 : -1} className="rounded-full border border-on-forest/25 px-5 py-3 text-sm">
                Sign in
              </Link>
            </>
          )}
        </div>
        <div className="mm-foot flex items-center justify-between border-t border-on-forest/15 pt-5 text-sm">
          <button type="button" tabIndex={open ? 0 : -1} onClick={toggleTheme} className="eyebrow text-on-forest/70">
            Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
          {user ? (
            <span className="eyebrow truncate pl-4 text-on-forest/70">{user.name}</span>
          ) : (
            <Link to="/contact" onClick={onClose} tabIndex={open ? 0 : -1} className="eyebrow inline-flex items-center gap-1 text-on-forest/70">
              Contact <ArrowUpRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
