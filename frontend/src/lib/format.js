const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const number = new Intl.NumberFormat('en-US');

export const formatPrice = (value) => (value === 0 ? 'Free' : currency.format(value));
export const formatMoney = (value) => currency.format(value);
export const formatCompact = (value) => compact.format(value);
export const formatNumber = (value) => number.format(value);

export const formatMinutes = (minutes) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const formatHours = (minutes) => {
  const hours = minutes / 60;
  return hours < 10 ? `${hours.toFixed(1).replace(/\.0$/, '')} hours` : `${Math.round(hours)} hours`;
};

export const formatDate = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  new Date(value).toLocaleDateString('en-US', options);

export const pad = (n, size = 2) => String(n).padStart(size, '0');

export const todayKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

// Deterministic pseudo random number from a string, used for stable generated content
export const hashString = (value) => {
  let h = 2166136261;
  const str = String(value);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const seeded = (seed) => {
  let t = hashString(seed);
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};
