import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useLenis } from 'lenis/react';
import {
  Check, Clock, Globe, BarChart3, Users, RefreshCcw, Share2, Heart, ShoppingBag, PlayCircle, Hammer,
  ListChecks, Award, Infinity as InfinityIcon, Lock, ChevronRight, Star,
} from 'lucide-react';
import clsx from 'clsx';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { getCourse, relatedCourses, discountPercent } from '../data/courses';
import { getInstructor } from '../data/instructors';
import { getCategory } from '../data/categories';
import { reviewsFor, ratingDistribution } from '../data/reviews';
import { faqs } from '../data/site';
import CourseCover from '../components/course/CourseCover';
import { CourseCard } from '../components/course/CourseCard';
import FauxPlayer from '../components/course/FauxPlayer';
import { lessonIcons } from '../components/course/lessonMeta';
import { AccordionItem, FaqList } from '../components/ui/Accordion';
import { Avatar, SectionLabel, Tag } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import Magnetic from '../components/ui/Magnetic';
import Modal from '../components/ui/Modal';
import Stars from '../components/ui/Stars';
import { ProgressBar } from '../components/ui/Progress';
import NotFound from './NotFound';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate, formatMinutes, formatNumber, formatPrice, formatHours } from '../lib/format';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
];

const ReviewForm = ({ course, existing }) => {
  const { saveReview } = useLearning();
  const toast = useToast();
  const [rating, setRating] = useState(existing?.rating || 5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState(existing?.text || '');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Write at least a sentence so other learners know what you thought.');
      return;
    }
    setError('');
    saveReview(course.id, rating, text.trim());
    toast({ title: existing ? 'Review updated' : 'Thanks for your review', description: 'It now appears on this course.' });
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-card p-6">
      <p className="font-medium">{existing ? 'Edit your review' : 'Leave a review'}</p>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rating" onPointerLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onPointerEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="p-0.5 text-clay transition-transform hover:scale-110"
          >
            <Star size={22} fill={(hover || rating) >= n ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <label htmlFor="review-text" className="sr-only">
        Your review
      </label>
      <textarea
        id="review-text"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you build? What would you tell someone considering this course?"
        className="field mt-4 resize-none"
        aria-invalid={Boolean(error)}
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <Button type="submit" size="sm" className="mt-4">
        {existing ? 'Update review' : 'Post review'}
      </Button>
    </form>
  );
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  usePageTitle(course?.title || 'Course not found');
  if (!course) return <NotFound />;
  return <CourseView course={course} />;
};

