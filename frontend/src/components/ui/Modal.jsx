import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ open, onClose, title, children, className, size = 'md', hideHeader }) => {
  const lenis = useLenis();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      lenis?.start();
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose, lenis]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[105] flex items-end justify-center p-0 sm:items-center sm:p-6" data-lenis-prevent>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 animate-[fade-in_0.3s_ease] bg-coal/55 backdrop-blur-[3px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={clsx(
          'relative max-h-[92dvh] w-full animate-[pop-in_0.45s_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto rounded-t-3xl border border-line bg-paper shadow-soft outline-none sm:rounded-3xl',
          size === 'sm' && 'sm:max-w-md',
          size === 'md' && 'sm:max-w-xl',
          size === 'lg' && 'sm:max-w-3xl',
          size === 'xl' && 'sm:max-w-5xl',
          className
        )}
      >
        {!hideHeader && (
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/95 px-6 py-4 backdrop-blur">
            <h2 className="font-display text-xl">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full border border-line transition hover:border-ink"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
