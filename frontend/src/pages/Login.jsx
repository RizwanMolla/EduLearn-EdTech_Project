import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageTitle } from '../hooks/usePageTitle';
import { safeRedirect } from '../lib/nav';

const Login = () => {
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const navigate = useNavigate();
  const toast = useToast();
  const { login, loginDemo, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  usePageTitle('Sign in');

  if (isAuthenticated && !submitted) return <Navigate to={redirect} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    setSubmitted(true);
    try {
      const user = await login(email, password);
      toast({ title: `Welcome back, ${user.name.split(' ')[0]}` });
      navigate(redirect, { replace: true });
    } catch (err) {
      setSubmitted(false);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const demo = () => {
    setSubmitted(true);
    loginDemo();
    toast({ title: 'Signed in to the demo account', description: 'Sample progress is already in place. Explore freely.' });
    navigate(redirect, { replace: true });
  };

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to keep learning." quoteIndex={0}>
      <button
        type="button"
        onClick={demo}
        className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-card p-4 text-left transition hover:border-ink"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-coal">
          <Sparkles size={18} />
        </span>
        <span className="flex-1">
          <span className="block font-medium">Continue with the demo account</span>
          <span className="block text-sm text-ink-3">No sign-up. Comes with sample progress.</span>
        </span>
        <ArrowRight size={17} className="text-ink-3 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="my-8 flex items-center gap-4 text-xs text-ink-3">
        <span className="h-px flex-1 bg-line" /> or use your account <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <div role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger/8 p-3.5 text-sm text-danger">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <Link to="/contact?topic=general" className="text-xs text-ink-3 underline-offset-4 hover:text-ink hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        <Button type="submit" fullWidth size="lg" loading={loading} icon={ArrowRight}>
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-2">
        New to EduLearn?{' '}
        <Link to={`/signup${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-medium text-ink underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
