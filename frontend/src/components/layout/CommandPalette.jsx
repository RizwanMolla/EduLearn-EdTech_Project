import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useLenis } from 'lenis/react';
import { Search, ArrowRight, BookOpen, UserRound, FileText, Compass, CornerDownLeft } from 'lucide-react';
import clsx from 'clsx';
import { courses } from '../../data/courses';
import { instructors } from '../../data/instructors';
import { articles } from '../../data/articles';
import { paths } from '../../data/paths';
import { getCategory } from '../../data/categories';

const pages = [
  { title: 'Browse the catalogue', to: '/courses', keywords: 'courses all browse catalog' },
  { title: 'Learning paths', to: '/paths', keywords: 'career tracks roadmap' },
  { title: 'Your dashboard', to: '/dashboard', keywords: 'progress my learning stats streak' },
  { title: 'Pricing and plans', to: '/pricing', keywords: 'subscription pro teams cost' },
  { title: 'Cart', to: '/cart', keywords: 'checkout basket buy' },
  { title: 'Profile and settings', to: '/profile', keywords: 'account password avatar settings' },
  { title: 'About EduLearn', to: '/about', keywords: 'story mission team' },
  { title: 'Contact us', to: '/contact', keywords: 'support help email' },
  { title: 'The Journal', to: '/journal', keywords: 'blog articles writing' },
];

const index = [
  ...courses.map((c) => ({
    group: 'Courses',
    icon: BookOpen,
    title: c.title,
    meta: `${getCategory(c.category).name} / ${c.level}`,
    to: `/courses/${c.slug}`,
    haystack: `${c.title} ${c.subtitle} ${c.tags.join(' ')} ${c.category}`.toLowerCase(),
  })),
  ...paths.map((p) => ({
    group: 'Paths',
    icon: Compass,
    title: `${p.title} path`,
    meta: `${p.months} months`,
    to: `/paths#${p.id}`,
    haystack: `${p.title} ${p.tagline} ${p.roles.join(' ')}`.toLowerCase(),
  })),
  ...instructors.map((i) => ({
    group: 'Instructors',
    icon: UserRound,
    title: i.name,
    meta: i.role,
    to: `/instructors/${i.id}`,
    haystack: `${i.name} ${i.role} ${i.focus.join(' ')}`.toLowerCase(),
  })),
  ...articles.map((a) => ({
    group: 'Journal',
    icon: FileText,
    title: a.title,
    meta: a.category,
    to: `/journal/${a.slug}`,
    haystack: `${a.title} ${a.excerpt} ${a.category}`.toLowerCase(),
  })),
  ...pages.map((p) => ({
    group: 'Pages',
    icon: ArrowRight,
    title: p.title,
    meta: p.to,
    to: p.to,
    haystack: `${p.title} ${p.keywords}`.toLowerCase(),
  })),
];

const groupOrder = ['Courses', 'Paths', 'Instructors', 'Journal', 'Pages'];

const search = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [
      ...index.filter((i) => i.group === 'Pages').slice(0, 4),
      ...index.filter((i) => i.group === 'Courses').slice(0, 5),
    ];
  }
  const terms = q.split(/\s+/);
  return index
    .map((item) => {
      if (!terms.every((t) => item.haystack.includes(t))) return null;
      const score = item.title.toLowerCase().startsWith(q) ? 3 : item.title.toLowerCase().includes(q) ? 2 : 1;
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || groupOrder.indexOf(a.item.group) - groupOrder.indexOf(b.item.group))
    .slice(0, 12)
    .map(({ item }) => item);
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const lenis = useLenis();

  const results = useMemo(() => search(query), [query]);
  const grouped = useMemo(() => {
    const groups = [];
    results.forEach((item, i) => {
      let g = groups.find((x) => x.name === item.group);
      if (!g) {
        g = { name: item.group, items: [] };
        groups.push(g);
      }
      g.items.push({ ...item, index: i });
    });
    return groups;
  }, [results]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('edulearn:search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('edulearn:search', onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  const go = (item) => {
    close();
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[106] flex items-start justify-center px-3 pt-[12vh]" data-lenis-prevent>
      <button type="button" aria-label="Close search" onClick={close} className="absolute inset-0 animate-[fade-in_0.25s_ease] bg-coal/50 backdrop-blur-[3px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative w-full max-w-2xl animate-[pop-in_0.4s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-3xl border border-line bg-paper shadow-soft"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={18} className="shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search courses, paths, instructors, articles..."
            className="h-16 w-full bg-transparent text-[1.05rem] outline-none placeholder:text-ink-3"
            aria-label="Search query"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${active}` : undefined}
          />
          <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-3 sm:block">Esc</kbd>
        </div>

        <div ref={listRef} id="palette-results" role="listbox" className="max-h-[56vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="font-display text-xl">Nothing matches "{query}"</p>
              <p className="mt-1 text-sm text-ink-3">Try a skill like "React", "SQL" or "Figma".</p>
            </div>
          )}
          {grouped.map((group) => (
            <div key={group.name} className="mb-1">
              <p className="eyebrow px-3 pt-3 pb-2 text-ink-3">{query ? group.name : group.name === 'Pages' ? 'Jump to' : 'Popular courses'}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.to}
                    id={`palette-${item.index}`}
                    data-index={item.index}
                    role="option"
                    aria-selected={active === item.index}
                    type="button"
                    onMouseMove={() => setActive(item.index)}
                    onClick={() => go(item)}
                    className={clsx(
                      'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                      active === item.index ? 'bg-ink text-paper' : 'text-ink'
                    )}
                  >
                    <span
                      className={clsx(
                        'grid size-9 shrink-0 place-items-center rounded-xl',
                        active === item.index ? 'bg-paper/10' : 'bg-ink/6'
                      )}
                    >
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.925rem] font-medium">{item.title}</span>
                      <span className={clsx('block truncate text-xs', active === item.index ? 'text-paper/60' : 'text-ink-3')}>
                        {item.meta}
                      </span>
                    </span>
                    {active === item.index && <CornerDownLeft size={15} className="shrink-0 opacity-60" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-3">
          <span>
            <kbd className="font-mono">Up</kbd> / <kbd className="font-mono">Down</kbd> to move, <kbd className="font-mono">Enter</kbd> to open
          </span>
          <span className="hidden sm:inline">{results.length} results</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
