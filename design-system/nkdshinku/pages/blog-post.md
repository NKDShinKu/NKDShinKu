# Page Design: Blog Post (`/blog/:slug`)

> **Overrides MASTER.md:** Reading area uses **solid surface** (`--nk-surface`) with no glass effects. Typography is driven by `@tailwindcss/typography` prose plugin.
> **This page prioritizes readability over atmosphere.** No aurora blobs, no particles, no parallax.

---

## 1. Sections

| # | Section | Key Elements |
|---|---------|-------------|
| 1 | Scroll Progress | Fixed top bar, 3px height, accent gradient |
| 2 | Post Header | Title, date, tags, reading time |
| 3 | Post Content | prose area with markdown-rendered HTML |
| 4 | Post Footer | Back link, prev/next posts (optional) |

## 2. Section Details

### 2.1 Scroll Progress Bar

- Fixed to top of viewport (z-index 50)
- Height: 3px
- Background: `linear-gradient(90deg, var(--nk-accent), var(--nk-twilight))`
- Width: `(scrollY / (docHeight - viewportHeight)) * 100%`
- Update on scroll (passive listener for performance)

### 2.2 Post Header

**Padding:** `--nk-space-3xl` top (account for fixed nav), `--nk-space-lg` bottom.

```
┌──────────────────────────────────┐
│ [tag] [tag] [tag]                │
│                                  │
│ Article Title                    │  ← h1, heading font, 2.5-3rem
│                                  │
│ 2026-06-15 · 阅读约 5 分钟        │  ← muted, 0.9rem
└──────────────────────────────────┘
```

- Tags: clickable, navigate to `/blog?tag=xxx`
- Reading time: computed from content length (~300 chars/min for Chinese)

### 2.3 Post Content

**Wrapper:** `<article class="prose max-w-none">` with Tailwind Typography plugin.

**Custom prose overrides (in main.css):**
```css
.prose {
  --tw-prose-body: var(--nk-text);
  --tw-prose-headings: var(--nk-text);
  --tw-prose-links: var(--nk-accent);
  --tw-prose-code: var(--nk-accent);
  --tw-prose-pre-bg: var(--nk-surface);
  --tw-prose-pre-border: var(--nk-divider);
  max-width: 720px;
  margin: 0 auto;
}
```

- Max reading width: 720px, centered
- Code blocks: JetBrains Mono, solid surface bg, subtle border
- Images: rounded-lg, max-width 100%
- Blockquotes: left border accent color
- Headings: heading font, clear hierarchy

### 2.4 Post Footer

- Divider line
- "← 返回博客" link (btn-ghost style)
- Optional: prev/next post navigation (thin cards)

## 3. Data Flow

```
route.params.slug → usePostsStore().findBySlug(slug)
  → Post { slug, frontmatter, html }
  → render frontmatter fields in PostHeader
  → v-html="post.html" in prose div
  → update document.title
```

**Error handling:**
- Slug not found → redirect to 404 or show error state
- Loading state: skeleton (prose-shaped animate-pulse blocks)

## 4. Components

| Component | File |
|-----------|------|
| PostHeader | `components/blog/PostHeader.vue` |
| PostContent | `components/blog/PostContent.vue` |
| ScrollProgress | `components/common/ScrollProgress.vue` |

## 5. Responsive

- Prose area: full width on mobile (with 16px padding), max 720px on desktop
- Title: 1.8rem mobile → 2.5-3rem desktop
- Tags: wrap, smaller on mobile
