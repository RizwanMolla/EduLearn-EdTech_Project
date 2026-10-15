import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Heart, Lock, Tag as TagIcon, X } from 'lucide-react';
import { getInstructor } from '../data/instructors';
import CourseCover from '../components/course/CourseCover';
import { CourseCard } from '../components/course/CourseCard';
import { EmptyState, SectionLabel } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { computeTotals, findCoupon } from '../lib/pricing';
import { formatHours, formatMoney, formatPrice } from '../lib/format';

const Cart = () => {
  const root = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { cartCourses, removeFromCart, toggleWishlist, inWishlist, wishlistCourses, isEnrolled } = useLearning();
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState('');
  const [error, setError] = useState('');
  usePageTitle('Cart');
  useScrollReveal(root);

  const items = cartCourses.filter((c) => !isEnrolled(c.id));
  const totals = computeTotals(items, applied);
  const suggestions = wishlistCourses.filter((c) => !items.some((i) => i.id === c.id) && !isEnrolled(c.id)).slice(0, 3);

  const apply = (e) => {
    e.preventDefault();
    if (!findCoupon(code)) {
      setError('That code is not valid. Try LEARN20.');
      return;
    }
    setError('');
    setApplied(code.trim().toUpperCase());
    toast({ title: 'Coupon applied', description: findCoupon(code).label });
  };

  const checkout = () => {
    const target = `/checkout${applied ? `?coupon=${applied}` : ''}`;
    navigate(isAuthenticated ? target : `/login?redirect=${encodeURIComponent(target)}`);
  };

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-36 pb-12 sm:pt-44">
        <SectionLabel index={String(items.length).padStart(2, '0')}>Your cart</SectionLabel>
        <h1 key={items.length ? "full" : "empty"} data-split className="display-lg mt-6">
          {items.length ? 'Almost there.' : 'Your cart is empty.'}
        </h1>
      </header>

      <div className="shell">
        {items.length === 0 ? (
          <EmptyState
            title="Nothing in your cart yet"
            description="Add a course from the catalogue and it will wait for you here."
            action={
              <Button to="/courses" icon={ArrowRight}>
                Browse courses
              </Button>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <ul className="border-t border-line lg:col-span-8" data-stagger>
              {items.map((course) => (
                <li key={course.id} className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[160px_1fr_auto] sm:gap-6">
                  <Link to={`/courses/${course.slug}`}>
                    <CourseCover course={course} size="sm" className="aspect-[4/3] rounded-xl" />
                  </Link>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
                      <Link to={`/courses/${course.slug}`} className="link-sweep">
                        {course.title}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-sm text-ink-3">
                      {getInstructor(course.instructor).name} / {formatHours(course.totalMinutes)} / {course.lessonCount} lessons
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(course.id);
                          toast({ title: 'Removed from cart', description: course.title, tone: 'info' });
                        }}
                        className="inline-flex items-center gap-1.5 text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                      >
                        <X size={14} /> Remove
                      </button>
                      {!inWishlist(course.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist(course.id);
                            removeFromCart(course.id);
                            toast({ title: 'Moved to wishlist', description: course.title, tone: 'info' });
                          }}
                          className="inline-flex items-center gap-1.5 text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                        >
                          <Heart size={14} /> Save for later
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-start-2 sm:col-start-auto sm:text-right">
                    <p className="text-xl font-semibold">{formatPrice(course.price)}</p>
                    {course.originalPrice && <p className="text-sm text-ink-3 line-through">{formatPrice(course.originalPrice)}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 rounded-3xl border border-line bg-card p-6" data-reveal>
                <h2 className="font-display text-2xl">Summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-2">Subtotal</dt>
                    <dd>{formatMoney(totals.subtotal)}</dd>
                  </div>
                  {totals.savings > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-ink-2">Launch pricing</dt>
                      <dd className="text-success">You save {formatMoney(totals.savings)}</dd>
                    </div>
                  )}
                  {totals.coupon && (
                    <div className="flex justify-between">
                      <dt className="flex items-center gap-2 text-ink-2">
                        Coupon <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[0.65rem] text-coal">{totals.coupon.code}</span>
                        <button type="button" onClick={() => setApplied('')} aria-label="Remove coupon" className="text-ink-3 hover:text-ink">
                          <X size={13} />
                        </button>
                      </dt>
                      <dd className="text-success">-{formatMoney(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-line pt-4">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-display text-4xl tracking-[-0.03em]">{formatMoney(totals.total)}</dd>
                  </div>
                </dl>

                {!totals.coupon && (
                  <form onSubmit={apply} className="mt-6" noValidate>
                    <label htmlFor="coupon" className="field-label">
                      Coupon code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" />
                        <input
                          id="coupon"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="LEARN20"
                          className="field h-11 pl-10 uppercase placeholder:normal-case"
                          aria-invalid={Boolean(error)}
                        />
                      </div>
                      <Button type="submit" variant="outline" size="md">
                        Apply
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-ink-3">{error ? <span className="text-danger">{error}</span> : 'Demo codes: LEARN20 or FIRSTCLASS'}</p>
                  </form>
                )}

                <Button onClick={checkout} fullWidth size="lg" className="mt-6" icon={ArrowRight}>
                  Checkout
                </Button>
                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-3">
                  <Lock size={12} /> 30-day money-back guarantee
                </p>
              </div>
            </aside>
          </div>
        )}

        {suggestions.length > 0 && (
          <section className="mt-24">
            <SectionLabel>From your wishlist</SectionLabel>
            <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              {suggestions.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Cart;
