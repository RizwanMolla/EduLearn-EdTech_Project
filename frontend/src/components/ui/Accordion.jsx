import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

// Height animates with CSS grid rows (0fr -> 1fr), no measuring needed
export const AccordionItem = ({ title, meta, children, defaultOpen = false, open: controlled, onToggle, className }) => {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const id = useId();

  const toggle = () => {
    if (onToggle) onToggle(!open);
    else setInternal(!open);
  };

  return (
    <div className={clsx('border-b border-line', className)}>
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full items-center gap-4 py-5 text-left"
        >
          <span className="flex-1 text-[1.05rem] font-medium tracking-[-0.01em] transition-colors group-hover:text-ink-2">{title}</span>
          {meta && <span className="hidden text-sm text-ink-3 sm:block">{meta}</span>}
          <span
            className={clsx(
              'grid size-8 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo',
              open ? 'rotate-45 border-ink bg-ink text-paper' : 'group-hover:border-ink'
            )}
          >
            <Plus size={15} />
          </span>
        </button>
      </h3>
      <div
        id={id}
        className={clsx(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export const FaqList = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className={clsx('border-t border-line', className)}>
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          title={item.q}
          open={openIndex === i}
          onToggle={(next) => setOpenIndex(next ? i : -1)}
        >
          <p className="max-w-2xl pb-6 text-[0.975rem] leading-relaxed text-ink-2">{item.a}</p>
        </AccordionItem>
      ))}
    </div>
  );
};
