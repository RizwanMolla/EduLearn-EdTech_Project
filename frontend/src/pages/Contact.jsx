import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowRight, Check, Mail, MessageSquare, Clock } from 'lucide-react';
import { SectionLabel } from '../components/ui/Bits';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { socials } from '../data/site';

const topics = [
  { value: 'general', label: 'General question' },
  { value: 'advice', label: 'Help choosing a course' },
  { value: 'billing', label: 'Billing and refunds' },
  { value: 'teams', label: 'EduLearn for Teams' },
  { value: 'teaching', label: 'Teaching on EduLearn' },
];

const Contact = () => {
  const root = useRef(null);
  const [params] = useSearchParams();
  const { user } = useAuth();
  const initialTopic = topics.some((t) => t.value === params.get('topic')) ? params.get('topic') : 'general';
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', topic: initialTopic, message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  usePageTitle('Contact');
  useScrollReveal(root);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.message.trim().length < 20) next.message = 'A little more detail helps us help you (20 characters or more).';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('sending');
    // Demo only: the message is not sent anywhere
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
  };

  return (
    <div ref={root} className="pb-28">
      <header className="shell pt-36 pb-12 sm:pt-44">
        <SectionLabel>Contact</SectionLabel>
        <h1 data-split className="display-lg mt-6 max-w-4xl">
          Questions, ideas or feedback? Write to us.
        </h1>
      </header>

      <div className="shell grid gap-12 lg:grid-cols-12">
        <aside className="space-y-8 lg:col-span-4" data-stagger>
          {[
            { icon: Mail, title: 'Email', body: 'hello@edulearn.app', note: 'For anything at all.' },
            { icon: Clock, title: 'Response time', body: 'Within 2 business days', note: 'Usually much faster.' },
            { icon: MessageSquare, title: 'Common questions', body: 'Refunds, certificates, access', note: 'See the FAQ on the pricing page.' },
          ].map(({ icon: Icon, title, body, note }) => (
            <div key={title} className="flex gap-4 border-b border-line pb-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/6">
                <Icon size={18} />
              </span>
              <div>
                <p className="eyebrow text-ink-3">{title}</p>
                <p className="mt-2 font-display text-xl">{body}</p>
                <p className="mt-1 text-sm text-ink-3">{note}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-6 text-sm">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-sweep">
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-8" data-reveal>
          {status === 'sent' ? (
            <div className="flex min-h-[440px] flex-col items-start justify-center rounded-[28px] bg-forest p-8 text-on-forest sm:p-12">
              <span className="grid size-14 place-items-center rounded-full bg-lime text-coal">
                <Check size={26} strokeWidth={2.5} />
              </span>
              <h2 className="display-md mt-8">Thanks, {form.name.split(' ')[0]}.</h2>
              <p className="mt-4 max-w-md text-on-forest/75">
                Your message is with us. We reply to {form.email} within two business days. (This is a demo, so nothing
                was actually sent.)
              </p>
              <Button
                variant="outline-light"
                className="mt-8"
                onClick={() => {
                  setStatus('idle');
                  setForm((f) => ({ ...f, message: '' }));
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5 rounded-[28px] border border-line bg-card p-6 sm:grid-cols-2 sm:p-10" noValidate>
              <div>
                <label htmlFor="c-name" className="field-label">Your name</label>
                <input id="c-name" value={form.name} onChange={(e) => update('name', e.target.value)} className="field" aria-invalid={Boolean(errors.name)} autoComplete="name" />
                {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="field-label">Email</label>
                <input id="c-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="field" aria-invalid={Boolean(errors.email)} autoComplete="email" />
                {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-topic" className="field-label">Topic</label>
                <Select id="c-topic" value={form.topic} onChange={(v) => update('topic', v)} options={topics} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="field-label">Message</label>
                <textarea
                  id="c-message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className="field resize-none"
                  placeholder="What can we help with?"
                  aria-invalid={Boolean(errors.message)}
                />
                <div className="mt-1.5 flex justify-between text-xs">
                  <span className="text-danger">{errors.message}</span>
                  <span className="text-ink-3">{form.message.length} / 1000</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                <p className="text-sm text-ink-3">We never share your details.</p>
                <Button type="submit" size="lg" icon={ArrowRight} loading={status === 'sending'}>
                  Send message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
