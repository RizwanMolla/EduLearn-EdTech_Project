import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useLenis } from 'lenis/react';
import { ArrowRight, Check, CreditCard, Lock, Smartphone, Wallet, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { getCourse } from '../data/courses';
import CourseCover from '../components/course/CourseCover';
import { EmptyState, SectionLabel } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { usePageTitle } from '../hooks/usePageTitle';
import { cardBrand, computeTotals, expiryValid, formatCardNumber, formatExpiry, luhn } from '../lib/pricing';
import { formatMoney, formatPrice } from '../lib/format';

const methods = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'paypal', label: 'PayPal', icon: Wallet },
];

const CardPreview = ({ form, flipped }) => {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.to(ref.current, { rotateY: flipped ? 180 : 0, duration: prefersReducedMotion() ? 0 : 0.9, ease: 'expo.inOut' });
  }, { dependencies: [flipped] });

  const number = form.number.padEnd(19, ' ').replace(/ /g, (m, i) => ([4, 9, 14].includes(i) ? ' ' : '•'));

  return (
    <div className="mx-auto w-full max-w-[380px] [perspective:1200px]" aria-hidden="true">
      <div ref={ref} className="relative aspect-[1.586] w-full [transform-style:preserve-3d]">
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-forest p-5 text-on-forest shadow-soft [backface-visibility:hidden] sm:p-6">
          <svg viewBox="0 0 400 250" className="absolute inset-0 size-full opacity-30" preserveAspectRatio="xMidYMid slice">
            {[60, 110, 160, 210, 260].map((r) => (
              <circle key={r} cx="400" cy="250" r={r} fill="none" stroke="#d4f36a" strokeWidth="14" />
            ))}
          </svg>
          <div className="relative flex items-start justify-between">
            <span className="font-display text-xl italic">EduLearn</span>
            <span className="font-mono text-xs tracking-wider uppercase">{cardBrand(form.number)}</span>
          </div>
          <div className="relative">
            <div className="mb-4 h-8 w-11 rounded-md bg-[linear-gradient(135deg,#e9d9a6,#b89a52)]" />
            <p className="font-mono text-[clamp(1rem,4.4vw,1.35rem)] tracking-[0.08em] whitespace-pre">{number}</p>
            <div className="mt-3 flex justify-between font-mono text-[0.7rem] uppercase">
              <span className="max-w-[70%] truncate">{form.name || 'Your name'}</span>
              <span>{form.expiry || 'MM/YY'}</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-coal text-cream shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mt-6 h-10 bg-black/80" />
          <div className="mx-5 mt-5 flex items-center justify-end rounded-md bg-cream/90 px-3 py-2 font-mono text-sm text-coal">
            {form.cvv.replace(/./g, '•') || 'CVV'}
          </div>
          <p className="mx-5 mt-4 text-[0.6rem] leading-relaxed text-cream/50">Demo card. No payment is ever processed on EduLearn.</p>
        </div>
      </div>
    </div>
  );
};

const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="field-label">
      {label}
    </label>
    {children}
    {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
  </div>
);

