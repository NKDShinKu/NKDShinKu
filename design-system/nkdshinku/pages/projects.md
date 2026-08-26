# Page Design: Projects (`/projects`)

> **Overrides MASTER.md:** None. Standard glass-card grid with category filtering.
> **Landing Pattern:** Portfolio Grid (Bento-style showcase)

---

## 1. Sections

| # | Section | Key Elements |
|---|---------|-------------|
| 1 | Page Header | Title, description, CategoryFilter |
| 2 | Project Grid | Bento-style responsive grid of ProjectCards |
| 3 | Empty State | (conditional) Message when no projects |
| 4 | Detail Modal | (conditional) Project detail popup |

## 2. Section Details

### 2.1 Page Header

- **Title:** "项目" in section-title style
- **Description:** "个人作品与实验项目"

**CategoryFilter:**
- Options: 全部 | 进行中 | 已完成 | 归档
- Same TagFilter interaction pattern (single-select, active fill)

### 2.2 Project Card

**Glass card interactive style:**

```
┌──────────────────────────────┐
│                              │
│       [Cover Image]          │  ← optional, rounded-top
│                              │
├──────────────────────────────┤
│ Project Name                 │  ← card-title weight
│ Description text here,       │
│ 2-line clamp...              │  ← muted, 0.9rem
│                              │
│ [Vue 3] [TS] [GSAP]          │  ← tech stack tags
│                              │
│ 🔗 demo  ·  📁 source        │  ← link icons row
│              [status badge]  │  ← corner: 进行中/已完成
└──────────────────────────────┘
```

**Status badges:**
- `active`: sakura tag "● 进行中"
- `completed`: success tag "✓ 已完成"
- `archived`: muted tag "归档"

**Interaction:**
- Hover: translateY(-4px) + glow shadow
- Click card body: open detail modal
- Click link icons: open external URL

**Animation:** ScrollTrigger stagger, 100ms/卡

### 2.3 Detail Modal

When clicking a project card:

**Glass modal overlay:**
- Backdrop: `rgba(0,0,0,0.4)` + `backdrop-blur(4px)`
- Modal panel: glass-card style, max-width 600px, centered
- Close button: top-right X icon
- ESC key to close

**Modal content:**
- Project name (h2)
- Status badge
- Full description (no clamp)
- Tech stack tags
- "学到的" (What I learned) section
- Links: demo + source

### 2.4 Empty State

Glass card centered:
- Icon: `flask-conical`, 48px
- "还没有项目"
- "完成的项目会展示在这里"

## 3. Data Flow

```
useProjectsStore
  ├── projects: Project[]
  ├── activeCategory: string   ('全部' | 'active' | 'completed' | 'archived')
  ├── filteredProjects: Project[]  (computed)
  └── loadProjects()           (from static data file or markdown)
```

**V1 data source:** Static `src/data/projects.json` or individual markdown files in `src/content/projects/`.

## 4. Components

| Component | File |
|-----------|------|
| ProjectCard | `components/project/ProjectCard.vue` |
| CategoryFilter | `components/project/CategoryFilter.vue` |
| ProjectModal | `components/project/ProjectModal.vue` |

## 5. Responsive

| Breakpoint | Grid | Modal |
|-----------|------|-------|
| < 768px | 1 col, full width cards | 90vw width |
| 768-1023px | 2 col | 600px max |
| ≥ 1024px | 2-3 col Bento (varying sizes) | 640px max |
