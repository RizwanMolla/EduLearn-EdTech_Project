import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Flame, Clock, Trophy, Award, ArrowRight, Minus, Plus, Receipt, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { getCourse } from '../data/courses';
import { getInstructor } from '../data/instructors';
import CourseCover from '../components/course/CourseCover';
import { CourseCard, WishlistButton } from '../components/course/CourseCard';
import { ActivityHeatmap, WeekBars } from '../components/dashboard/ActivityCharts';
import { minutesThisWeek } from '../components/dashboard/activity';
import { EmptyState, SectionLabel, Tag } from '../components/ui/Bits';
import { ProgressBar, ProgressRing } from '../components/ui/Progress';
import Button from '../components/ui/Button';
import Counter from '../components/ui/Counter';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate, formatMinutes, formatMoney, formatPrice } from '../lib/format';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const tabs = [
  { id: 'progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'orders', label: 'Orders' },
];

const CourseProgressRow = ({ course, progress, certificate }) => {
  const next = course.lessons.find((l) => !progress.done.includes(l.id));
  return (
    <article className="group grid grid-cols-[88px_1fr] items-center gap-4 border-b border-line py-5 sm:grid-cols-[120px_1fr_auto] sm:gap-6">
      <Link to={`/learn/${course.slug}`} aria-label={course.title}>
        <CourseCover course={course} size="sm" className="aspect-[4/3] rounded-xl" />
      </Link>
      <div className="min-w-0">
        <p className="eyebrow text-ink-3">{getInstructor(course.instructor).name}</p>
        <h3 className="mt-1.5 truncate font-display text-xl tracking-[-0.02em]">
          <Link to={`/learn/${course.slug}`} className="link-sweep">
            {course.title}
          </Link>
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={progress.percent} className="max-w-xs" tone={progress.percent === 100 ? 'lime' : 'ink'} />
          <span className="shrink-0 font-mono text-xs text-ink-3">{progress.percent}%</span>
        </div>
        <p className="mt-2 truncate text-sm text-ink-3">
          {progress.percent === 100 ? `Completed ${certificate ? formatDate(certificate.at) : ''}` : `Next: ${next?.title}`}
        </p>
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-1">
        {certificate && (
          <Button to={`/certificate/${course.slug}`} size="sm" variant="lime" iconLeft={Award}>
            Certificate
          </Button>
        )}
        <Button to={`/learn/${course.slug}`} size="sm" variant={progress.percent === 100 ? 'outline' : 'primary'}>
          {progress.percent === 100 ? 'Review' : progress.count ? 'Resume' : 'Start'}
        </Button>
      </div>
    </article>
  );
};

const Dashboard = () => {
  const root = useRef(null);
  const { user, isDemo } = useAuth();
  const learning = useLearning();
  const { data, inProgress, completed, wishlistCourses, streak, minutesLearned, recommended, setGoal, certificateFor, enrolledCourses } = learning;
  const [params, setParams] = useSearchParams();
  const tab = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'progress';
  usePageTitle('Dashboard');
  useScrollReveal(root);

  const weekMinutes = minutesThisWeek(data.activity);
  const goalPercent = Math.min(100, Math.round((weekMinutes / data.goal) * 100));
  const certificates = Object.keys(data.certificates).length;
  const current = inProgress[0];
  const currentNext = current && current.course.lessons.find((l) => !current.progress.done.includes(l.id));

  const statTiles = [
    { icon: Flame, label: 'Day streak', value: streak, suffix: streak === 1 ? ' day' : ' days', tone: 'clay' },
    { icon: Clock, label: 'Time learned', value: Math.round((minutesLearned / 60) * 10) / 10, decimals: 1, suffix: 'h' },
    { icon: Trophy, label: 'Courses completed', value: completed.length, suffix: ` / ${enrolledCourses.length}` },
    { icon: Award, label: 'Certificates', value: certificates },
  ];

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-32 pb-12 sm:pt-40">
        <div className="flex flex-wrap items-center gap-3" data-reveal>
          <SectionLabel>{formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })}</SectionLabel>
          {isDemo && <Tag tone="clay">Demo account with sample progress</Tag>}
          {data.plan !== 'starter' && <Tag tone="ink">{data.plan === 'pro' ? 'Pro plan' : 'Teams plan'}</Tag>}
        </div>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 data-split className="display-lg">
            {greeting()}, {user.name.split(' ')[0]}.
          </h1>
          <Button to="/courses" variant="outline" icon={ArrowRight} data-reveal>
            Browse courses
          </Button>
        </div>
      </header>

      <div className="shell">
        {/* Stats */}
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4" data-stagger>
          {statTiles.map(({ icon: Icon, label, value, suffix, decimals, tone }) => (
            <div key={label} className="rounded-3xl border border-line bg-card p-5 sm:p-6">
              <dt className="flex items-center gap-2 text-sm text-ink-2">
                <Icon size={16} className={tone === 'clay' ? 'text-clay' : 'text-ink-3'} />
                {label}
              </dt>
              <dd className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.04em]">
                <Counter value={value} decimals={decimals || 0} duration={1.4} />
                <span className="ml-1 font-sans text-base tracking-normal text-ink-3">{suffix}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Main column */}
          <div className="min-w-0 space-y-6 lg:col-span-8">
            {current ? (
              <section className="grid overflow-hidden rounded-3xl bg-forest text-on-forest sm:grid-cols-[1fr_1.1fr]" data-reveal>
                <CourseCover course={current.course} showTitle className="min-h-56 sm:min-h-full" />
                <div className="flex flex-col p-6 sm:p-8">
                  <p className="eyebrow text-on-forest/60">Continue where you left off</p>
                  <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-0.03em]">{currentNext?.title}</h2>
                  <p className="mt-2 text-sm text-on-forest/65">
                    {current.course.title} / {formatMinutes(currentNext?.duration || 0)}
                  </p>
                  <div className="mt-auto pt-8">
                    <div className="mb-2 flex justify-between text-sm text-on-forest/70">
                      <span>
                        {current.progress.count} of {current.progress.total} lessons
                      </span>
                      <span className="font-mono">{current.progress.percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-on-forest/15">
                      <div className="h-full rounded-full bg-lime" style={{ width: `${current.progress.percent}%` }} />
                    </div>
                    <Button to={`/learn/${current.course.slug}?lesson=${currentNext?.id}`} variant="lime" className="mt-6" icon={ArrowRight}>
                      Resume lesson
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-3xl bg-forest p-8 text-on-forest" data-reveal>
                <p className="eyebrow text-on-forest/60">Nothing in progress</p>
                <h2 className="mt-3 font-display text-3xl">Pick your next course.</h2>
                <p className="mt-2 max-w-md text-on-forest/70">Two of our courses are free, including Data Visualization & Storytelling.</p>
                <Button to="/courses" variant="lime" className="mt-6" icon={ArrowRight}>
                  Browse the catalogue
                </Button>
              </section>
            )}

            <section className="rounded-3xl border border-line bg-card p-5 sm:p-8" data-reveal>
              <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist">
                {tabs.map((t) => {
                  const count = { progress: inProgress.length, completed: completed.length, wishlist: wishlistCourses.length, orders: data.orders.length }[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === t.id}
                      onClick={() => setParams(t.id === 'progress' ? {} : { tab: t.id }, { replace: true, preventScrollReset: true })}
                      className={clsx(
                        'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors',
                        tab === t.id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/6 hover:text-ink'
                      )}
                    >
                      {t.label}
                      <span className={clsx('font-mono text-[0.7rem]', tab === t.id ? 'text-paper/60' : 'text-ink-3')}>{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4" role="tabpanel">
                {tab === 'progress' &&
                  (inProgress.length ? (
                    inProgress.map(({ course, progress }) => <CourseProgressRow key={course.id} course={course} progress={progress} />)
                  ) : (
                    <EmptyState className="mt-4" title="No courses in progress" description="Courses you start will appear here with your progress." action={<Button to="/courses">Find a course</Button>} />
                  ))}

                {tab === 'completed' &&
                  (completed.length ? (
                    completed.map(({ course, progress }) => (
                      <CourseProgressRow key={course.id} course={course} progress={progress} certificate={certificateFor(course.id)} />
                    ))
                  ) : (
                    <EmptyState className="mt-4" title="Nothing completed yet" description="Finish every lesson and the knowledge check to earn a certificate." />
                  ))}

                {tab === 'wishlist' &&
                  (wishlistCourses.length ? (
                    <div className="divide-y divide-line">
                      {wishlistCourses.map((course) => (
                        <div key={course.id} className="grid grid-cols-[88px_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[120px_1fr_auto]">
                          <Link to={`/courses/${course.slug}`}>
                            <CourseCover course={course} size="sm" className="aspect-[4/3] rounded-xl" />
                          </Link>
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-xl">
                              <Link to={`/courses/${course.slug}`} className="link-sweep">
                                {course.title}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-ink-3">
                              {formatPrice(course.price)} / {course.lessonCount} lessons
                            </p>
                          </div>
                          <WishlistButton course={course} className="!bg-ink/6 !text-ink aria-pressed:!bg-lime aria-pressed:!text-coal" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState className="mt-4" title="Your wishlist is empty" description="Tap the heart on any course to save it for later." action={<Button to="/courses">Browse courses</Button>} />
                  ))}

                {tab === 'orders' &&
                  (data.orders.length ? (
                    <div className="divide-y divide-line">
                      {data.orders.map((order) => (
                        <div key={order.id} className="py-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="grid size-10 place-items-center rounded-full bg-ink/6">
                                <Receipt size={17} />
                              </span>
                              <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-ink-3">
                                  {formatDate(order.at)} / {order.method === 'card' ? 'Card' : order.method === 'upi' ? 'UPI' : 'Wallet'}
                                </p>
                              </div>
                            </div>
                            <p className="font-display text-2xl">{formatMoney(order.total)}</p>
                          </div>
                          <ul className="mt-3 space-y-1 pl-13 text-sm text-ink-2">
                            {order.items.map((item) => (
                              <li key={item.id} className="flex justify-between gap-4">
                                <span className="truncate">{item.title}</span>
                                <span className="font-mono text-xs text-ink-3">{formatPrice(item.price)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState className="mt-4" title="No orders yet" description="Receipts for your purchases will appear here." />
                  ))}
              </div>
            </section>
          </div>

          {/* Side column */}
          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-3xl border border-line bg-card p-6" data-reveal>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Weekly goal</h2>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setGoal(Math.max(30, data.goal - 30))} className="grid size-8 place-items-center rounded-full border border-line transition hover:border-ink" aria-label="Decrease weekly goal">
                    <Minus size={14} />
                  </button>
                  <button type="button" onClick={() => setGoal(Math.min(900, data.goal + 30))} className="grid size-8 place-items-center rounded-full border border-line transition hover:border-ink" aria-label="Increase weekly goal">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <ProgressRing value={goalPercent} size={124} stroke={10} barClass={goalPercent >= 100 ? 'text-success' : 'text-clay'}>
                  <span>
                    <span className="block font-display text-3xl">{goalPercent}%</span>
                    <span className="eyebrow text-ink-3">of goal</span>
                  </span>
                </ProgressRing>
                <div>
                  <p className="font-display text-3xl tracking-[-0.03em]">{formatMinutes(weekMinutes)}</p>
                  <p className="text-sm text-ink-3">of {formatMinutes(data.goal)} this week</p>
                  {goalPercent >= 100 && <p className="mt-2 text-sm text-success">Goal reached. Well done.</p>}
                </div>
              </div>
              <div className="mt-8">
                <p className="eyebrow mb-3 text-ink-3">This week</p>
                <WeekBars activity={data.activity} />
              </div>
            </section>

            <section className="rounded-3xl border border-line bg-card p-6" data-reveal>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Activity</h2>
                <span className="eyebrow text-ink-3">12 weeks</span>
              </div>
              <div className="mt-5">
                <ActivityHeatmap activity={data.activity} />
              </div>
            </section>

            <section className="rounded-3xl border border-line bg-card p-6" data-reveal>
              <h2 className="flex items-center gap-2 font-medium">
                <Sparkles size={16} className="text-clay" /> Recommended for you
              </h2>
              <ul className="mt-4 divide-y divide-line">
                {recommended.map((course) => (
                  <li key={course.id}>
                    <Link to={`/courses/${course.slug}`} className="group flex items-center gap-4 py-3.5">
                      <CourseCover course={course} size="sm" className="aspect-square w-14 shrink-0 rounded-lg [&>div]:hidden" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium group-hover:underline">{course.title}</span>
                        <span className="block text-xs text-ink-3">
                          {course.rating} rating / {formatPrice(course.price)}
                        </span>
                      </span>
                      <ArrowRight size={15} className="text-ink-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {recommended.length > 0 && enrolledCourses.length === 0 && (
          <section className="mt-20">
            <SectionLabel>Popular starting points</SectionLabel>
            <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              {recommended.map((c) => (
                <CourseCard key={c.id} course={getCourse(c.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
