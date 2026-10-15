import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLenis } from 'lenis/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { TransitionContext } from '../../context/TransitionContext';
import { getCourse } from '../../data/courses';
import { getInstructor } from '../../data/instructors';
import { getArticle } from '../../data/articles';
import Preloader from './Preloader';

const labels = {
  '': 'Home',
  courses: 'Catalogue',
  paths: 'Learning paths',
  instructors: 'Instructors',
  pricing: 'Pricing',
  journal: 'Journal',
  about: 'About',
  contact: 'Contact',
  dashboard: 'Dashboard',
  learn: 'Classroom',
  cart: 'Your cart',
  checkout: 'Checkout',
  profile: 'Profile',
  login: 'Sign in',
  signup: 'Join EduLearn',
  certificate: 'Certificate',
};

const labelFor = (pathname) => {
  const [section = '', id] = pathname.split('/').filter(Boolean);
  if (id && (section === 'courses' || section === 'learn')) return getCourse(id)?.title || labels[section];
  if (id && section === 'instructors') return getInstructor(id)?.name || labels[section];
  if (id && section === 'journal') return getArticle(id)?.title || labels[section];
  return labels[section] || 'EduLearn';
};

// Decided once per page load (StrictMode calls state initialisers twice)
let introDecision = null;
const shouldShowIntro = () => {
  if (introDecision !== null) return introDecision;
  try {
    introDecision = !sessionStorage.getItem('edulearn:intro') && window.location.pathname === '/' && !prefersReducedMotion();
    sessionStorage.setItem('edulearn:intro', '1');
  } catch {
    introDecision = false;
  }
  return introDecision;
};

const PageTransition = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const [intro] = useState(shouldShowIntro);
  const [ready, setReady] = useState(!intro);
  const [label, setLabel] = useState('');
  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const busy = useRef(false);
  const pendingReveal = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const scrollTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, []);

  // Pages load lazily, so wait for the anchor target to exist before scrolling to it
  const scrollToHash = useCallback((hash) => {
    let tries = 0;
    const attempt = () => {
      let el;
      try {
        el = document.querySelector(decodeURIComponent(hash));
      } catch {
        return;
      }
      if (el) {
        if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -100, duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
      } else if (tries < 25) {
        tries += 1;
        setTimeout(attempt, 100);
      }
    };
    setTimeout(attempt, 350);
  }, []);

  const cover = useCallback((to, pathname) => {
    busy.current = true;
    setLabel(labelFor(pathname));
    lenisRef.current?.stop();
    gsap
      .timeline()
      .set(curtainRef.current, { display: 'flex', yPercent: 100 })
      .set(labelRef.current, { yPercent: 110 })
      .to(curtainRef.current, { yPercent: 0, duration: 0.65, ease: 'expo.inOut' })
      .to(labelRef.current, { yPercent: 0, duration: 0.5, ease: 'expo.out' }, '-=0.25')
      .add(() => {
        pendingReveal.current = true;
        setReady(false);
        navigate(to);
      }, '+=0.05');
  }, [navigate]);

  // Intercept internal link clicks so the curtain can cover the old page before the route changes
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download') || anchor.dataset.transition === 'off') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      event.preventDefault();
      if (busy.current) return;
      cover(`${url.pathname}${url.search}${url.hash}`, url.pathname);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [cover]);

  // After the route changes: reset scroll, then lift the curtain
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (location.hash) scrollToHash(location.hash);
      return;
    }
    if (location.hash) scrollToHash(location.hash);
    else scrollTop();

    if (!pendingReveal.current) {
      ScrollTrigger.refresh();
      return;
    }
    pendingReveal.current = false;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setReady(true);
      lenisRef.current?.start();
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            gsap.set(curtainRef.current, { display: 'none' });
          },
        })
        .to(labelRef.current, { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .to(curtainRef.current, { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, '-=0.2');
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, scrollTop, scrollToHash]);

  const onIntroDone = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready }), [ready]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[100] hidden flex-col justify-between bg-forest p-6 text-on-forest sm:p-10"
        aria-hidden="true"
        data-print-hide
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow text-on-forest/60">EduLearn</span>
          <span className="eyebrow text-on-forest/60">Loading</span>
        </div>
        <div className="overflow-hidden pb-2">
          <p ref={labelRef} className="display-lg max-w-5xl text-on-forest">
            {label}
            <span className="text-lime">.</span>
          </p>
        </div>
      </div>
      {intro && <Preloader onDone={onIntroDone} />}
    </TransitionContext.Provider>
  );
};

export default PageTransition;
