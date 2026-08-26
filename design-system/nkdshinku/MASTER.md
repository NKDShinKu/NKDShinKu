# Design System Master File — NKDShinKu

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** NKDShinKu
**Generated:** 2026-07-07
**Style:** Soft ACG Fusion (Glassmorphism × Aurora × Motion-Driven)
**Category:** Personal Tech Blog + Portfolio

---

## 1. Global Rules

### 1.1 Design Tokens — Naming Convention

All tokens prefixed `--nk-` to avoid collisions:

```
--nk-color-{role}       → colors
--nk-font-{role}        → typography
--nk-space-{size}       → spacing
--nk-radius-{size}      → border radius
--nk-shadow-{depth}     → shadows
--nk-glass-{property}   → glassmorphism
--nk-transition-{type}  → transitions
```

### 1.2 Color Palette

#### Light Mode (default)

| Token | Role | Hex | Tailwind |
|-------|------|-----|----------|
| `--nk-color-bg` | Page background | `#F0F4F8` | — |
| `--nk-color-surface` | Solid card surface | `#FFFFFF` (with 80% opacity in glass) | — |
| `--nk-color-glass` | Glass card background | `rgba(255,255,255,0.60)` | — |
| `--nk-color-glass-border` | Glass card border | `rgba(255,255,255,0.30)` | — |
| `--nk-color-accent` | Primary accent (sky blue) | `#5B8FD4` | — |
| `--nk-color-accent-light` | Accent light variant | `#8FB8E8` | — |
| `--nk-color-accent-dark` | Accent dark variant | `#3A6FB0` | — |
| `--nk-color-sakura` | Secondary accent (pink) | `#F0A0B8` | — |
| `--nk-color-sakura-light` | Sakura light variant | `#F4C0D0` | — |
| `--nk-color-twilight` | Tertiary accent (purple) | `#9B8EC4` | — |
| `--nk-color-text` | Primary text | `#2D2B3A` | — |
| `--nk-color-text-muted` | Secondary/muted text | `#6B6880` | — |
| `--nk-color-divider` | Subtle divider lines | `#E2E8F0` | — |
| `--nk-color-success` | Success state | `#7ECB9A` | — |
| `--nk-color-warning` | Warning state | `#F0C878` | — |

#### Dark Mode (`.dark` class on `<html>`)

| Token | Role | Hex |
|-------|------|-----|
| `--nk-color-bg` | Page background | `#1A1B2E` |
| `--nk-color-surface` | Solid card surface | `#242538` |
| `--nk-color-glass` | Glass card background | `rgba(30,30,60,0.70)` |
| `--nk-color-glass-border` | Glass card border | `rgba(255,255,255,0.10)` |
| `--nk-color-accent` | Primary accent | `#7EB8F4` |
| `--nk-color-accent-light` | Accent light | `#A8D0F8` |
| `--nk-color-accent-dark` | Accent dark | `#5B9BD5` |
| `--nk-color-sakura` | Secondary accent | `#F4B8C8` |
| `--nk-color-sakura-light` | Sakura light | `#F8D0D8` |
| `--nk-color-twilight` | Tertiary accent | `#B8A8E0` |
| `--nk-color-text` | Primary text | `#E8E6F0` |
| `--nk-color-text-muted` | Secondary/muted text | `#A09DB8` |
| `--nk-color-divider` | Subtle dividers | `#2E2E4A` |

### 1.3 Typography

| Role | Latin Font | CJK Fallback | Weights |
|------|-----------|-------------|---------|
| Heading | Quicksand | Noto Sans SC | 500, 600, 700 |
| Body | Inter | Noto Sans SC | 300, 400, 500 |
| Code | JetBrains Mono | — | 400, 500 |

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;700&family=Quicksand:wght@400;500;600;700&display=swap');
```

**Type Scale (modular, 1.25 ratio):**

| Level | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--nk-text-xs` | `0.75rem` | `1.5` | Captions, badges |
| `--nk-text-sm` | `0.875rem` | `1.5` | Small body, tags |
| `--nk-text-base` | `1rem` | `1.75` | Body text (min 16px) |
| `--nk-text-lg` | `1.25rem` | `1.6` | Lead text, card titles |
| `--nk-text-xl` | `1.5rem` | `1.4` | Section headings |
| `--nk-text-2xl` | `2rem` | `1.3` | Page titles |
| `--nk-text-3xl` | `2.5rem` | `1.2` | Hero subtext |
| `--nk-text-4xl` | `3rem` | `1.1` | Hero headline |

