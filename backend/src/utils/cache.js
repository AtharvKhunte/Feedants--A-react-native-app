const store = new Map();

exports.get = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.value;
};

exports.set = (key, value, ttlSeconds = 60) => {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};

exports.del = (key) => store.delete(key);