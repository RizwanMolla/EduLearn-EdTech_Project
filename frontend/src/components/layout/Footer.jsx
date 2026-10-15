import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { useLenis } from 'lenis/react';
import { ArrowUp, ArrowRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { socials } from '../../data/site';
import { useToast } from '../../hooks/useToast';
import Magnetic from '../ui/Magnetic';

const columns = [
  {
    title: 'Learn',
    links: [
      { to: '/courses', label: 'All courses' },
      { to: '/paths', label: 'Learning paths' },
      { to: '/instructors', label: 'Instructors' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/journal', label: 'Journal' },
      { to: '/contact', label: 'Contact' },
      { to: '/pricing#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
      { to: '/cart', label: 'Cart' },
      { to: '/login', label: 'Sign in' },
    ],
  },
];

const Footer = () => {
  const root = useRef(null);
  const lenis = useLenis();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.ft-char', {
      yPercent: 100,
      duration: 1.2,
      stagger: 0.04,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.ft-word', start: 'top 98%', once: true },
    });
  }, { scope: root });

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setEmail('');
    toast({ title: 'You are on the list', description: 'One thoughtful email every other Sunday. No spam.' });
  };

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={root} className="relative overflow-hidden bg-forest text-on-forest" data-print-hide>
      <div className="shell pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-on-forest/60">The Sunday Letter</p>
            <h2 className="display-md mt-5 max-w-xl">
              Learn something worth <span className="italic text-lime">keeping</span>.
            </h2>
            <form onSubmit={subscribe} className="mt-10 max-w-lg" noValidate>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-2 border-b border-on-forest/30 pb-3 transition-colors focus-within:border-lime">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(error)}
                  className="w-full bg-transparent py-2 text-lg text-on-forest outline-none placeholder:text-on-forest/40"
                />
                <button
                  type="submit"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-coal transition-transform duration-500 ease-out-expo hover:scale-110"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <p className="mt-3 min-h-5 text-sm text-on-forest/60">
                {error ? <span className="text-lime">{error}</span> : 'Essays on learning, new courses and the occasional reading list.'}
              </p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:pl-10">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-on-forest/50">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="link-sweep text-[0.95rem] text-on-forest/85 hover:text-on-forest">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-on-forest/15 py-6 text-sm text-on-forest/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} EduLearn. Designed and built by{' '}
            <a href={socials[1].href} target="_blank" rel="noreferrer" className="link-sweep text-on-forest">
              Md Rizwan Molla
            </a>
            .
          </p>
          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-sweep text-on-forest/85">
                {s.label}
              </a>
            ))}
            <Magnetic>
              <button
                type="button"
                onClick={backToTop}
                className="grid size-11 place-items-center rounded-full border border-on-forest/25 transition hover:border-lime hover:text-lime"
                aria-label="Back to top"
              >
                <ArrowUp size={17} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="ft-word pointer-events-none flex select-none justify-center overflow-hidden px-2" aria-hidden="true">
        {'EduLearn'.split('').map((char, i) => (
          <span
            key={i}
            className={`ft-char inline-block font-display text-[22.5vw] leading-[0.78] tracking-[-0.06em] ${i >= 3 ? 'italic text-lime' : 'text-on-forest'}`}
          >
            {char}
          </span>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