- Body text minimum 16px on mobile (`readable-font-size`)
- Line length max 65-75 characters (`line-length`)
- Body line-height 1.5-1.75 (`line-height`)

### 1.4 Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--nk-space-xs` | `0.25rem` (4px) | Tight gaps, icon-text |
| `--nk-space-sm` | `0.5rem` (8px) | Inline spacing |
| `--nk-space-md` | `1rem` (16px) | Standard padding |
| `--nk-space-lg` | `1.5rem` (24px) | Card padding, section gaps |
| `--nk-space-xl` | `2rem` (32px) | Large gaps |
| `--nk-space-2xl` | `3rem` (48px) | Section margins |
| `--nk-space-3xl` | `4rem` (64px) | Hero padding |
| `--nk-space-4xl` | `6rem` (96px) | Page-top padding |

### 1.5 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--nk-radius-sm` | `8px` | Buttons, inputs, tags |
| `--nk-radius-md` | `12px` | Cards |
| `--nk-radius-lg` | `16px` | Large cards, modals |
| `--nk-radius-full` | `9999px` | Pills, avatars |

### 1.6 Shadows (Glass-Adapted)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--nk-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | `0 1px 3px rgba(0,0,0,0.3)` | Subtle lift |
| `--nk-shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | `0 4px 12px rgba(0,0,0,0.4)` | Glass cards default |
| `--nk-shadow-lg` | `0 8px 24px rgba(0,0,0,0.10)` | `0 8px 24px rgba(0,0,0,0.5)` | Card hover, modals |
| `--nk-shadow-glow` | `0 0 24px rgba(91,143,212,0.15)` | `0 0 24px rgba(126,184,244,0.2)` | Accent glow on hover |

### 1.7 Glassmorphism Standard

```css
.glass-card {
  background: var(--nk-color-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--nk-color-glass-border);
  border-radius: var(--nk-radius-md);
  box-shadow: var(--nk-shadow-md);
}

.glass-card.interactive:hover {
  box-shadow: var(--nk-shadow-lg), var(--nk-shadow-glow);
  transform: translateY(-4px);
  /* transition: transform 200ms ease-out, box-shadow 200ms ease-out; */
}
```

- Backdrop blur range: 12-20px
- Glass opacity: 60-80% light mode, 60-80% dark mode
- Border: 1px solid, white/light semi-transparent
- **Never use glass on text-heavy reading areas** (articles use solid surfaces)

### 1.8 Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--nk-transition-fast` | `150ms ease-out` | Button hover, focus ring |
| `--nk-transition-base` | `200ms ease-out` | Card hover, tag toggle |
| `--nk-transition-slow` | `300ms ease-out` | Modal, theme switch |
| `--nk-transition-spring` | `400ms cubic-bezier(0.34,1.56,0.64,1)` | Entrance stagger |

---

## 2. Component Specs

### 2.1 Buttons

```css
/* Primary — filled accent */
.btn-primary {
  background: var(--nk-color-accent);
  color: white;
  padding: 10px 24px;
  border-radius: var(--nk-radius-sm);
  font-weight: 600;
  font-family: var(--nk-font-body);
  transition: background var(--nk-transition-fast),
              transform var(--nk-transition-fast);
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--nk-color-accent-dark);
  transform: translateY(-1px);
}
.btn-primary:active { transform: scale(0.97); }
.btn-primary:focus-visible { outline: 2px solid var(--nk-color-accent); outline-offset: 2px; }

/* Ghost — transparent, for glass contexts */
.btn-ghost {
  background: transparent;
  color: var(--nk-color-text);
  border: 1px solid var(--nk-color-divider);
  padding: 10px 24px;
  border-radius: var(--nk-radius-sm);
  font-weight: 500;
  transition: border-color var(--nk-transition-fast);
  cursor: pointer;
}
.btn-ghost:hover { border-color: var(--nk-color-accent); color: var(--nk-color-accent); }
```

### 2.2 Glass Card

```css
.glass-card {
  background: var(--nk-color-glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--nk-color-glass-border);
  border-radius: var(--nk-radius-md);
  padding: var(--nk-space-lg);
  box-shadow: var(--nk-shadow-md);
}

/* Interactive variant */
.glass-card.interactive {
  cursor: pointer;
  transition: transform var(--nk-transition-base),
              box-shadow var(--nk-transition-base);
}
.glass-card.interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--nk-shadow-lg), var(--nk-shadow-glow);
}
```

