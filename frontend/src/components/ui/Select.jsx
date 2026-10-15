import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const Select = ({ value, onChange, options, label, className, id }) => (
  <div className={clsx('relative', className)}>
    {label && (
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
    )}
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field h-12 cursor-pointer appearance-none py-0 pr-10"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3" />
  </div>
);

export default Select;
