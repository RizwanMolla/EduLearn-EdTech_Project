import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './contexts';
import { Check, Info, X, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const icons = { success: Check, info: Info, error: AlertTriangle };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 320);
  }, []);

  const toast = useCallback((input) => {
    counter.current += 1;
    const id = counter.current;
    const item = typeof input === 'string' ? { title: input } : input;
    setToasts((list) => [...list.slice(-3), { tone: 'success', ...item, id }]);
    setTimeout(() => dismiss(id), item.duration || 3800);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        aria-live="polite"
        data-print-hide
      >
        {toasts.map((t) => {
          const Icon = icons[t.tone] || Info;
          return (
            <div
              key={t.id}
              role="status"
              className={clsx(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-coal py-3.5 pr-3 pl-4 text-cream shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]',
                t.leaving ? 'animate-[toast-out_0.3s_ease_forwards]' : 'animate-[toast-in_0.5s_cubic-bezier(0.16,1,0.3,1)]'
              )}
            >
              <span
                className={clsx(
                  'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full',
                  t.tone === 'error' ? 'bg-clay text-coal' : 'bg-lime text-coal'
                )}
              >
                <Icon size={14} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[0.8rem] text-cream/60">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="grid size-7 shrink-0 place-items-center rounded-full text-cream/50 transition hover:bg-white/10 hover:text-cream"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
