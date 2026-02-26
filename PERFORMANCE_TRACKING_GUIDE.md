# Performance & User Tracking Implementation Guide

## ✅ Features Implemented

### 1. **Performance Monitoring System** (`src/utils/performanceMonitor.js`)

Tracks comprehensive performance metrics:

```javascript
import { perfMonitor } from './utils/performanceMonitor';

// Track API call performance
perfMonitor.trackApiCall('/api/users', 245); // duration in ms

// Record game sessions
perfMonitor.recordGameSession(score, duration, won);

// Get detailed user statistics
const stats = perfMonitor.getUserStats();
// Returns: { totalGames, averageScore, bestScore, totalPlaytime, winRate, recentGames }
```

**Metrics Tracked:**
- API response times per endpoint
- Game session statistics
- User performance data (persisted to localStorage)
- Web Vitals (FCP, LCP, CLS, FID)
- Memory usage (Chrome DevTools)

---

### 2. **User Stats Page** (`src/pages/UserStats.jsx`)

New dedicated page showing:

- **Overall Performance Rating** (Excellent/Good/Average/Needs Practice)
- **Key Metrics:**
  - Total games played
  - Best score achieved
  - Average score
  - Win rate percentage
  - Total playtime
  - Average game duration

- **Recent Games Table/Cards**
  - Score, duration, result, date
  - Responsive design (cards on mobile, table on desktop)

**Route:** `/stats`

**Access:** Click "Stats" button in game navbar or via direct URL

---

### 3. **Request Optimization** (`src/utils/requestOptimization.js`)

#### Debouncing
```javascript
import { debounce } from './utils/requestOptimization';

const debouncedSearch = debounce((query) => {
  // API call only fires 300ms after user stops typing
  searchUsers(query);
});
```
- Reduces unnecessary API calls during form input
- Default 300ms delay (configurable)

#### Throttling
```javascript
import { throttle } from './utils/requestOptimization';

window.addEventListener('resize', throttle(handleResize, 1000));
```
- Limits function execution frequency
- Useful for expensive operations

#### Request Caching
```javascript
import { requestCache } from './utils/requestOptimization';

requestCache.set('users', data);  // Cache for 5 minutes
const cached = requestCache.get('users');
requestCache.clear();             // Clear all
```
- 5-minute default TTL (time-to-live)
- Automatic cache invalidation on mutations
- Reduces server load

#### Retry Logic
```javascript
import { fetchWithRetry } from './utils/requestOptimization';

const response = await fetchWithRetry(url, options, 3);
// Retries 3 times with exponential backoff
```
- Handles transient failures
- Exponential backoff between retries
- Configurable retry count

#### Request Batching
```javascript
import { batchRequests } from './utils/requestOptimization';

batchRequests(() => api.call1());
batchRequests(() => api.call2());
// Both executed together after 50ms
```

---

### 4. **Skeleton Loading Components** (`src/components/SkeletonLoaders.jsx`)

Ready-to-use placeholder components:

```javascript
import { 
  SkeletonLoader,
  UserCardSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
  GameStatsSkeleton
} from './components/SkeletonLoaders';

// Usage in component
{loading ? <StatCardSkeleton /> : <StatCard />}
```

**Available Components:**
- `SkeletonLoader`: Generic customizable loader
- `UserCardSkeleton`: User card placeholder
- `StatCardSkeleton`: Statistics card placeholder
- `TableRowSkeleton`: Table row placeholder
- `GameStatsSkeleton`: Game stats placeholder
- `PerformanceSkeleton`: Performance metrics placeholder

**Animations:**
- `animate-pulse`: Smooth fading
- `animate-shimmer`: Shimmer effect (CSS)

---

### 5. **Enhanced API Service** (`src/services/api-optimized.js`)

New optimized API wrapper with:

- **Performance Tracking**: Every API call duration logged
- **Response Caching**: Admin endpoints cached for 5 minutes
- **Cache Invalidation**: Automatic on POST/PUT/DELETE
- **Retry Logic**: Automatic retries on server errors
- **Debounced Search**: User search debounced to 500ms

```javascript
import { adminAPI } from './services/api-optimized';

// Automatic caching and tracking
const users = await adminAPI.getUsers();

// Stats also cached
const stats = await adminAPI.getStats();

// Debounced search (won't spam server)
adminAPI.searchUsers(query);
```

---

### 6. **Game Performance Tracking**

Game component now:
- Tracks game duration
- Records score and outcome
- Stores session data to localStorage
- Persists across page reloads

```javascript
perfMonitor.recordGameSession(score, duration, won);
```

---

## 📊 Performance Metrics Dashboard

View comprehensive metrics:

```javascript
// Get user stats
const stats = perfMonitor.getUserStats();
console.log(stats);
// {
//   totalGames: 15,
//   averageScore: 125,
//   bestScore: 320,
//   totalPlaytime: 45,      // minutes
//   winRate: 73,            // percent
//   recentGames: [...]
// }

// Get API performance
const avgTime = perfMonitor.getAverageApiTime('/admin/users');
// Returns average response time in ms

// Get memory usage
const memory = perfMonitor.getMemoryUsage();
// { usedJSHeapSize: 25, totalJSHeapSize: 50, jsHeapSizeLimit: 2048 }
```

---

## 🎮 Game Stats Features

