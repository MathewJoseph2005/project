// Request Debouncing & Optimization Utility

// Debounce function to prevent excessive API calls
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle function for frequently called functions
export const throttle = (fn, limit = 1000) => {
  let lastRan;
  return (...args) => {
    if (!lastRan) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastRan);
      lastRan = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Cache for API responses
class RequestCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() - item.timestamp < this.ttl;
  }
}

export const requestCache = new RequestCache();

// Batch multiple requests
export const batchRequests = (() => {
  const batch = [];
  let timeout;

  return (fn) => {
    batch.push(fn);
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      const requests = [...batch];
      batch.length = 0;
      await Promise.all(requests.map(r => r()));
    }, 50); // Execute batch after 50ms
  };
})();

// Memoize function results
export const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Request with retry logic
export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  const { delay = 1000, ...fetchOptions } = options;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};
