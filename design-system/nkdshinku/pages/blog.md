# Page Design: Blog List (`/blog`)

> **Overrides MASTER.md:** Cards use solid surface (`--nk-surface`) instead of glass — blog cards are content-dense and need max readability.
> **Landing Pattern:** Portfolio Grid (filterable card grid)

---

## 1. Sections

| # | Section | Height | Key Elements |
|---|---------|--------|-------------|
| 1 | Page Header | auto | Title, description, TagFilter bar |
| 2 | Post Grid | auto | Responsive grid of PostCards |
| 3 | Empty State | auto | (conditional) Icon + message when no posts |

## 2. Section Details

### 2.1 Page Header

- **Title:** "博客" in section-title style
- **Description:** "技术文章、教程与笔记" in section-desc style
- **TagFilter:** Horizontal scrollable row of tag badges

**TagFilter behavior:**
- Tags extracted from all posts' frontmatter
- Click to toggle filter (single-select)
- "全部" tag always present, selected by default
- Active tag: filled accent bg + white text
- Inactive tag: subtle accent bg + accent text

### 2.2 Post Grid

**Card layout (`blog-card` style — solid surface):**
```
┌─────────────────────┐
│ [tag] [tag] [tag]   │  ← tags row
│                     │
│ Card Title          │  ← bold, 1.05rem
│ Summary text here...│  ← muted, 0.88rem, 2-line clamp
│                     │
│ 2026-06-15          │  ← muted, 0.78rem
└─────────────────────┘
```

**Grid:** `card-grid-3` (1/2/3 columns by breakpoint)

**Interaction:**
- Hover: translateY(-3px) + shadow-lg
- Click: navigate to `/blog/:slug`

**Animation:** GSAP ScrollTrigger stagger (80ms/卡)

### 2.3 Empty State

Centered glass-card with:
- Icon: `file-text` (Lucide), 48px, muted color
- Text: "暂无文章" (h3 weight)
- Subtext: "写下的第一篇文章会出现在这里"

## 3. Data Flow

```
usePostsStore
  ├── posts: Post[]           (from import.meta.glob)
  ├── activeTag: string       (current filter, '全部' = all)
  ├── filteredPosts: Post[]   (computed, filtered by tag)
  └── loadPosts()             (parse markdown frontmatter)
```

**Markdown loading:** `import.meta.glob('@/content/posts/*.md', { query: '?raw' })` → parse frontmatter with gray-matter → sort by date desc → filter drafts in production.

## 4. Components

| Component | File |
|-----------|------|
| TagFilter | `components/blog/TagFilter.vue` |
| PostCard | `components/blog/PostCard.vue` |

## 5. Responsive

| Breakpoint | Columns | TagFilter |
|-----------|---------|-----------|
| < 768px | 1 | Horizontal scroll, compact |
| 768-1023px | 2 | Wrapped row |
| ≥ 1024px | 3 | Full row, centered |
