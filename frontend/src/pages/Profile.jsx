import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Camera, UserRound, ShieldCheck, SlidersHorizontal, Database, Moon, Sun, Trash2, LogOut } from 'lucide-react';
import clsx from 'clsx';
import AvatarCropper from '../components/auth/AvatarCropper';
import { cropToDataUrl } from '../lib/image';
import PasswordInput from '../components/auth/PasswordInput';
import { Avatar, SectionLabel, Tag } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { readJSON, writeJSON } from '../lib/storage';
import { formatDate, formatMinutes } from '../lib/format';

const tabs = [
  { id: 'account', label: 'Account', icon: UserRound },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'data', label: 'Your data', icon: Database },
];

const Toggle = ({ checked, onChange, label, description }) => (
  <label className="flex cursor-pointer items-start justify-between gap-6 border-b border-line py-5">
    <span>
      <span className="block font-medium">{label}</span>
      <span className="mt-1 block text-sm text-ink-3">{description}</span>
    </span>
    <span className="relative mt-1 shrink-0">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="block h-7 w-12 rounded-full bg-ink/15 transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2" />
      <span className="absolute top-1 left-1 size-5 rounded-full bg-paper shadow transition-transform duration-300 ease-out-expo peer-checked:translate-x-5" />
    </span>
  </label>
);

const AccountTab = () => {
  const { user, isDemo, updateProfile, updateAvatar } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState(user.name);
  const [headline, setHeadline] = useState(user.headline || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      toast({ title: 'Choose a PNG, JPEG or WebP image', tone: 'error' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'That image is over 8 MB', tone: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const savePhoto = async (area) => {
    setSavingPhoto(true);
    try {
      const dataUrl = await cropToDataUrl(cropSrc, area);
      await updateAvatar(dataUrl);
      setCropSrc(null);
      toast({ title: 'Profile photo updated' });
    } catch (err) {
      toast({ title: 'Could not save your photo', description: err.message, tone: 'error' });
    } finally {
      setSavingPhoto(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Your name cannot be empty.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), headline: headline.trim() });
      toast({ title: 'Profile saved' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative">
          <Avatar user={user} size={96} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full border-4 border-paper bg-ink text-paper transition hover:scale-105"
            aria-label="Change profile photo"
          >
            <Camera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pick} className="sr-only" tabIndex={-1} />
        </div>
        <div>
          <p className="font-display text-3xl tracking-[-0.03em]">{user.name}</p>
          <p className="text-ink-3">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {isDemo && <Tag tone="clay">Demo account, changes stay in this browser</Tag>}
            {user.createdAt && <Tag>Member since {formatDate(user.createdAt, { month: 'long', year: 'numeric' })}</Tag>}
          </div>
        </div>
      </div>

      <form onSubmit={save} className="grid max-w-2xl gap-5" noValidate>
        <div>
          <label htmlFor="p-name" className="field-label">Display name</label>
          <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="field" aria-invalid={Boolean(error)} />
        </div>
        <div>
          <label htmlFor="p-headline" className="field-label">Headline</label>
          <input
            id="p-headline"
            value={headline}
            maxLength={120}
            onChange={(e) => setHeadline(e.target.value)}
            className="field"
            placeholder="For example: Designer learning to code"
          />
          <p className="mt-1.5 text-right text-xs text-ink-3">{headline.length} / 120</p>
        </div>
        <div>
          <label htmlFor="p-email" className="field-label">Email</label>
          <input id="p-email" value={user.email} disabled className="field cursor-not-allowed opacity-60" />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div>
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>

      <Modal open={Boolean(cropSrc)} onClose={() => setCropSrc(null)} title="Crop your photo" size="sm">
        {cropSrc && <AvatarCropper src={cropSrc} onCancel={() => setCropSrc(null)} onSave={savePhoto} saving={savingPhoto} />}
      </Modal>
    </div>
  );
};

const SecurityTab = () => {
  const { changePassword, isDemo } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.current || !form.next) {
      setError('Fill in your current and new password.');
      return;
    }
    if (form.next.length < 8) {
      setError('Your new password needs at least 8 characters.');
      return;
    }
    if (form.next !== form.confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await changePassword(form.current, form.next);
      setForm({ current: '', next: '', confirm: '' });
      toast({ title: 'Password updated' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid max-w-xl gap-5" noValidate>
      {isDemo && (
        <p className="rounded-xl bg-clay/12 p-4 text-sm text-ink-2">
          The demo account has no password. Create an account to try this, it takes a few seconds.
        </p>
      )}
      <div>
        <label htmlFor="pw-current" className="field-label">Current password</label>
        <PasswordInput id="pw-current" value={form.current} onChange={(v) => setForm((f) => ({ ...f, current: v }))} autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="pw-new" className="field-label">New password</label>
        <PasswordInput id="pw-new" value={form.next} onChange={(v) => setForm((f) => ({ ...f, next: v }))} autoComplete="new-password" />
      </div>
      <div>
        <label htmlFor="pw-confirm" className="field-label">Confirm new password</label>
        <PasswordInput id="pw-confirm" value={form.confirm} onChange={(v) => setForm((f) => ({ ...f, confirm: v }))} autoComplete="new-password" />
      </div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      <div>
        <Button type="submit" loading={loading}>
          Update password
        </Button>
      </div>
    </form>
  );
};

const PreferencesTab = () => {
  const { theme, setTheme } = useTheme();
  const { data, setGoal } = useLearning();
  const [prefs, setPrefs] = useState(() => readJSON('edulearn:prefs', { weekly: true, courses: true, reminders: false, autoplay: true }));

  const update = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    writeJSON('edulearn:prefs', next);
  };

  return (
    <div className="max-w-2xl">
      <p className="eyebrow text-ink-3">Appearance</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { id: 'light', label: 'Light', icon: Sun },
          { id: 'dark', label: 'Dark', icon: Moon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={(e) => theme !== id && setTheme(id, e)}
            aria-pressed={theme === id}
            className={clsx(
              'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
              theme === id ? 'border-ink bg-ink/5' : 'border-line hover:border-ink'
            )}
          >
            <span className={clsx('grid size-10 place-items-center rounded-full', id === 'dark' ? 'bg-coal text-cream' : 'bg-[#f2eee5] text-coal ring-1 ring-black/10')}>
              <Icon size={17} />
            </span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      <p className="eyebrow mt-12 text-ink-3">Weekly learning goal</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[60, 120, 180, 240, 360].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setGoal(m)}
            aria-pressed={data.goal === m}
            className={clsx(
              'rounded-full border px-4 py-2 text-sm transition',
              data.goal === m ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'
            )}
          >
            {formatMinutes(m)}
          </button>
        ))}
      </div>

      <p className="eyebrow mt-12 text-ink-3">Email</p>
      <div className="mt-2">
        <Toggle checked={prefs.weekly} onChange={(v) => update('weekly', v)} label="Weekly progress summary" description="A short email every Monday with your streak and next lessons." />
        <Toggle checked={prefs.courses} onChange={(v) => update('courses', v)} label="New courses in my subjects" description="At most one email a month." />
        <Toggle checked={prefs.reminders} onChange={(v) => update('reminders', v)} label="Gentle reminders" description="A nudge if you have not learned for three days." />
        <Toggle checked={prefs.autoplay} onChange={(v) => update('autoplay', v)} label="Autoplay next lesson" description="Start the next video when one finishes." />
      </div>
    </div>
  );
};

