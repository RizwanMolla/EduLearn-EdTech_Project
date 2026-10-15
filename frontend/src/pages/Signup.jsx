import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, AlertTriangle, Check } from 'lucide-react';
import clsx from 'clsx';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';
import Button from '../components/ui/Button';
import { safeRedirect } from '../lib/nav';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageTitle } from '../hooks/usePageTitle';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'A number', test: (p) => /\d/.test(p) },
  { label: 'Upper and lower case', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: 'A symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

const Signup = () => {
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const navigate = useNavigate();
  const toast = useToast();
  const { signup, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', terms: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  usePageTitle('Create account');

  if (isAuthenticated && !submitted) return <Navigate to={redirect} replace />;

  const passed = rules.filter((r) => r.test(form.password)).length;

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const next = {};
    if (!form.name.trim()) next.name = 'Tell us what to call you.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (!form.terms) next.terms = 'Please accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setSubmitted(true);
    try {
      await signup(form.email, form.password, form.name.trim());
      toast({ title: `Welcome to EduLearn, ${form.name.trim().split(' ')[0]}`, description: 'Your account is ready.' });
      navigate(redirect, { replace: true });
    } catch (err) {
      setSubmitted(false);
      setServerError(err.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Join EduLearn" title="Start learning by building." quoteIndex={3}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError && (
          <div role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger/8 p-3.5 text-sm text-danger">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <span>
              {serverError}{' '}
              <Link to="/login" className="underline underline-offset-4">
                Try the demo account instead.
              </Link>
            </span>
          </div>
        )}
        <div>
          <label htmlFor="name" className="field-label">Full name</label>
          <input id="name" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} className="field" aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="field" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <PasswordInput id="password" value={form.password} onChange={(v) => update('password', v)} autoComplete="new-password" invalid={Boolean(errors.password)} />
          {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password}</p>}
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={clsx(
                  'h-1 flex-1 rounded-full transition-colors duration-500',
                  i < passed ? (passed <= 1 ? 'bg-danger' : passed === 2 ? 'bg-clay' : 'bg-success') : 'bg-ink/10'
                )}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {rules.map((r) => {
                const ok = r.test(form.password);
                return (
                  <li key={r.label} className={clsx('flex items-center gap-1.5 text-xs transition-colors', ok ? 'text-ink' : 'text-ink-3')}>
                    <Check size={12} className={ok ? 'text-success' : 'opacity-30'} strokeWidth={3} />
                    {r.label}
                  </li>
                );
              })}
            </ul>
            {form.password && <span className="shrink-0 text-xs text-ink-2">{strengthLabel[passed]}</span>}
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
          <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} className="mt-0.5 size-4 accent-[var(--ink)]" />
          <span>I agree to the terms and the 30-day refund policy, and I understand this is a portfolio demo.</span>
        </label>
        {errors.terms && <p className="-mt-3 text-xs text-danger">{errors.terms}</p>}
        <Button type="submit" fullWidth size="lg" loading={loading} icon={ArrowRight}>
          Create account
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-2">
        Already have an account?{' '}
        <Link to={`/login${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default Signup;
