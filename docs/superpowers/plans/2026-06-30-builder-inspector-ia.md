# Builder Inspector IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the right-side Builder inspector information architecture so future UI work can reduce setting density without changing module data contracts.

**Architecture:** This task is documentation-only. It maps existing `PageModule` fields and form files into stable groups: Content, Images, Style, Action, Advanced, and Check. Later tasks can implement grouped UI using this document without guessing field ownership.

**Tech Stack:** Next.js App Router, React forms in `modules/forms/*`, TypeScript module types in `types/modules.ts`, documentation in Markdown.

---

### Task 1: Create Inspector IA Document

**Files:**
- Create: `docs/builder-inspector-ia.md`
- Read: `components/editor/InspectorPanel.tsx`
- Read: `modules/forms/FormRenderer.tsx`
- Read: `types/modules.ts`
- Read: `data/moduleSchemas.ts`

- [x] **Step 1: Inspect current right-panel structure**

Run:

```bash
sed -n '1,180p' components/editor/InspectorPanel.tsx
sed -n '1,180p' modules/forms/FormRenderer.tsx
sed -n '1,260p' types/modules.ts
sed -n '1,260p' data/moduleSchemas.ts
```

Expected: Inspector wraps `FormRenderer`; individual module forms own field order; module types and default data are available.

- [x] **Step 2: Write the IA document**

Create `docs/builder-inspector-ia.md` with:

```markdown
# NEXORA Builder Inspector IA

更新日期：2026-06-30

本文件定義 NEXORA Builder 右側設定面板的欄位分組。後續 UI 改版必須依照這份分組執行，避免每個模組各自堆疊欄位。
```

The document must include:

- Right-panel goal.
- Group definitions.
- Field ownership rules.
- Module-by-module field map.
- BQ-003 implementation notes.
- QA checklist.

- [x] **Step 3: Update BQ-002 status in sprint spec**

Modify `docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md`.

Set `BQ-002` status to completed and reference `docs/builder-inspector-ia.md`.

- [x] **Step 4: Validate documentation**

Run:

```bash
rg -n "TBD|TODO|未定|待補|PLACEHOLDER" docs/builder-inspector-ia.md docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md
git diff --check
```

Expected:

- `rg` returns no matches.
- `git diff --check` returns no output.

- [x] **Step 5: Commit**

Run:

```bash
git add docs/builder-inspector-ia.md docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md docs/superpowers/plans/2026-06-30-builder-inspector-ia.md
git commit -m "docs: define builder inspector ia"
```

Expected: commit succeeds.