### 2.3 Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--nk-radius-full);
  font-size: var(--nk-text-xs);
  font-weight: 500;
  background: rgba(91,143,212,0.1);
  color: var(--nk-color-accent);
  transition: background var(--nk-transition-fast);
  cursor: pointer;
}
.tag:hover { background: rgba(91,143,212,0.2); }
.tag.active { background: var(--nk-color-accent); color: white; }

.tag.sakura { background: rgba(240,160,184,0.1); color: var(--nk-color-sakura); }
.tag.twilight { background: rgba(155,142,196,0.1); color: var(--nk-color-twilight); }
```

### 2.4 Section Header

```css
.section-header {
  text-align: center;
  margin-bottom: var(--nk-space-2xl);
}
.section-header h2 {
  font-family: var(--nk-font-heading);
  font-size: var(--nk-text-2xl);
  font-weight: 700;
  color: var(--nk-color-text);
  margin-bottom: var(--nk-space-sm);
}
.section-header p {
  color: var(--nk-color-text-muted);
  max-width: 480px;
  margin: 0 auto;
}
```

---

## 3. Style Guidelines

### 3.1 Core Style — "Soft ACG Fusion"

Three influences blended:

| Style | Role | Expression |
|-------|------|------------|
| **Glassmorphism** | Dominant surface treatment | Cards, nav, hero overlays — translucent + blur |
| **Aurora UI** | Background atmosphere | Large blurred gradient blobs, slow 12s morph |
| **Motion-Driven** | Interaction layer | Scroll reveals, parallax, entrance stagger |

### 3.2 Visual Atmosphere

**Atmosphere keywords:** 通透 · 清新 · 柔软 · 轻科技 · 轻 ACG · 克制

**Background System (per-page):**
| Page | Background |
|------|-----------|
| Home | Aurora gradient blobs + hero video overlay |
| Blog List | Solid light background + subtle grid |
| Blog Post | Solid white-ish surface for readability |
| Projects | Aurora blobs (muted) |
| Anime | Darker gradient + subtle grid |

**Decorative Elements (allowed, subtle):**
- ✅ Aurora blobs (large, heavy blur 80-120px, 12s slow animation)
- ✅ Canvas particles (~60 fireflies/stars, slow drift)
- ✅ Thin decorative line-art dividers
- ✅ Card hover glow (subtle colored shadow)
- ✅ Hero video/illustration with parallax
- ✅ Gradient text on hero heading (sparingly)
- ✅ Subtle sakura-petal-colored accent dots in empty states

**Forbidden:**
- ❌ Manga panel UI layouts
- ❌ Full-character illustrations as page backgrounds
- ❌ Neon flickering or flashing
- ❌ Danmaku (bullet comments) or chat-bubble aesthetics
- ❌ Overly saturated rainbow gradients
- ❌ Comic-style fonts for UI text
- ❌ Loud, distracting auto-play animations

### 3.3 Motion Guidelines

| Interaction | Method | Duration | Easing |
|------------|--------|----------|--------|
| Button hover | CSS transition | 150ms | ease-out |
| Card hover lift | CSS transition | 200ms | ease-out |
| Theme toggle | CSS transition | 300ms | ease-out |
| Section entrance | GSAP ScrollTrigger | 600ms | power2.out |
| Hero entrance | GSAP Timeline | 800ms total | power3.out |
| Card stagger | GSAP ScrollTrigger | 80-100ms/卡 | power2.out |
| Page transition | GSAP + Router | 200ms | power2.inOut |
| Aurora blob morph | CSS animation | 12s | ease-in-out (infinite) |
| Particle drift | Canvas rAF | continuous | — |

**Constraints:**
- Only `transform` + `opacity` for GPU-composited animations (`transform-performance`)
- `prefers-reduced-motion: reduce` disables all non-essential motion
- Mobile: reduce particle count to ~30, disable parallax layers
- No `transition: all` — always target specific properties

### 3.4 Page Pattern

**Primary:** Scroll-Triggered Storytelling (inspired by `docs/design/滚动叙事参考.md`)
- Homepage: section-by-section reveal with progress indicator
- Blog post: sticky reading progress bar

**Secondary:** Bento Grid Showcase (for Content Hub, Project Grid)
- Asymmetric card grid, Apple-style modular showcase
- 1-3 cards per row, varying sizes for visual rhythm

---

## 4. Accessibility (Critical)

| Rule | Implementation | Priority |
|------|---------------|----------|
| Color contrast | Text 4.5:1 min, accent text checked against bg | `color-contrast` |
| Focus states | `focus-visible:ring-2 ring-accent` on all interactive | `focus-states` |
| Touch targets | Min 44×44px (`touch-target-size`) | CRITICAL |
| Alt text | Descriptive alt for all meaningful images (`alt-text`) | HIGH |
| ARIA labels | `aria-label` on all icon-only buttons (`aria-labels`) | HIGH |
| Keyboard nav | Tab order = visual order (`keyboard-nav`) | HIGH |
| Skip link | Skip-to-content on nav-heavy pages (`skip-links`) | MEDIUM |
| Reduced motion | `@media (prefers-reduced-motion)` wraps all GSAP (`reduced-motion`) | HIGH |
| No color-only | Always pair color with icon/text (`color-only`) | HIGH |
| Form labels | `<label for="...">` on every input | HIGH |

---

## 5. Responsive Strategy

| Breakpoint | Width | Columns | Nav | Hero |
|-----------|-------|---------|-----|------|
| Mobile | < 768px | 1 col | Bottom tab bar or hamburger | Static image, no video |
| Tablet | 768-1023px | 2 col | Inline compact nav | Video with reduced parallax |
| Desktop | ≥ 1024px | 2-3 col | Full inline nav | Full video + parallax |

- Mobile first: content works at 375px
- Cards: 1 → 2 → 3 columns
- Typography: scale down by one level on mobile
- Navigation: `top-4 left-4 right-4` floating (not `top-0`) on desktop; bottom-fixed on mobile
- Content padding accounts for fixed nav height (`content-jumping`)

---

## 6. TailwindCSS v4 @theme

```css
@import 'tailwindcss';
@plugin '@iconify/tailwind4';
@plugin '@tailwindcss/typography';

