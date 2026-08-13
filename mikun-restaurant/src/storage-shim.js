/* storage-shim.js
   Replaces the Claude-artifact-only window.storage API with a localStorage-backed
   version so the NAO Supermarket app runs standalone in VS Code / any browser.

   IMPORTANT LIMITATION: localStorage is per-browser, per-device. It is NOT a shared
   database — if a customer opens the site on their own phone, they will NOT see
   products the admin added on a different computer. This shim is fine for local
   development and testing, but for a real multi-customer store you need the
   Node.js + MongoDB backend (ask Claude to build it) instead of this shim.
*/
(function () {
  const prefix = "naoapp:";

  function read(key, shared) {
    const k = prefix + (shared ? "shared:" : "personal:") + key;
    const raw = localStorage.getItem(k);
    if (raw === null) return null;
    return { key, value: raw, shared: !!shared };
  }

  window.storage = {
    async get(key, shared = false) {
      const result = read(key, shared);
      if (!result) throw new Error("Key not found: " + key);
      return result;
    },
    async set(key, value, shared = false) {
      const k = prefix + (shared ? "shared:" : "personal:") + key;
      localStorage.setItem(k, value);
      return { key, value, shared: !!shared };
    },
    async delete(key, shared = false) {
      const k = prefix + (shared ? "shared:" : "personal:") + key;
      localStorage.removeItem(k);
      return { key, deleted: true, shared: !!shared };
    },
    async list(keyPrefix = "", shared = false) {
      const scope = prefix + (shared ? "shared:" : "personal:");
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const full = localStorage.key(i);
        if (full && full.startsWith(scope + keyPrefix)) {
          keys.push(full.slice(scope.length));
        }
      }
      return { keys, prefix: keyPrefix, shared: !!shared };
    },
  };
})();
