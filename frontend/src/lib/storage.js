// Small wrappers around localStorage that never throw (private mode, quota, disabled storage).

export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const readString = (key, fallback = null) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