@theme {
  --font-heading: 'Quicksand', 'Noto Sans SC', sans-serif;
  --font-body: 'Inter', 'Noto Sans SC', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --color-accent: #5B8FD4;
  --color-accent-light: #8FB8E8;
  --color-accent-dark: #3A6FB0;
  --color-sakura: #F0A0B8;
  --color-sakura-light: #F4C0D0;
  --color-twilight: #9B8EC4;
  --color-bg: #F0F4F8;
  --color-text: #2D2B3A;
  --color-text-muted: #6B6880;
}

/* Dark mode overrides */
.dark {
  --color-accent: #7EB8F4;
  --color-accent-light: #A8D0F8;
  --color-accent-dark: #5B9BD5;
  --color-sakura: #F4B8C8;
  --color-sakura-light: #F8D0D8;
  --color-twilight: #B8A8E0;
  --color-bg: #1A1B2E;
  --color-text: #E8E6F0;
  --color-text-muted: #A09DB8;
}
```

---

## 7. Anti-Patterns (Do NOT Use)

- ❌ Corporate templates, generic layouts
- ❌ Emojis as UI icons — use SVG (Lucide/Heroicons)
- ❌ Missing `cursor-pointer` on interactive elements
- ❌ `transition: all` — always specify exact properties
- ❌ Pure white `#FFF` or pure black `#000`
- ❌ Large saturated color areas
- ❌ Fancy particle-heavy backgrounds
- ❌ Scale transforms that shift layout on hover
- ❌ Low contrast text (< 4.5:1)
- ❌ Invisible focus states
- ❌ Horizontal scroll on mobile
- ❌ Content behind fixed elements
- ❌ `top: 0` sticky nav — always add inset spacing

---

## 8. Pre-Delivery Checklist

Before delivering UI code, verify:

- [ ] No emojis as icons (use Lucide SVG)
- [ ] Consistent icon sizing (24×24 viewBox, w-6 h-6)
- [ ] `cursor-pointer` on all clickable/hoverable elements
- [ ] Hover states ~150-200ms, smooth, no layout shift
- [ ] Light mode: text contrast ≥ 4.5:1
- [ ] Dark mode: all colors verified, borders visible
- [ ] Glass cards: visible in both modes (check opacity)
- [ ] Focus states visible (`focus-visible:ring-2`)
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] No horizontal scroll on mobile
- [ ] Floating elements have edge spacing
- [ ] No content hidden behind fixed nav
- [ ] All images have alt text
- [ ] Form inputs have labels