const CourseView = ({ course }) => {
  const root = useRef(null);
  const navigate = useNavigate();
  const lenis = useLenis();
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();
  const { isEnrolled, getProgress, inCart, addToCart, inWishlist, toggleWishlist, enroll, data } = useLearning();
  const [active, setActive] = useState('overview');
  const [openSections, setOpenSections] = useState([0]);
  const [preview, setPreview] = useState(null);

  const instructor = getInstructor(course.instructor);
  const category = getCategory(course.category);
  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const discount = discountPercent(course);
  const reviews = reviewsFor(course);
  const distribution = ratingDistribution(course.rating);
  const myReview = data.reviews[String(course.id)];
  const related = relatedCourses(course, 3);
  const wished = inWishlist(course.id);
  const carted = inCart(course.id);

  useScrollReveal(root);

  // Scroll spy for the section tabs
  useGSAP(() => {
    sections.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
    gsap.from('.cd-cover', { scale: 1.08, autoAlpha: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 });
  }, { scope: root });

  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -150, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  const startFree = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }
    enroll(course.id);
    toast({ title: 'You are enrolled', description: course.title });
    navigate(`/learn/${course.slug}`);
  };

  const buyNow = () => {
    addToCart(course.id);
    navigate(isAuthenticated ? '/checkout' : `/login?redirect=${encodeURIComponent('/checkout')}`);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: course.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', description: 'Share it with someone who would enjoy this course.', tone: 'info' });
    } catch {
      // share sheet dismissed
    }
  };

  const toggleSection = (i, open) =>
    setOpenSections((list) => (open ? [...list, i] : list.filter((x) => x !== i)));
  const allOpen = openSections.length === course.curriculum.length;

  const includes = [
    { icon: Clock, text: `${formatHours(course.totalMinutes)} of focused lessons` },
    { icon: PlayCircle, text: `${course.lessonCount} lessons, from ${formatMinutes(Math.min(...course.lessons.map((l) => l.duration)))}` },
    { icon: Hammer, text: `${course.projectCount} hands-on project${course.projectCount === 1 ? '' : 's'}` },
    { icon: ListChecks, text: 'Final knowledge check' },
    { icon: Award, text: 'Certificate of completion' },
    { icon: InfinityIcon, text: 'Lifetime access and updates' },
  ];

  const allReviews = myReview
    ? [{ id: 'mine', name: user?.name || 'You', role: 'Your review', rating: myReview.rating, text: myReview.text, date: myReview.at, mine: true }, ...reviews]
    : reviews;

  const purchaseActions = (compact = false) => {
    if (enrolled) {
      return (
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-ink-2">{progress.count} of {progress.total} lessons</span>
              <span className="font-mono">{progress.percent}%</span>
            </div>
            <ProgressBar value={progress.percent} />
          </div>
          <Button to={`/learn/${course.slug}`} fullWidth size={compact ? 'md' : 'lg'} icon={ChevronRight}>
            {progress.percent === 100 ? 'Review course' : progress.count ? 'Continue learning' : 'Start learning'}
          </Button>
        </div>
      );
    }
    if (course.price === 0) {
      return (
        <Button onClick={startFree} fullWidth size={compact ? 'md' : 'lg'} icon={ChevronRight}>
          Enroll for free
        </Button>
      );
    }
    return (
      <div className={clsx('grid gap-2.5', compact && 'grid-cols-2')}>
        {carted ? (
          <Button to="/cart" variant="outline" fullWidth size={compact ? 'md' : 'lg'} iconLeft={ShoppingBag}>
            {compact ? 'In cart' : 'Go to cart'}
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            size={compact ? 'md' : 'lg'}
            iconLeft={ShoppingBag}
            onClick={() => {
              addToCart(course.id);
              toast({ title: 'Added to cart', description: course.title });
            }}
          >
            Add to cart
          </Button>
        )}
        <Button onClick={buyNow} fullWidth size={compact ? 'md' : 'lg'}>
          Buy now
        </Button>
      </div>
    );
  };

  return (
    <div ref={root}>
      {/* Header */}
      <section className="shell pt-32 pb-16 sm:pt-40">
        <nav className="eyebrow flex flex-wrap items-center gap-2 text-ink-3" aria-label="Breadcrumb" data-reveal>
          <Link to="/courses" className="link-sweep hover:text-ink">Courses</Link>
          <ChevronRight size={12} />
          <Link to={`/courses?category=${category.id}`} className="link-sweep hover:text-ink">{category.name}</Link>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2" data-reveal>
              {course.badge && <Tag tone={course.badge === 'Free' ? 'lime' : 'ink'}>{course.badge}</Tag>}
              <Tag>{course.level}</Tag>
              <Tag>Updated {formatDate(`${course.updated}-01`, { month: 'long', year: 'numeric' })}</Tag>
            </div>
            <h1 data-split className="display-lg mt-6">
              {course.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-2" data-reveal>
              {course.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-2" data-reveal>
              <span className="inline-flex items-center gap-2">
                <span className="font-display text-2xl text-ink">{course.rating}</span>
                <Stars rating={course.rating} />
                <button type="button" onClick={() => jump('reviews')} className="link-sweep">
                  {formatNumber(course.reviews)} reviews
                </button>
              </span>
              <span className="inline-flex items-center gap-1.5"><Users size={15} />{formatNumber(course.students)} learners</span>
              <span className="inline-flex items-center gap-1.5"><Globe size={15} />{course.language || 'English'}</span>
              <span className="inline-flex items-center gap-1.5"><BarChart3 size={15} />{course.level}</span>
            </div>

            <Link
              to={`/instructors/${instructor.id}`}
              className="group mt-10 inline-flex items-center gap-4 rounded-full border border-line py-2 pr-5 pl-2 transition hover:border-ink"
              data-reveal
            >
              <img src={instructor.photo} alt="" className="size-11 rounded-full object-cover" />
              <span>
                <span className="block text-xs text-ink-3">Taught by</span>
                <span className="block font-medium">{instructor.name}</span>
              </span>
              <ChevronRight size={16} className="text-ink-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="cd-cover overflow-hidden rounded-3xl">
              <CourseCover course={course} showTitle size="lg" className="aspect-[4/3] lg:aspect-[4/4.2]" />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="shell grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-8">
          <div className="sticky top-[84px] z-20 -mx-1 mb-12" data-print-hide>
            <nav
              className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-paper/85 p-1 backdrop-blur-xl"
              aria-label="Course sections"
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jump(s.id)}
                  className={clsx(
                    'shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-300',
                    active === s.id ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview */}
          <section id="overview" className="scroll-mt-40">
            <SectionLabel index="01">Overview</SectionLabel>
            <div className="prose-edu mt-6 max-w-2xl" data-reveal>
              {course.description.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-line bg-card p-6 sm:p-8" data-reveal>
              <h2 className="font-display text-2xl">What you will learn</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-[0.95rem] text-ink-2">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-coal">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid gap-10 sm:grid-cols-2" data-reveal>
              <div>
                <h3 className="eyebrow text-ink-3">Skills you will practise</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.tags.map((t) => (
                    <Link key={t} to={`/courses?q=${encodeURIComponent(t)}`} className="rounded-full border border-line px-3 py-1.5 text-sm transition hover:border-ink">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="eyebrow text-ink-3">Before you start</h3>
                <ul className="mt-4 space-y-2 text-[0.95rem] text-ink-2">
                  {course.requirements.map((r) => (
                    <li key={r} className="flex gap-3">
                      <span className="mt-2.5 h-px w-3 shrink-0 bg-ink-3" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          <section id="curriculum" className="mt-24 scroll-mt-40">
            <SectionLabel index="02">Curriculum</SectionLabel>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="display-sm">
                {course.curriculum.length} sections, {course.lessonCount} lessons
              </h2>
              <button
                type="button"
                onClick={() => setOpenSections(allOpen ? [] : course.curriculum.map((_, i) => i))}
                className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-3">{formatMinutes(course.totalMinutes)} total length</p>

            <div className="mt-8 border-t border-line">
              {course.curriculum.map((section, s) => (
                <AccordionItem
                  key={section.title}
                  open={openSections.includes(s)}
                  onToggle={(open) => toggleSection(s, open)}
                  title={
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-ink-3">{String(s + 1).padStart(2, '0')}</span>
                      {section.title}
                    </span>
                  }
                  meta={`${section.lessons.length} lessons / ${formatMinutes(section.duration)}`}
                >
                  <ul className="pb-5 pl-0 sm:pl-9">
                    {section.lessons.map((lesson) => {
                      const Icon = lessonIcons[lesson.type];
                      const done = progress.done.includes(lesson.id);
                      return (
                        <li key={lesson.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.925rem] transition hover:bg-ink/4">
                          <Icon size={16} strokeWidth={1.7} className={done ? 'text-success' : 'text-ink-3'} />
                          <span className={clsx('flex-1', done && 'text-ink-3 line-through decoration-ink-3/40')}>{lesson.title}</span>
                          {lesson.preview && !enrolled && (
                            <button
                              type="button"
                              onClick={() => setPreview(lesson)}
                              className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-medium text-coal"
                            >
                              Preview
                            </button>
                          )}
                          {!lesson.preview && !enrolled && <Lock size={13} className="text-ink-3" aria-label="Locked" />}
                          <span className="w-14 text-right font-mono text-xs text-ink-3">{formatMinutes(lesson.duration)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionItem>
              ))}
            </div>
          </section>

          {/* Instructor */}
          <section id="instructor" className="mt-24 scroll-mt-40">
            <SectionLabel index="03">Your instructor</SectionLabel>
            <div className="mt-8 grid gap-8 rounded-3xl bg-forest p-6 text-on-forest sm:grid-cols-[200px_1fr] sm:p-8" data-reveal>
              <img src={instructor.photo} alt={instructor.name} className="aspect-[4/5] w-full max-w-[220px] rounded-2xl object-cover" loading="lazy" />
              <div className="flex flex-col">
                <p className="eyebrow text-on-forest/60">{instructor.role}</p>
                <h3 className="mt-2 font-display text-4xl tracking-[-0.03em]">{instructor.name}</h3>
                <p className="mt-4 leading-relaxed text-on-forest/80">{instructor.bio}</p>
                <blockquote className="mt-5 border-l-2 border-lime pl-4 font-display text-lg italic">"{instructor.quote}"</blockquote>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                  <div className="flex gap-6 text-sm text-on-forest/70">
                    <span><span className="font-display text-xl text-on-forest">{instructor.experience}</span> years in industry</span>
                    <span>{instructor.location}</span>
                  </div>
                  <Button to={`/instructors/${instructor.id}`} variant="outline-light" size="sm" icon={ChevronRight}>
                    Full profile
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section id="reviews" className="mt-24 scroll-mt-40">
            <SectionLabel index="04">Reviews</SectionLabel>
            <div className="mt-8 grid gap-10 sm:grid-cols-[220px_1fr]" data-reveal>
              <div>
                <p className="font-display text-7xl leading-none tracking-[-0.05em]">{course.rating}</p>
                <Stars rating={course.rating} size={16} className="mt-3" />
                <p className="mt-2 text-sm text-ink-3">{formatNumber(course.reviews)} ratings</p>
              </div>
              <div className="space-y-2.5">
                {distribution.map((pct, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-14 text-ink-2">{5 - i} stars</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
                      <div className="h-full rounded-full bg-clay" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono text-xs text-ink-3">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {enrolled && (
              <div className="mt-10">
                <ReviewForm key={myReview?.at || 'new'} course={course} existing={myReview} />
              </div>
            )}

            <div className="mt-10 grid gap-4 sm:grid-cols-2" data-stagger>
              {allReviews.map((r) => (
                <article key={r.id} className={clsx('rounded-3xl border p-6', r.mine ? 'border-ink bg-card' : 'border-line')}>
                  <div className="flex items-center gap-3">
                    {r.mine ? <Avatar user={user} size={40} /> : <Avatar user={{ name: r.name }} size={40} className="bg-paper-2 text-ink" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.name}</p>
                      <p className="text-xs text-ink-3">{r.role} / {formatDate(r.date)}</p>
                    </div>
                    <Stars rating={r.rating} size={12} />
                  </div>
                  <p className="mt-4 leading-relaxed text-ink-2">{r.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mt-24 scroll-mt-40">
            <SectionLabel index="05">Questions</SectionLabel>
            <FaqList items={faqs.slice(0, 5)} className="mt-8" />
          </section>
        </div>

        {/* Purchase card */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28 rounded-3xl border border-line bg-card p-6 shadow-soft">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl tracking-[-0.04em]">{formatPrice(course.price)}</span>
              {course.originalPrice && <span className="text-lg text-ink-3 line-through">{formatPrice(course.originalPrice)}</span>}
              {discount > 0 && <Tag tone="clay" className="ml-auto">{discount}% off</Tag>}
            </div>
            <p className="mt-2 text-sm text-ink-3">{course.price === 0 ? 'Free forever, certificate included.' : '30-day money-back guarantee.'}</p>

            <div className="mt-6">
              <Magnetic strength={0.15} className="block">
                {purchaseActions()}
              </Magnetic>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const added = toggleWishlist(course.id);
                  toast({ title: added ? 'Saved to wishlist' : 'Removed from wishlist', tone: 'info' });
                }}
                aria-pressed={wished}
                className={clsx(
                  'flex h-11 items-center justify-center gap-2 rounded-full border text-sm transition',
                  wished ? 'border-ink bg-ink/5' : 'border-line hover:border-ink'
                )}
              >
                <Heart size={15} fill={wished ? 'currentColor' : 'none'} /> {wished ? 'Saved' : 'Wishlist'}
              </button>
              <button type="button" onClick={share} className="flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm transition hover:border-ink">
                <Share2 size={15} /> Share
              </button>
            </div>

            <div className="mt-6 border-t border-line pt-6">
              <p className="eyebrow text-ink-3">This course includes</p>
              <ul className="mt-4 space-y-3">
                {includes.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-ink-2">
                    <Icon size={16} strokeWidth={1.7} className="text-ink-3" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-ink-3">
              <RefreshCcw size={12} /> Last updated {formatDate(`${course.updated}-01`, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell">
          <SectionLabel index="06">Keep exploring</SectionLabel>
          <h2 data-split className="display-md mt-6">You might also like</h2>
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {related.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 p-3 backdrop-blur-xl lg:hidden" data-print-hide>
        <div className="flex items-center gap-3">
          {!enrolled && (
            <div className="shrink-0 pl-1">
              <p className="text-lg font-semibold leading-none">{formatPrice(course.price)}</p>
              {course.originalPrice && <p className="mt-1 text-xs text-ink-3 line-through">{formatPrice(course.originalPrice)}</p>}
            </div>
          )}
          <div className="flex-1">
            {purchaseActions(true)}
          </div>
        </div>
      </div>
      <div className="h-24 lg:hidden" />

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="Free preview" size="lg">
        {preview && (
          <div className="p-4 sm:p-6">
            <FauxPlayer course={course} lesson={preview} lessonLabel={`Preview / ${course.curriculum[0].title}`} />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{preview.title}</p>
                <p className="text-sm text-ink-3">{formatMinutes(preview.duration)} / Free preview lesson</p>
              </div>
              {!enrolled && (
                <Button size="sm" onClick={course.price === 0 ? startFree : buyNow} icon={ChevronRight}>
                  {course.price === 0 ? 'Enroll for free' : `Get the course for ${formatPrice(course.price)}`}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseDetail;