### Automatic Tracking
- **Game wins** detected when all dots collected (score > 0)
- **Game losses** recorded when hit by ghost
- **Duration** tracked in seconds
- **Timestamp** saved for each game

### Performance Rating System
- **Excellent**: 80%+ win rate (🏆)
- **Good**: 60-80% win rate
- **Average**: 40-60% win rate
- **Needs Practice**: <40% win rate

### Recent Games History
- Last 5 games displayed
- Score, duration, result, date
- Mobile cards / Desktop table layout

---

## 📈 Usage Examples

### 1. Track API Performance
```javascript
import { perfMonitor } from './utils/performanceMonitor';
import { adminAPI } from './services/api-optimized';

// Automatic tracking on all admin API calls
const users = await adminAPI.getUsers();
const avgTime = perfMonitor.getAverageApiTime('/admin/users');
console.log(`Average API response: ${avgTime}ms`);
```

### 2. Debounce User Input
```javascript
import { debounce } from './utils/requestOptimization';

const handleSearch = debounce((query) => {
  searchUsers(query); // Only fires 300ms after user stops typing
}, 300);
```

### 3. Implement Skeleton Loading
```javascript
import { StatCardSkeleton } from './components/SkeletonLoaders';

{loading ? <StatCardSkeleton /> : <StatCard data={data} />}
```

### 4. View User Performance
```javascript
// Route: /stats
import { UserStats } from './pages/UserStats';
// Shows comprehensive performance dashboard
```

---

## ⚙️ Configuration

### Cache TTL (Time-To-Live)
```javascript
import { RequestCache } from './utils/requestOptimization';
const cache = new RequestCache(10 * 60 * 1000); // 10 minutes
```

### Debounce Delay
```javascript
const debouncedFn = debounce(fn, 500); // 500ms delay
```

### Retry Attempts
```javascript
await fetchWithRetry(url, options, 5); // Retry 5 times
```

---

## 🔍 Performance Monitoring in DevTools

### Chrome DevTools Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Play games and navigate
4. Observe:
   - API response times
   - Response sizes
   - Waterfall timing

### Chrome Performance Tab
1. Go to Performance tab
2. Record session
3. Analyze:
   - Long Tasks
   - Layout Thrashing
   - FCP, LCP metrics

### Storage Tab
1. Go to Application > Local Storage
2. View `gameStats` key
3. See persisted game data:
```json
{
  "score": 150,
  "duration": 45,
  "won": true,
  "timestamp": "2026-02-27T10:30:00Z"
}
```

---

## 📱 Mobile Optimization Features

All components are fully responsive:
- **UserStats**: Cards on mobile, grid on desktop
- **SkeletonLoaders**: Mobile-friendly animations
- **Debouncing**: Efficient on slow networks
- **Caching**: Reduces data usage
- **Retry Logic**: Works offline/on bad connections

---

## 🚀 Best Practices

### 1. Always Use Performance Tracking
```javascript
// Track all API calls
const data = await fetchWithTracking(endpoint, options);
```

### 2. Cache Expensive Queries
```javascript
if (requestCache.has(key)) {
  return requestCache.get(key);
}
// Otherwise fetch and cache
```

### 3. Debounce User Input
```javascript
const debouncedSearch = debounce(handleSearch, 300);
// Always debounce search, filter, resize handlers
```

### 4. Clear Cache After Mutations
```javascript
await api.updateUser(data);
requestCache.clear(); // Clear all affected caches
```

### 5. Show Skeletons While Loading
```javascript
{loading ? <SkeletonLoader /> : <RealComponent />}
```

---

## 📊 Metrics to Monitor

Track these for optimization:

| Metric | Good | Fair | Poor |
|--------|------|------|------|
| API Response Time | <200ms | 200-500ms | >500ms |
| FCP | <1.8s | 1.8-3s | >3s |
| LCP | <2.5s | 2.5-4s | >4s |
| Cache Hit Rate | >60% | 40-60% | <40% |
| Memory Usage | <50MB | 50-100MB | >100MB |

---

## 🔧 Advanced Customization

### Custom Cache TTL
```javascript
const longCache = new RequestCache(1 * 60 * 60 * 1000); // 1 hour
```

### Custom Retry Strategy
```javascript
const exponentialBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, (2 ** i) * 100));
    }
  }
};
```

### Memoized Functions
```javascript
import { memoize } from './utils/requestOptimization';

const expensiveCalc = memoize((input) => {
  // Expensive computation
  return result;
});
// Results cached per unique input
```

---

## 📝 Implementation Checklist

- [x] Performance Monitor utility
- [x] Request Optimization (debounce, throttle, cache, retry)
- [x] Skeleton Load Components
- [x] User Stats Page (/stats)
- [x] Game Stats Tracking
- [x] Optimized API Service
- [x] Shimmer & Pulse Animations
- [x] Mobile Responsive Stats
- [x] Cache Management
- [x] Performance Metrics Dashboard

---

## 🎯 Next Steps

1. **Test Performance**: Use Chrome DevTools Network/Performance tabs
2. **Monitor Metrics**: Check `perfMonitor.getUserStats()` in console
3. **View Stats**: Navigate to `/stats` page
4. **Optimize Further**: Use Lighthouse for detailed recommendations
5. **Deploy**: Monitor real-world performance with analytics

---

**Last Updated:** February 27, 2026
**Status:** Production Ready
