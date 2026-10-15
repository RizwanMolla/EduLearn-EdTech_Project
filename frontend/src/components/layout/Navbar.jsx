import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { useLenis } from 'lenis/react';
import { Search, ShoppingBag, Moon, Sun, LayoutGrid, UserRound, LogOut, Heart } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Avatar } from '../ui/Bits';
import MobileMenu from './MobileMenu';
import { navLinks } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { openSearch } from '../../lib/nav';

export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx('grid size-10 place-items-center rounded-full transition hover:bg-ink/6', className)}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun size={18} strokeWidth={1.7} /> : <Moon size={18} strokeWidth={1.7} />}
    </button>
  );
};

const AccountMenu = () => {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/dashboard?tab=wishlist', label: 'Wishlist', icon: Heart },
    { to: '/profile', label: 'Profile & settings', icon: UserRound },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 pr-1 transition hover:bg-ink/6 lg:pr-3"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar user={user} size={34} />
        <span className="hidden max-w-[9rem] truncate text-sm font-medium lg:block">{user.name.split(' ')[0]}</span>
      </button>
      <div
        role="menu"
        className={clsx(
          'absolute top-full right-0 mt-3 w-64 origin-top-right rounded-2xl border border-line bg-card p-2 shadow-soft transition-all duration-300 ease-out-expo',
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        )}
      >
        <div className="border-b border-line px-3 pt-2 pb-3">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-sm text-ink-3">{user.email}</p>
          {isDemo && <p className="eyebrow mt-2 text-clay">Demo account</p>}
        </div>
        <div className="py-1.5">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-ink/6"
            >
              <Icon size={16} strokeWidth={1.7} className="text-ink-3" />
              {label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex w-full items-center gap-3 rounded-xl border-t border-line px-3 py-2.5 text-sm text-ink-2 transition hover:bg-ink/6 hover:text-ink"
        >
          <LogOut size={16} strokeWidth={1.7} className="text-ink-3" />
          Sign out
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { cartCourses } = useLearning();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLenis((lenis) => {
    const y = lenis.animatedScroll;
    setScrolled(y > 24);
    if (y < 160) setHidden(false);
    else if (lenis.direction === 1 && lenis.velocity > 0.5) setHidden(true);
    else if (lenis.direction === -1) setHidden(false);
  });

  // Fallback when Lenis is disabled (reduced motion)
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = cartCourses.length;

  return (
    <>
      <a
        href="#main"
        data-transition="off"
        className="fixed top-3 left-3 z-[130] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        data-print-hide
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
          scrolled && !menuOpen ? 'border-b border-line bg-paper/80 backdrop-blur-xl' : 'border-b border-transparent',
          menuOpen && 'text-on-forest [&_.text-ink-2]:text-on-forest/70'
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <Logo onClick={() => setMenuOpen(false)} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'relative rounded-full px-4 py-2 text-[0.9rem] transition-colors',
                    isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={clsx(
                        'absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-clay transition-all duration-500 ease-out-expo',
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="group flex h-10 items-center gap-2 rounded-full px-2.5 text-sm text-ink-2 transition hover:bg-ink/6 hover:text-ink xl:border xl:border-line xl:pr-2 xl:pl-3.5"
              aria-label="Search EduLearn"
            >
              <Search size={17} strokeWidth={1.8} />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden rounded-md border border-line bg-card px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-3 xl:inline">
                Ctrl K
              </kbd>
            </button>
            <ThemeToggle className="hidden sm:grid" />
            <Link
              to="/cart"
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-ink/6"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.7} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-clay px-1 font-mono text-[0.6rem] font-medium text-coal">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden items-center gap-2 pl-1 sm:flex">
              {isAuthenticated ? (
                <AccountMenu />
              ) : (
                <>
                  <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium transition hover:bg-ink/6">
                    Sign in
                  </Link>
                  <Button to="/signup" size="sm">
                    Get started
                  </Button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-ink/6 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={clsx(
                    'absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500 ease-out-expo',
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                  )}
                />
                <span
                  className={clsx(
                    'absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500 ease-out-expo',
                    menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
