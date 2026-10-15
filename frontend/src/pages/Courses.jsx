import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { courses } from '../data/courses';
import { categories, levels } from '../data/categories';
import { CourseCard, CourseRow } from '../components/course/CourseCard';
import { EmptyState, SectionLabel } from '../components/ui/Bits';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';

const durations = [
  { value: 'short', label: 'Under 4 hours', test: (m) => m < 240 },
  { value: 'medium', label: '4 to 6 hours', test: (m) => m >= 240 && m <= 360 },
  { value: 'long', label: 'Over 6 hours', test: (m) => m > 360 },
];

const ratings = [
  { value: '4.8', label: '4.8 and up' },
  { value: '4.7', label: '4.7 and up' },
  { value: '4.5', label: '4.5 and up' },
];

const prices = [
  { value: 'all', label: 'Any' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const sorts = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Recently updated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const sorters = {
  popular: (a, b) => b.students - a.students,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => b.updated.localeCompare(a.updated) || b.id - a.id,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

const listParam = (params, key) => (params.get(key) ? params.get(key).split(',').filter(Boolean) : []);

const FilterGroup = ({ title, children }) => (
  <fieldset className="border-b border-line py-6 first:pt-0">
    <legend className="eyebrow float-left mb-4 w-full text-ink-3">{title}</legend>
    <div className="clear-left">{children}</div>
  </fieldset>
);

const CheckRow = ({ checked, onChange, label, count }) => (
  <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-[0.925rem]">
    <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      className={clsx(
        'grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ink',
        checked ? 'border-ink bg-ink text-paper' : 'border-line-strong group-hover:border-ink'
      )}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
          <path d="M2 6.5 4.8 9 10 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
    <span className="flex-1 text-ink-2 group-hover:text-ink">{label}</span>
    {count !== undefined && <span className="font-mono text-xs text-ink-3">{count}</span>}
  </label>
);

const Filters = ({ params, toggleList, setParam }) => {
  const selectedCats = listParam(params, 'category');
  const selectedLevels = listParam(params, 'level');
  const selectedDurations = listParam(params, 'duration');
  return (
    <div>
      <FilterGroup title="Subject">
        {categories.map((c) => (
          <CheckRow
            key={c.id}
            label={c.name}
            count={courses.filter((x) => x.category === c.id).length}
            checked={selectedCats.includes(c.id)}
            onChange={() => toggleList('category', c.id)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Level">
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => {
            const active = selectedLevels.includes(l);
            return (
              <button
                key={l}
                type="button"
                aria-pressed={active}
                onClick={() => toggleList('level', l)}
                className={clsx(
                  'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  active ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'
                )}
              >
                {l}
              </button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Length">
        {durations.map((d) => (
          <CheckRow
            key={d.value}
            label={d.label}
            count={courses.filter((c) => d.test(c.totalMinutes)).length}
            checked={selectedDurations.includes(d.value)}
            onChange={() => toggleList('duration', d.value)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Rating">
        {ratings.map((r) => {
          const active = params.get('rating') === r.value;
          return (
            <label key={r.value} className="group flex cursor-pointer items-center gap-3 py-1.5 text-[0.925rem]">
              <input
                type="radio"
                name="rating"
                checked={active}
                onChange={() => setParam('rating', r.value)}
                onClick={() => active && setParam('rating', '')}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  'grid size-[18px] place-items-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-ink',
                  active ? 'border-ink' : 'border-line-strong group-hover:border-ink'
                )}
              >
                <span className={clsx('size-2 rounded-full bg-ink transition-transform', active ? 'scale-100' : 'scale-0')} />
              </span>
              <span className="text-ink-2 group-hover:text-ink">{r.label}</span>
            </label>
          );
        })}
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="flex rounded-full border border-line p-1">
          {prices.map((p) => {
            const active = (params.get('price') || 'all') === p.value;
            return (
              <button
                key={p.value}
                type="button"
                aria-pressed={active}
                onClick={() => setParam('price', p.value === 'all' ? '' : p.value)}
                className={clsx('flex-1 rounded-full py-1.5 text-sm transition-colors', active ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink')}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
};

const Courses = () => {
  const root = useRef(null);
  const results = useRef(null);
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  usePageTitle('Courses');
  useScrollReveal(root);

  const query = params.get('q') || '';
  const sort = params.get('sort') || 'popular';
  const view = params.get('view') || 'grid';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const toggleList = (key, value) => {
    const current = listParam(params, key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setParam(key, next.join(','));
  };

  const filtered = useMemo(() => {
    const cats = listParam(params, 'category');
    const lvls = listParam(params, 'level');
    const durs = listParam(params, 'duration');
    const minRating = Number(params.get('rating') || 0);
    const price = params.get('price');
    const q = query.trim().toLowerCase();

    return courses
      .filter((c) => {
        if (q) {
          const haystack = `${c.title} ${c.subtitle} ${c.tags.join(' ')} ${c.instructor.replace('-', ' ')}`.toLowerCase();
          if (!q.split(/\s+/).every((term) => haystack.includes(term))) return false;
        }
        if (cats.length && !cats.includes(c.category)) return false;
        if (lvls.length && !lvls.includes(c.level)) return false;
        if (durs.length && !durations.some((d) => durs.includes(d.value) && d.test(c.totalMinutes))) return false;
        if (minRating && c.rating < minRating) return false;
        if (price === 'free' && c.price > 0) return false;
        if (price === 'paid' && c.price === 0) return false;
        return true;
      })
      .sort(sorters[sort] || sorters.popular);
  }, [params, query, sort]);

  const chips = [
    ...listParam(params, 'category').map((id) => ({ key: 'category', value: id, label: categories.find((c) => c.id === id)?.name })),
    ...listParam(params, 'level').map((l) => ({ key: 'level', value: l, label: l })),
    ...listParam(params, 'duration').map((d) => ({ key: 'duration', value: d, label: durations.find((x) => x.value === d)?.label })),
    ...(params.get('rating') ? [{ key: 'rating', value: params.get('rating'), label: `${params.get('rating')}+ rating` }] : []),
    ...(params.get('price') ? [{ key: 'price', value: params.get('price'), label: params.get('price') === 'free' ? 'Free' : 'Paid' }] : []),
  ].filter((c) => c.label);

  const clearAll = () => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (sort !== 'popular') next.set('sort', sort);
    if (view !== 'grid') next.set('view', view);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const signature = `${filtered.map((c) => c.id).join('-')}-${view}`;

  // Results re-enter whenever the filtered set changes
  useGSAP(() => {
    if (prefersReducedMotion() || !results.current) return;
    gsap.fromTo(
      results.current.children,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out', overwrite: true }
    );
  }, { dependencies: [signature] });

  return (
    <div ref={root}>
      <header className="shell pt-36 pb-10 sm:pt-44">
        <SectionLabel index={String(courses.length)}>The catalogue</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 data-split className="display-lg lg:col-span-8">
            Find the course that fits where you are.
          </h1>
          <p className="text-ink-2 lg:col-span-4" data-reveal>
            {courses.length} courses across {categories.length} subjects, each one built around projects you can show.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 md:flex-row" data-reveal>
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search by title, skill or instructor"
              className="field h-12 pl-11"
              aria-label="Search courses"
            />
          </div>
          <div className="flex gap-3">
            <Select
              id="sort"
              label="Sort courses"
              value={sort}
              onChange={(v) => setParam('sort', v === 'popular' ? '' : v)}
              options={sorts}
              className="flex-1 md:w-56"
            />
            <div className="hidden rounded-xl border border-line bg-card p-1 sm:flex" role="group" aria-label="Layout">
              {[
                { id: 'grid', icon: LayoutGrid, label: 'Grid view' },
                { id: 'list', icon: List, label: 'List view' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setParam('view', id === 'grid' ? '' : id)}
                  aria-pressed={view === id}
                  aria-label={label}
                  className={clsx(
                    'grid size-10 place-items-center rounded-lg transition-colors',
                    view === id ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink'
                  )}
                >
                  <Icon size={17} strokeWidth={1.8} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="flex h-12 items-center gap-2 rounded-xl border border-line bg-card px-4 text-sm lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
              {chips.length > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-clay font-mono text-[0.65rem] text-coal">{chips.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="shell grid gap-10 pb-28 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28" data-reveal>
            <Filters params={params} toggleList={toggleList} setParam={setParam} />
          </div>
        </aside>

        <section className="lg:col-span-9" aria-live="polite" aria-label="Results">
          <div className="mb-8 flex min-h-12 flex-wrap items-center gap-2 border-b border-line pb-5">
            <p className="mr-3 text-sm text-ink-2">
              Showing <span className="font-medium text-ink">{filtered.length}</span> of {courses.length} courses
              {query && (
                <>
                  {' '}for <span className="font-medium text-ink">"{query}"</span>
                </>
              )}
            </p>
            {chips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                type="button"
                onClick={() => (['rating', 'price'].includes(chip.key) ? setParam(chip.key, '') : toggleList(chip.key, chip.value))}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink/6 py-1 pr-2 pl-3 text-xs transition hover:bg-ink/12"
              >
                {chip.label}
                <X size={12} />
              </button>
            ))}
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="text-xs text-ink-3 underline underline-offset-4 hover:text-ink">
                Clear all
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No courses match those filters"
              description="Try removing a filter or searching for a broader skill."
              action={
                <Button onClick={clearAll} variant="outline">
                  Clear filters
                </Button>
              }
            />
          ) : view === 'list' ? (
            <div ref={results} className="border-t border-line">
              {filtered.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div ref={results} className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} title="Filters" size="sm">
        <div className="p-6">
          <Filters params={params} toggleList={toggleList} setParam={setParam} />
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={clearAll} className="flex-1">
              Clear
            </Button>
            <Button onClick={() => setDrawer(false)} className="flex-1">
              Show {filtered.length} courses
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;
