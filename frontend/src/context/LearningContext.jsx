import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LearningContext } from './contexts';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { readJSON, readString, writeJSON } from '../lib/storage';
import { todayKey } from '../lib/format';
import { courses, getCourse } from '../data/courses';
import {
  certificateId,
  computeStreak,
  emptyStore,
  isEmptyStore,
  mergeStores,
  seedDemoStore,
  storageKey,
} from './learningStore';

const loadStore = (key) => ({ ...emptyStore(), ...readJSON(storageKey(key), {}) });
const union = (a = [], b = []) => [...new Set([...a, ...b])];

export const LearningProvider = ({ children }) => {
  const { user } = useAuth();
  const userKey = user ? String(user.id) : 'guest';
  const canSync = Boolean(user && !user.demo);

  const [store, setStore] = useState(() => ({ key: userKey, data: loadStore(userKey) }));

  // Switch stores when the signed-in account changes (derived during render, not in an effect)
  let current = store;
  if (store.key !== userKey) {
    let next = loadStore(userKey);
    if (store.key === 'guest' && userKey !== 'guest') {
      next = { ...next, cart: union(next.cart, store.data.cart), wishlist: union(next.wishlist, store.data.wishlist) };
    }
    if (user?.demo && isEmptyStore(next)) {
      const seed = seedDemoStore();
      next = { ...seed, cart: next.cart, wishlist: union(seed.wishlist, next.wishlist) };
    }
    current = { key: userKey, data: next };
    setStore(current);
  }
  const data = current.data;

  // Persist
  useEffect(() => {
    writeJSON(storageKey(store.key), store.data);
  }, [store]);

  // Once the guest cart/wishlist has moved into an account, clear it
  useEffect(() => {
    if (store.key === 'guest') return;
    const guest = loadStore('guest');
    if (guest.cart.length || guest.wishlist.length) {
      writeJSON(storageKey('guest'), { ...guest, cart: [], wishlist: [] });
    }
  }, [store.key]);

  // Server sync for real accounts: pull once, then push changes (debounced)
  const syncReady = useRef(false);
  useEffect(() => {
    syncReady.current = false;
    if (!canSync || !readString('token')) return undefined;
    const controller = new AbortController();
    api('/api/profile/learning', { auth: true, signal: controller.signal })
      .then(({ learning, purchasedCourses }) => {
        setStore((prev) =>
          prev.key === userKey ? { ...prev, data: mergeStores(prev.data, learning, purchasedCourses) } : prev
        );
        syncReady.current = true;
      })
      .catch(() => {
        // Stay local-only if the server is unreachable
      });
    return () => controller.abort();
  }, [canSync, userKey]);

  useEffect(() => {
    if (!canSync || !syncReady.current) return undefined;
    const timer = setTimeout(() => {
      api('/api/profile/learning', { method: 'PUT', auth: true, body: { learning: store.data } }).catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, [store.data, canSync]);

  // Updaters receive a copy of the data; returning null means "nothing changed" so React can bail out
  const update = useCallback((fn) => {
    setStore((prev) => {
      const next = fn(structuredClone(prev.data));
      return next === null ? prev : { ...prev, data: next };
    });
  }, []);

  /* ----------------------------- actions ----------------------------- */

  const enroll = useCallback((ids) => {
    const list = (Array.isArray(ids) ? ids : [ids]).map(String);
    update((d) => {
      list.forEach((id) => {
        if (!d.enrolled[id]) d.enrolled[id] = { at: new Date().toISOString() };
        if (!d.progress[id]) d.progress[id] = { done: [], last: null, at: new Date().toISOString() };
      });
      d.cart = d.cart.filter((id) => !list.includes(String(id)));
      return d;
    });
    if (canSync) {
      api('/api/profile/purchase', { method: 'POST', auth: true, body: { courseIds: list } }).catch(() => {});
    }
  }, [update, canSync]);

  const toggleWishlist = useCallback((id) => {
    const willAdd = !data.wishlist.includes(id);
    update((d) => {
      d.wishlist = willAdd ? [id, ...d.wishlist.filter((x) => x !== id)] : d.wishlist.filter((x) => x !== id);
      return d;
    });
    return willAdd;
  }, [update, data.wishlist]);

  const addToCart = useCallback((id) => {
    update((d) => {
      if (d.cart.includes(id) || d.enrolled[String(id)]) return null;
      d.cart = [...d.cart, id];
      return d;
    });
  }, [update]);

  const removeFromCart = useCallback((id) => {
    update((d) => {
      if (!d.cart.includes(id)) return null;
      d.cart = d.cart.filter((x) => x !== id);
      return d;
    });
  }, [update]);

  const clearCart = useCallback(() => update((d) => ({ ...d, cart: [] })), [update]);

  const setLastLesson = useCallback((courseId, lessonId) => {
    update((d) => {
      const p = d.progress[courseId] || { done: [] };
      d.progress[courseId] = { ...p, last: lessonId, at: new Date().toISOString() };
      return d;
    });
  }, [update]);

  const setLessonComplete = useCallback((courseId, lessonId, complete = true) => {
    const course = getCourse(courseId);
    if (!course) return;
    const lesson = course.lessons.find((l) => l.id === lessonId);
    update((d) => {
      const key = String(course.id);
      const p = d.progress[key] || { done: [], last: lessonId };
      const already = p.done.includes(lessonId);
      if (complete && !already) {
        p.done = [...p.done, lessonId];
        const day = todayKey();
        d.activity[day] = (d.activity[day] || 0) + (lesson?.duration || 10);
      } else if (!complete && already) {
        p.done = p.done.filter((x) => x !== lessonId);
      }
      p.at = new Date().toISOString();
      d.progress[key] = p;
      if (p.done.length === course.lessonCount && !d.certificates[key]) {
        d.certificates[key] = { id: certificateId(course.id, userKey), at: new Date().toISOString() };
      }
      return d;
    });
  }, [update, userKey]);

  const saveNote = useCallback((courseId, lessonId, text) => {
    update((d) => {
      d.notes[courseId] = { ...(d.notes[courseId] || {}), [lessonId]: text };
      if (!text) delete d.notes[courseId][lessonId];
      return d;
    });
  }, [update]);

  const saveQuiz = useCallback((courseId, score, total) => {
    update((d) => {
      const prev = d.quiz[courseId];
      if (!prev || score >= prev.score) d.quiz[courseId] = { score, total, at: new Date().toISOString() };
      return d;
    });
  }, [update]);

  const saveReview = useCallback((courseId, rating, text) => {
    update((d) => {
      d.reviews[courseId] = { rating, text, at: new Date().toISOString() };
      return d;
    });
  }, [update]);

  const placeOrder = useCallback((order) => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 89999)}`;
    const record = { ...order, id, at: new Date().toISOString() };
    update((d) => {
      d.orders = [record, ...d.orders];
      return d;
    });
    enroll(order.items.map((item) => item.id));
    return record;
  }, [update, enroll]);

  const setGoal = useCallback((minutes) => update((d) => ({ ...d, goal: minutes })), [update]);
  const setPlan = useCallback((plan) => update((d) => ({ ...d, plan })), [update]);
  const resetLearning = useCallback(() => update(() => emptyStore()), [update]);

  /* ----------------------------- selectors ----------------------------- */

  const getProgress = useCallback((courseId) => {
    const course = getCourse(courseId);
    if (!course) return { done: [], percent: 0, count: 0, total: 0, last: null };
    const p = data.progress[String(course.id)] || { done: [] };
    const done = p.done.filter((id) => course.lessons.some((l) => l.id === id));
    return {
      done,
      count: done.length,
      total: course.lessonCount,
      percent: Math.round((done.length / course.lessonCount) * 100),
      last: p.last || null,
      at: p.at || null,
    };
  }, [data.progress]);

  const value = useMemo(() => {
    const enrolledIds = Object.keys(data.enrolled).map(Number);
    const enrolledCourses = enrolledIds.map((id) => getCourse(id)).filter(Boolean);
    const withProgress = enrolledCourses.map((course) => ({ course, progress: getProgress(course.id) }));
    const minutesLearned = Object.values(data.activity).reduce((sum, m) => sum + m, 0);

    return {
      data,
      userKey,
      enrolledCourses,
      inProgress: withProgress
        .filter(({ progress }) => progress.percent < 100)
        .sort((a, b) => (b.progress.at || '').localeCompare(a.progress.at || '')),
      completed: withProgress.filter(({ progress }) => progress.percent === 100),
      wishlistCourses: data.wishlist.map((id) => getCourse(id)).filter(Boolean),
      cartCourses: data.cart.map((id) => getCourse(id)).filter((c) => c && !data.enrolled[String(c.id)]),
      streak: computeStreak(data.activity),
      minutesLearned,
      isEnrolled: (id) => Boolean(getCourse(id) && data.enrolled[String(getCourse(id).id)]),
      inWishlist: (id) => data.wishlist.includes(Number(id)),
      inCart: (id) => data.cart.includes(Number(id)),
      certificateFor: (id) => (getCourse(id) ? data.certificates[String(getCourse(id).id)] : undefined),
      recommended: courses
        .filter((c) => !data.enrolled[String(c.id)])
        .sort((a, b) => {
          const cats = new Set(enrolledCourses.map((e) => e.category));
          return (cats.has(b.category) - cats.has(a.category)) || b.rating - a.rating;
        })
        .slice(0, 3),
      getProgress,
      enroll,
      toggleWishlist,
      addToCart,
      removeFromCart,
      clearCart,
      setLastLesson,
      setLessonComplete,
      saveNote,
      saveQuiz,
      saveReview,
      placeOrder,
      setGoal,
      setPlan,
      resetLearning,
    };
  }, [
    data, userKey, getProgress, enroll, toggleWishlist, addToCart, removeFromCart, clearCart, setLastLesson,
    setLessonComplete, saveNote, saveQuiz, saveReview, placeOrder, setGoal, setPlan, resetLearning,
  ]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
};