const Checkout = () => {
  const root = useRef(null);
  const lenis = useLenis();
  const { user } = useAuth();
  const { cartCourses, isEnrolled, addToCart, placeOrder } = useLearning();
  const [params, setParams] = useSearchParams();
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ number: '', name: user?.name || '', expiry: '', cvv: '', upi: '' });
  const [errors, setErrors] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  usePageTitle(order ? 'Order confirmed' : 'Checkout');

  // Support links like /checkout?course=7 (and the old /purchase/:id URLs). Runs once on arrival.
  const handledLink = useRef(false);
  useEffect(() => {
    if (handledLink.current) return;
    handledLink.current = true;
    const id = params.get('course');
    if (!id) return;
    const course = getCourse(id);
    if (course) addToCart(course.id);
    const next = new URLSearchParams(params);
    next.delete('course');
    setParams(next, { replace: true });
  }, [params, setParams, addToCart]);

  const items = cartCourses.filter((c) => !isEnrolled(c.id));
  const totals = computeTotals(items, params.get('coupon'));

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.co-fade', { autoAlpha: 0, y: 30, duration: 1, stagger: 0.08, ease: 'expo.out' });
  }, { scope: root, dependencies: [Boolean(order)] });

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (totals.total > 0 && method === 'card') {
      if (!luhn(form.number)) next.number = 'Enter a valid card number. Try 4242 4242 4242 4242.';
      if (!form.name.trim()) next.name = 'Enter the name on the card.';
      if (!expiryValid(form.expiry)) next.expiry = 'Use a future date, MM/YY.';
      if (!/^\d{3,4}$/.test(form.cvv)) next.cvv = '3 or 4 digits.';
    }
    if (totals.total > 0 && method === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(form.upi)) {
      next.upi = 'Enter a UPI ID like name@bank.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pay = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600));
    const record = placeOrder({
      items: items.map((c) => ({ id: c.id, title: c.title, price: c.price })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      coupon: totals.coupon?.code || null,
      method,
    });
    setProcessing(false);
    setOrder(record);
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  };

  if (order) {
    const first = getCourse(order.items[0].id);
    return (
      <div ref={root} className="shell pt-36 pb-28 sm:pt-44">
        <div className="mx-auto max-w-2xl text-center">
          <div className="co-fade mx-auto grid size-20 place-items-center rounded-full bg-lime text-coal">
            <Check size={34} strokeWidth={2.5} />
          </div>
          <p className="co-fade eyebrow mt-8 text-ink-3">Order {order.id}</p>
          <h1 className="co-fade display-lg mt-4">You are in.</h1>
          <p className="co-fade mt-5 text-lg text-ink-2">
            {order.items.length === 1 ? 'Your course is' : `All ${order.items.length} courses are`} ready in your dashboard. A receipt for{' '}
            {formatMoney(order.total)} is saved under Orders.
          </p>
          <ul className="co-fade mt-10 divide-y divide-line rounded-3xl border border-line bg-card text-left">
            {order.items.map((item) => {
              const course = getCourse(item.id);
              return (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <CourseCover course={course} size="sm" className="aspect-square w-14 shrink-0 rounded-lg [&>div]:hidden" />
                  <span className="flex-1 font-medium">{item.title}</span>
                  <Link to={`/learn/${course.slug}`} className="text-sm underline underline-offset-4">
                    Start
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="co-fade mt-10 flex flex-wrap justify-center gap-3">
            <Button to={`/learn/${first.slug}`} size="lg" icon={ArrowRight}>
              Start learning
            </Button>
            <Button to="/dashboard" size="lg" variant="outline">
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-36 pb-10 sm:pt-44">
        <div className="co-fade">
          <SectionLabel>Checkout</SectionLabel>
        </div>
        <h1 className="co-fade display-lg mt-6">Secure checkout.</h1>
        <ol className="co-fade mt-8 flex flex-wrap items-center gap-3 text-sm" aria-label="Checkout steps">
          {['Cart', 'Payment', 'Confirmation'].map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className={clsx(
                  'grid size-7 place-items-center rounded-full font-mono text-xs',
                  i === 0 ? 'bg-success text-paper' : i === 1 ? 'bg-ink text-paper' : 'border border-line-strong text-ink-3'
                )}
              >
                {i === 0 ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className={i === 2 ? 'text-ink-3' : ''}>{step}</span>
              {i < 2 && <span className="h-px w-8 bg-line-strong" />}
            </li>
          ))}
        </ol>
      </header>

      <div className="shell">
        {items.length === 0 ? (
          <EmptyState title="There is nothing to check out" description="Your cart is empty, or you already own everything in it." action={<Button to="/courses">Browse courses</Button>} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <form onSubmit={pay} className="co-fade lg:col-span-7" noValidate>
              <div className="rounded-3xl border border-line bg-card p-5 sm:p-8">
                <div className="flex items-start gap-3 rounded-2xl bg-lime/40 p-4 text-sm text-ink dark:bg-lime/15">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                  <p>
                    This is a demo checkout and no payment is processed. Use the test card <span className="font-mono">4242 4242 4242 4242</span> with any
                    future date.
                  </p>
                </div>

                {totals.total > 0 ? (
                  <>
                    <div className="mt-8 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
                      {methods.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={method === id}
                          onClick={() => setMethod(id)}
                          className={clsx(
                            'flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm transition-all',
                            method === id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'
                          )}
                        >
                          <Icon size={19} strokeWidth={1.7} />
                          {label}
                        </button>
                      ))}
                    </div>

                    {method === 'card' && (
                      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1.1fr] xl:items-center">
                        <CardPreview form={form} flipped={flipped} />
                        <div className="grid gap-4">
                          <Field id="cc-number" label="Card number" error={errors.number}>
                            <input
                              id="cc-number"
                              inputMode="numeric"
                              autoComplete="off"
                              value={form.number}
                              onChange={(e) => update('number', formatCardNumber(e.target.value))}
                              placeholder="4242 4242 4242 4242"
                              className="field font-mono"
                              aria-invalid={Boolean(errors.number)}
                            />
                          </Field>
                          <Field id="cc-name" label="Name on card" error={errors.name}>
                            <input id="cc-name" value={form.name} onChange={(e) => update('name', e.target.value)} className="field" aria-invalid={Boolean(errors.name)} autoComplete="off" />
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field id="cc-exp" label="Expiry" error={errors.expiry}>
                              <input
                                id="cc-exp"
                                inputMode="numeric"
                                value={form.expiry}
                                onChange={(e) => update('expiry', formatExpiry(e.target.value))}
                                placeholder="MM/YY"
                                className="field font-mono"
                                aria-invalid={Boolean(errors.expiry)}
                                autoComplete="off"
                              />
                            </Field>
                            <Field id="cc-cvv" label="CVV" error={errors.cvv}>
                              <input
                                id="cc-cvv"
                                inputMode="numeric"
                                value={form.cvv}
                                onFocus={() => setFlipped(true)}
                                onBlur={() => setFlipped(false)}
                                onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="123"
                                className="field font-mono"
                                aria-invalid={Boolean(errors.cvv)}
                                autoComplete="off"
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                    )}

                    {method === 'upi' && (
                      <div className="mt-8 max-w-md">
                        <Field id="upi" label="UPI ID" error={errors.upi}>
                          <input id="upi" value={form.upi} onChange={(e) => update('upi', e.target.value)} placeholder="yourname@bank" className="field" aria-invalid={Boolean(errors.upi)} />
                        </Field>
                        <p className="mt-3 text-sm text-ink-3">You would normally approve the request in your UPI app. Here it is approved instantly.</p>
                      </div>
                    )}

                    {method === 'paypal' && (
                      <p className="mt-8 max-w-md text-ink-2">
                        You would normally be sent to PayPal to sign in and approve the payment. In this demo the payment is approved
                        instantly when you continue.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-6 text-ink-2">Your coupon covers the full amount. No payment details are needed.</p>
                )}

                <Button type="submit" fullWidth size="lg" className="mt-10" loading={processing} iconLeft={Lock}>
                  {processing ? 'Processing' : totals.total > 0 ? `Pay ${formatMoney(totals.total)}` : 'Complete enrollment'}
                </Button>
              </div>
            </form>

            <aside className="co-fade lg:col-span-5">
              <div className="sticky top-28 rounded-3xl border border-line p-6 sm:p-8">
                <h2 className="font-display text-2xl">Order summary</h2>
                <ul className="mt-6 space-y-4">
                  {items.map((course) => (
                    <li key={course.id} className="flex items-center gap-4">
                      <CourseCover course={course} size="sm" className="aspect-square w-14 shrink-0 rounded-lg [&>div]:hidden" />
                      <span className="min-w-0 flex-1 text-sm leading-snug font-medium">{course.title}</span>
                      <span className="text-sm">{formatPrice(course.price)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-2">Subtotal</dt>
                    <dd>{formatMoney(totals.subtotal)}</dd>
                  </div>
                  {totals.coupon && (
                    <div className="flex justify-between">
                      <dt className="text-ink-2">Coupon {totals.coupon.code}</dt>
                      <dd className="text-success">-{formatMoney(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-line pt-4">
                    <dt className="font-medium">Total due</dt>
                    <dd className="font-display text-4xl tracking-[-0.03em]">{formatMoney(totals.total)}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-xs leading-relaxed text-ink-3">
                  Signed in as {user?.email}. By completing your purchase you agree to the 30-day refund policy.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
