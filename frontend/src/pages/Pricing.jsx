import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Minus, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { plans, comparison, faqs } from '../data/site';
import { PageHeader, SectionLabel, Tag } from '../components/ui/Bits';
import { FaqList } from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import Magnetic from '../components/ui/Magnetic';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';

const AnimatedPrice = ({ value }) => {
  const ref = useRef(null);
  const shown = useRef(value);

  useGSAP(() => {
    const state = { n: shown.current };
    gsap.to(state, {
      n: value,
      duration: prefersReducedMotion() ? 0 : 0.8,
      ease: 'expo.out',
      onUpdate: () => {
        shown.current = state.n;
        if (ref.current) ref.current.textContent = Math.round(state.n);
      },
    });
  }, { dependencies: [value] });

  return <span ref={ref}>{value}</span>;
};

const Cell = ({ value }) => {
  if (value === true) return <Check size={17} className="mx-auto text-success" aria-label="Included" />;
  if (value === false) return <Minus size={17} className="mx-auto text-ink-3" aria-label="Not included" />;
  return <span className="text-sm">{value}</span>;
};

const Pricing = () => {
  const root = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { data, setPlan } = useLearning();
  const [yearly, setYearly] = useState(true);
  usePageTitle('Pricing');
  useScrollReveal(root);

  const choose = (plan) => {
    if (plan.id === 'starter') {
      navigate('/courses?price=free');
      return;
    }
    if (plan.id === 'teams') {
      navigate('/contact?topic=teams');
      return;
    }
    if (!isAuthenticated) {
      navigate(`/signup?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }
    setPlan(plan.id);
    toast({ title: `You are on ${plan.name}`, description: 'Demo upgrade, no payment taken. Your dashboard now shows the plan.' });
  };

  return (
    <div ref={root} className="pb-28">
      <PageHeader label="Pricing" title="Simple plans. Honest refunds.">
        <div className="flex flex-wrap items-center gap-4" data-reveal>
          <div className="relative flex rounded-full border border-line bg-card p-1" role="radiogroup" aria-label="Billing period">
            <span
              className={clsx(
                'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-out-expo',
                yearly ? 'translate-x-full' : 'translate-x-0'
              )}
              aria-hidden="true"
            />
            {[
              { id: false, label: 'Monthly' },
              { id: true, label: 'Yearly' },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={yearly === opt.id}
                onClick={() => setYearly(opt.id)}
                className={clsx('relative w-28 rounded-full py-2.5 text-sm transition-colors duration-300', yearly === opt.id ? 'text-paper' : 'text-ink-2')}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Tag tone="lime">Save up to 21% yearly</Tag>
        </div>
      </PageHeader>

      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-3" data-stagger>
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const current = isAuthenticated && data.plan === plan.id;
            return (
              <article
                key={plan.id}
                className={clsx(
                  'relative flex flex-col rounded-[28px] p-7 sm:p-9',
                  plan.highlighted ? 'bg-forest text-on-forest' : 'border border-line bg-card'
                )}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl tracking-[-0.03em]">{plan.name}</h2>
                  {plan.highlighted && <Tag tone="lime">Most popular</Tag>}
                  {current && !plan.highlighted && <Tag tone="ink">Current plan</Tag>}
                </div>
                <p className={clsx('mt-2 text-sm', plan.highlighted ? 'text-on-forest/70' : 'text-ink-3')}>{plan.blurb}</p>
                <p className="mt-8 flex items-baseline gap-1">
                  <span className="font-display text-7xl leading-none tracking-[-0.05em]">
                    $<AnimatedPrice value={price} />
                  </span>
                  <span className={clsx('text-sm', plan.highlighted ? 'text-on-forest/60' : 'text-ink-3')}>
                    {price === 0 ? 'forever' : plan.id === 'teams' ? '/ seat / month' : '/ month'}
                  </span>
                </p>
                <p className={clsx('mt-2 h-5 text-xs', plan.highlighted ? 'text-on-forest/60' : 'text-ink-3')}>
                  {price > 0 && (yearly ? `Billed ${'$'}${price * 12} yearly` : 'Billed monthly, cancel anytime')}
                </p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[0.95rem]">
                      <span
                        className={clsx(
                          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                          plan.highlighted ? 'bg-lime text-coal' : 'bg-ink/8 text-ink'
                        )}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  {plan.highlighted ? (
                    <Magnetic className="block" strength={0.2}>
                      <Button variant="lime" size="lg" fullWidth icon={ArrowRight} onClick={() => choose(plan)} disabled={current}>
                        {current ? 'Your current plan' : plan.cta}
                      </Button>
                    </Magnetic>
                  ) : (
                    <Button variant="outline" size="lg" fullWidth onClick={() => choose(plan)} disabled={current}>
                      {current ? 'Your current plan' : plan.cta}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-28">
          <SectionLabel index="01">Compare plans</SectionLabel>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-line" data-reveal>
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-5 text-sm font-normal text-ink-3">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className={clsx('p-5 text-center font-display text-xl font-normal', p.highlighted && 'bg-ink/4')}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 text-[0.95rem] font-normal">{row.feature}</th>
                    <td className="p-5 text-center"><Cell value={row.starter} /></td>
                    <td className="bg-ink/4 p-5 text-center"><Cell value={row.pro} /></td>
                    <td className="p-5 text-center"><Cell value={row.teams} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="mt-28 grid scroll-mt-28 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="02">Questions</SectionLabel>
            <h2 data-split className="display-md mt-6">
              Before you decide.
            </h2>
          </div>
          <FaqList items={faqs} className="lg:col-span-8" />
        </section>
      </div>
    </div>
  );
};

export default Pricing;
