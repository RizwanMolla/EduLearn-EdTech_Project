import { useCallback, useMemo, useState } from 'react';
import { ThemeContext } from './contexts';
import { flushSync } from 'react-dom';
import { writeString } from '../lib/storage';
import { prefersReducedMotion } from '../lib/gsap';

const themeColors = { light: '#f2eee5', dark: '#0e100f' };

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme]);
  writeString('edulearn:theme', theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  const setThemeWithTransition = useCallback((next, event) => {
    const commit = () => {
      flushSync(() => setTheme(next));
      applyTheme(next);
    };

    if (!document.startViewTransition || prefersReducedMotion()) {
      commit();
      return;
    }

    // Circular wipe from the point that was clicked
    const x = event?.clientX ?? window.innerWidth - 80;
    const y = event?.clientY ?? 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});
  }, []);

  const toggleTheme = useCallback(
    (event) => setThemeWithTransition(theme === 'dark' ? 'light' : 'dark', event),
    [theme, setThemeWithTransition]
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme: setThemeWithTransition }),
    [theme, toggleTheme, setThemeWithTransition]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