const DataTab = () => {
  const { logout } = useAuth();
  const { resetLearning, enrolledCourses, minutesLearned } = useLearning();
  const toast = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-line p-6">
        <p className="font-medium">Learning data</p>
        <p className="mt-1 text-sm text-ink-3">
          {enrolledCourses.length} enrolled courses and {formatMinutes(minutesLearned)} of learning history. Progress is saved in this
          browser and synced to your account when you are signed in with email.
        </p>
      </div>
      <div className="rounded-3xl border border-danger/30 p-6">
        <p className="font-medium text-danger">Reset learning progress</p>
        <p className="mt-1 text-sm text-ink-3">Clears enrolments, progress, notes, orders and your wishlist. This cannot be undone.</p>
        <Button variant="danger" className="mt-5" iconLeft={Trash2} onClick={() => setConfirm(true)}>
          Reset progress
        </Button>
      </div>
      <Button
        variant="outline"
        iconLeft={LogOut}
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Sign out
      </Button>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset all progress?" size="sm">
        <div className="p-6">
          <p className="text-ink-2">Everything you have done on EduLearn in this account will be cleared.</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep my progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetLearning();
                setConfirm(false);
                toast({ title: 'Progress reset', tone: 'info' });
              }}
            >
              Reset everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Profile = () => {
  const root = useRef(null);
  const [params, setParams] = useSearchParams();
  const tab = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'account';
  usePageTitle('Profile');
  useScrollReveal(root);

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-36 pb-12 sm:pt-44">
        <SectionLabel>Settings</SectionLabel>
        <h1 data-split className="display-lg mt-6">
          Your profile.
        </h1>
      </header>

      <div className="shell grid gap-10 lg:grid-cols-12">
        <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:col-span-3 lg:mx-0 lg:flex-col lg:px-0" aria-label="Settings sections" data-reveal>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setParams(id === 'account' ? {} : { tab: id }, { replace: true, preventScrollReset: true })}
              aria-current={tab === id ? 'page' : undefined}
              className={clsx(
                'flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors lg:rounded-2xl',
                tab === id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/6 hover:text-ink'
              )}
            >
              <Icon size={16} strokeWidth={1.8} /> {label}
            </button>
          ))}
        </nav>
        <section key={tab} className="animate-[pop-in_0.5s_cubic-bezier(0.16,1,0.3,1)] lg:col-span-9">
          {tab === 'account' && <AccountTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'preferences' && <PreferencesTab />}
          {tab === 'data' && <DataTab />}
        </section>
      </div>
    </div>
  );
};

export default Profile;
