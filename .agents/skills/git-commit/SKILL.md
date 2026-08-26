---
name: git-commit
description: Standardized Git commit workflow with pre-commit checks and Conventional Commits format. Use when the user asks to commit code, mentions git commit, or a batch of changes is ready to commit.
---

# Git Commit

Set up a standard process for future AI sessions to commit code in compliance with standards.

## When to Use

Use when the user:
- Say "submit", "commit", "push code"
- Express that a batch of work is complete
- You notice that changes have accumulated but have not been committed

## Before submit

Before each submission, you must perform the following actions and **ALL pass** before you can continue:

```bash
npm run lint         # ESLint must pass
npm run type-check   # TypeScript type check must pass
npm run build        # The build must succeed
```

If it fails, repair it before submitting.

## Submission message format

```
<type>: <中文描述>
```

**Type type** (strictly adhered to):

| Type | Purpose | Example |
|---|---|---|
| `feat` | New features/pages/components | `feat: Add blog list page` |
| `fix` | Fix bugs | `fix: Fixed the blinking of mobile navigation` |
| `style` | UI style adjustment (does not affect functionality) | `style: Adjust card shadow parameters` |
| `content` | New or modified articles/content | `content: Newly added Vue project construction records` |
| `refactor` | Code refactoring (no functional changes) | `refactor: Extract general usePosts composable` |
| `chore` | Tools/Configuration/Dependency Changes | `chore: Install gray-matter and marked` |
| `docs` | Document changes (AGENTS.md, README, etc.) | `docs: Complete Git submission specification` |
| `design` | Design system changes (DESIGN.md) | `design: Add label component specifications` |

## Description Rules

- Chinese description, verb beginning
- No more than 50 characters
- No period ending
- Explain "what did you do", not "what file did you do"

## Submission example

```bash
# ✅ Good submission
feat: Create realistic glass BaseCard component
fix: Fix BlogPostPage slug parsing error
style: Unify the hover distance of all cards to 4px
content: Add TailwindCSS 4 study notes
chore: Install @tailwindcss/typography

# ❌ Bad submissions
feat: Update file              # Too vague, I don't know what I did
fix bug                     # No colon, no type
feat: Modified src/App.vue.  # Describe the file, not the function, with a period
```

## AI submission process

After helping with a set of changes:

1.**Report status first**: List the changed files and reasons
2.**Suggested submission information**: Give `type: description` in the format above
3.**Do not commit automatically**: The user confirms that `git commit` is performed
4.**Submit one feature point at a time**: Don't mix multiple unrelated changes together
