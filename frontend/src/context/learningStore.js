import { courses, getCourse } from '../data/courses';
import { seeded, todayKey } from '../lib/format';

export const emptyStore = () => ({
  version: 1,
  enrolled: {},
  progress: {},
  notes: {},
  quiz: {},
  reviews: {},
  certificates: {},
  wishlist: [],
  cart: [],
  activity: {},
  orders: [],
  goal: 180,
  plan: 'starter',
});

export const storageKey = (key) => `edulearn:learning:${key}`;

export const isEmptyStore = (data) =>
  !Object.keys(data.enrolled).length && !data.orders.length && !Object.keys(data.activity).length;

const union = (a = [], b = []) => [...new Set([...a, ...b])];

// Merge two stores without losing progress made on either side
export const mergeStores = (local, remote = {}, purchased = []) => {
  const base = { ...emptyStore(), ...local };
  const other = { ...emptyStore(), ...remote };
  const merged = { ...base };

  merged.enrolled = { ...other.enrolled, ...base.enrolled };
  purchased.forEach((id) => {
    if (getCourse(id) && !merged.enrolled[String(getCourse(id).id)]) {
      merged.enrolled[String(getCourse(id).id)] = { at: new Date().toISOString() };
    }
  });

  merged.progress = { ...other.progress };
  Object.entries(base.progress).forEach(([id, p]) => {
    const o = merged.progress[id];
    merged.progress[id] = o
      ? { done: union(o.done, p.done), last: p.at > o.at ? p.last : o.last, at: p.at > o.at ? p.at : o.at }
      : p;
  });

  merged.notes = { ...other.notes };
  Object.entries(base.notes).forEach(([id, n]) => {
    merged.notes[id] = { ...(other.notes[id] || {}), ...n };
  });

  merged.quiz = { ...other.quiz, ...base.quiz };
  merged.reviews = { ...other.reviews, ...base.reviews };
  merged.certificates = { ...other.certificates, ...base.certificates };
  merged.wishlist = union(other.wishlist, base.wishlist);
  merged.cart = union(other.cart, base.cart);

  merged.activity = { ...other.activity };
  Object.entries(base.activity).forEach(([day, minutes]) => {
    merged.activity[day] = Math.max(minutes, merged.activity[day] || 0);
  });

  const orderIds = new Set(base.orders.map((o) => o.id));
  merged.orders = [...base.orders, ...other.orders.filter((o) => !orderIds.has(o.id))].sort((a, b) =>
    b.at.localeCompare(a.at)
  );
  merged.goal = base.goal || other.goal;
  merged.plan = base.plan !== 'starter' ? base.plan : other.plan;
  return merged;
};

export const certificateId = (courseId, userKey) => {
  const rand = seeded(`${courseId}-${userKey}`);
  const block = () => Math.floor(rand() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `EDU-${block()}-${block()}-${block()}`;
};

// Sample progress for the demo account, so the dashboard has something to show
export const seedDemoStore = () => {
  const data = emptyStore();
  const now = new Date();
  const daysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };

  const plan = [
    { id: 1, fraction: 0.62, enrolledDays: 54 },
    { id: 13, fraction: 0.34, enrolledDays: 12 },
    { id: 11, fraction: 1, enrolledDays: 80 },
    { id: 18, fraction: 0.12, enrolledDays: 3 },
  ];

  plan.forEach(({ id, fraction, enrolledDays }, index) => {
    const course = courses.find((c) => c.id === id);
    const count = Math.round(course.lessonCount * fraction);
    const done = course.lessons.slice(0, count).map((l) => l.id);
    const lastLesson = course.lessons[Math.min(count, course.lessonCount - 1)].id;
    data.enrolled[id] = { at: daysAgo(enrolledDays).toISOString() };
    data.progress[id] = { done, last: lastLesson, at: daysAgo(index).toISOString() };
    if (fraction === 1) {
      data.quiz[id] = { score: 4, total: 4, at: daysAgo(18).toISOString() };
      data.certificates[id] = { id: certificateId(id, 'demo'), at: daysAgo(18).toISOString() };
    }
  });

  data.notes[1] = {
    '3-1': 'useEffect is for syncing with things outside React. Derive values during render instead of storing them in state.',
  };
  data.reviews[11] = {
    rating: 5,
    text: 'Window functions finally clicked for me. The dbt module alone was worth it.',
    at: daysAgo(17).toISOString(),
  };
  data.wishlist = [9, 7];
  data.goal = 240;
  data.plan = 'pro';

  const rand = seeded('demo-activity');
  for (let i = 0; i < 84; i += 1) {
    const active = i < 6 || rand() > 0.38;
    if (active) data.activity[todayKey(daysAgo(i))] = 15 + Math.round(rand() * 70);
  }

  const ordered = [1, 11, 13].map((id) => courses.find((c) => c.id === id));
  const subtotal = ordered.reduce((sum, c) => sum + c.price, 0);
  data.orders = [
    {
      id: 'ORD-48213',
      items: ordered.map((c) => ({ id: c.id, title: c.title, price: c.price })),
      subtotal,
      discount: Math.round(subtotal * 0.2 * 100) / 100,
      total: Math.round(subtotal * 0.8 * 100) / 100,
      coupon: 'LEARN20',
      method: 'card',
      at: daysAgo(54).toISOString(),
    },
  ];
  return data;
};

export const computeStreak = (activity) => {
  let streak = 0;
  const day = new Date();
  if (!activity[todayKey(day)]) day.setDate(day.getDate() - 1);
  while (activity[todayKey(day)]) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
};
