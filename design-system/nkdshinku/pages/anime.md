# Page Design: Anime Tracker (`/anime`)

> **Overrides MASTER.md:** This page has a slightly darker, more "late-night" atmosphere.
> Background uses a darker gradient + subtle star grid (not aurora blobs).
> Cards are more image-heavy — covers are the primary visual.
> **Data Source:** External Bangumi API (bgm.tv), client-side fetch with localStorage cache.

---

## 1. Sections

| # | Section | Key Elements |
|---|---------|-------------|
| 1 | Page Header | Title, description, StatusTabs |
| 2 | Cover Grid | Responsive grid of AnimeCards with cover images |
| 3 | Empty State | (conditional) Per-tab empty message |

## 2. Section Details

### 2.1 Page Header

- **Title:** "追番" in section-title style
- **Description:** "Bangumi 动画收藏与记录"

**StatusTabs:**
- Tabs: 在看 | 看过 | 想看 | 搁置
- Style: pill tabs, active = filled accent bg + white text
- Click: switch tab, filter grid with fade transition

### 2.2 Anime Card

```
┌──────────────┐
│              │
│  Cover Image │  ← 2:3 aspect ratio, rounded-md
│              │
├──────────────┤
│ Title        │  ← bold, 0.85rem, 1-line clamp
│ 12/13 eps    │  ← muted, 0.75rem
│ ★ 8.5        │  ← rating if available
│              │
│ [status bar] │  ← thin colored bar at bottom
└──────────────┘
```

**Status colors (thin bottom border or overlay badge):**
- 在看: accent (blue) bar
- 看过: success (green) bar
- 想看: sakura (pink) bar
- 搁置: muted (gray) bar

**Interaction:**
- Hover: scale(1.03) + glow shadow + overlay with "查看详情"
- Click: open Bangumi subject page (external link) or inline detail

**Animation:** Stagger fade-in, 60ms/卡 (faster because cards are smaller)

### 2.3 Empty State

Per-tab variant:
- 在看: "没有正在追的番剧" + tv icon
- 看过: "还没有标记已看过的番剧"
- 想看: "还没有想看的番剧，去 Bangumi 逛逛吧"
- 搁置: "没有搁置的番剧"

### 2.4 Loading State

Skeleton grid: 8-12 placeholder cards (gray rounded rects for covers) with animate-pulse.

## 3. Data Flow

### API Integration

```
useAnimeStore
  ├── collections: BangumiCollection[]
  ├── activeTab: 'watching' | 'completed' | 'plan_to_watch' | 'dropped'
  ├── filteredCollections: computed (by activeTab)
  ├── isLoading: boolean
  ├── error: string | null
  ├── fetchCollections(userId)     ← API call + cache
  └── lastFetchTime: number        ← for cache invalidation
```

**Bangumi API endpoint:**
- User collection: `https://api.bgm.tv/v0/users/{username}/collections?subject_type=2`
- Subject detail: `https://api.bgm.tv/v0/subjects/{subject_id}`
- Covers: `https://lain.bgm.tv/pic/cover/l/{cover_id}.jpg`

**Caching strategy:**
- localStorage cache with 1-hour TTL
- On page load: show cached data immediately, refresh in background
- On fetch error: show cached data + "数据可能不是最新" notice

**V1 fallback:** If API is down or user hasn't configured username, show placeholder grid with static demo data.

## 4. Configuration

User's Bangumi username should be configurable. V1 approach:
- Hardcoded in store or env variable
- V2: simple settings panel

## 5. Components

| Component | File |
|-----------|------|
| StatusTabs | `components/anime/StatusTabs.vue` |
| AnimeCard | `components/anime/AnimeCard.vue` |

## 6. Responsive

| Breakpoint | Cards per row | Card size |
|-----------|-------------|-----------|
| < 480px | 3 | ~100px |
| 480-768px | 4 | ~120px |
| 768-1023px | 5 | ~130px |
| ≥ 1024px | 6-8 | ~140px |
