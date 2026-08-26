# Page Design: Home (`/`)

> **Overrides MASTER.md:** No. All MASTER.md rules apply unless noted below.
> **Landing Pattern:** Video-First Hero + Scroll-Triggered Storytelling

---

## 1. Sections (in order)

| # | Section | Height | Key Elements |
|---|---------|--------|-------------|
| 1 | Hero | 100vh | Video bg, dark overlay, title, tagline, CTAs, scroll hint |
| 2 | About Capsule | ~40vh | Glass card, avatar, bio, tech interests |
| 3 | Content Hub | ~35vh | 3-card Bento grid (Blog / Projects / Anime) |
| 4 | Latest Posts | auto | 3-4 blog post cards in grid |
| 5 | Footer | auto | Links, social, copyright |

## 2. Section Details

### 2.1 Hero

**Background:**
- `<video>` element, autoplay, muted, loop, playsinline
- Source: `src/assets/video/blue-archive-arona.mp4` or `blue-archive-plana.mp4`
- Dark gradient overlay: `linear-gradient(180deg, rgba(26,27,46,0.3) 0%, rgba(26,27,46,0.7) 100%)`
- Fallback: `bg.jpg` for mobile / reduced-motion

**Content (centered, text-white or light):**
- Badge: `<span class="tag sakura">✦ Under Construction</span>`
- Title: "你好，我是 **NKDShinKu**" — hero-gradient-text on name
- Subtitle: 2 lines max, about this site
- CTAs: [btn-primary "浏览博客"] [btn-ghost "查看项目"]
- Scroll hint: chevron-down icon + "向下滚动探索" (bounce animation)

**Animation:**
- GSAP Timeline on mount:
  - Badge: fadeIn 0→1, y 20→0 (delay 0.3s)
  - Title: fadeIn + y (delay 0.5s, stagger chars)
  - Subtitle: fadeIn (delay 0.8s)
  - CTAs: fadeIn + y (delay 1.0s, stagger 0.1s)
- Parallax: video/overlay moves slightly with scroll (speed 0.5)

### 2.2 About Capsule

**Layout:** Single glass-card, max-width 520px, centered.
Inside: avatar (left) + text block (right).

**Content:**
- Avatar: 56×56 circle, gradient bg (accent→twilight) with initial letter "N"
- Name line: bold
- Bio: 2-3 sentences about tech interests, ACG hobbies

**Animation:** FadeInSection (Intersection Observer, threshold 0.2)

### 2.3 Content Hub

**Layout:** 3-card grid (1 col mobile, 3 col desktop).
Each card: glass-card interactive, centered text.

| Card | Icon | Title | Subtitle | Accent Color |
|------|------|-------|----------|-------------|
| Blog | `book-open` | 博客 | 技术文章与教程 | accent (blue) |
| Projects | `flask-conical` | 项目 | 作品与实验室 | sakura (pink) |
| Anime | `tv` | 追番 | Bangumi 动画记录 | twilight (purple) |

Icon container: 48×48 rounded box with 12% accent bg, icon in accent color.

**Interaction:**
- Hover: translateY(-4px) + glow shadow
- Click: route to respective page

**Animation:** GSAP ScrollTrigger stagger — each card enters 100ms apart

### 2.4 Latest Posts

**Layout:** 3-column grid on desktop, 1 on mobile.
Uses `blog-card` style (solid surface, not glass — for readability).

Each card shows:
- Tags row (2-3 tag badges)
- Title (card-title weight)
- Summary (1-2 lines, muted)
- Date (muted, small)

**Data source:** `usePostsStore().recentPosts` (latest 3-4, non-draft)

**Empty state:** Glass card with "📝 还没有文章，开始写第一篇吧" (but use Lucide icon, not emoji — `file-text` icon)

### 2.5 Footer

Clean, centered. Site name in heading font + description line + social icons row + copyright.

## 3. Components Used

| Component | File | Type |
|-----------|------|------|
| HeroSection | `components/home/HeroSection.vue` | page-specific |
| AboutCapsule | `components/home/AboutCapsule.vue` | page-specific |
| ContentHub | `components/home/ContentHub.vue` | page-specific |
| LatestPosts | `components/home/LatestPosts.vue` | page-specific |
| FadeInSection | `components/common/FadeInSection.vue` | common |
| ParticleBackground | `components/common/ParticleBackground.vue` | common |
| PostCard | `components/blog/PostCard.vue` | blog (shared) |

## 4. Responsive

| Breakpoint | Hero | Cards | Nav |
|-----------|------|-------|-----|
| < 768px | Static bg image, smaller title (2.2rem), CTAs stacked | 1 col | Bottom tab bar |
| 768-1023px | Video, medium title | 2 col | Floating pill nav |
| ≥ 1024px | Full video + parallax, full title | 3 col | Floating pill nav |
