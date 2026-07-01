# Module Bugfix Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the reported module display regressions without changing existing project data or doing large legacy cleanup.

**Architecture:** Keep the current shared/export rendering bridge. Fix issues at exporter, generated CSS, module defaults, and verifier level so Builder / Preview / Export stay aligned.

**Tech Stack:** Next.js, React, TypeScript, generated CSS, NEXORA module registry/export pipeline.

---

### Task 1: Add Regression Coverage

**Files:**
- Add: `scripts/verify-reported-module-regressions.mjs`
- Modify: `package.json`

- [x] Add checks for carousel animation hooks, missing-image placeholder behavior, image size labels, title empty subtitle behavior, and product style layout safety.
- [x] Run affected verifier commands and confirm they fail before implementation.

### Task 2: Fix General / Campaign Modules

**Files:**
- Modify: `lib/export/cssGenerator.ts`
- Modify: relevant exporters in `modules/exporters/*Exporter.ts`
- Modify: module defaults in `data/moduleSchemas.ts` if default copy causes unwanted output.

- [x] Restore KV carousel and product carousel animation/interaction requirements.
- [x] Ensure split section and article image show image size labels.
- [x] Remove missing-image icon output for logo wall, product grid, and product carousel.
- [x] Reduce placeholder size text for banner-products.
- [x] Remove default title small text when subtitle/eyebrow is empty.

### Task 3: Fix Product Modules

**Files:**
- Modify: `lib/export/cssGenerator.ts`
- Modify: `modules/exporters/productAdvancedExporter.ts`
- Modify: `modules/exporters/productFeaturesExporter.ts`

- [x] Fix product proof certification layout.
- [x] Put product feature card indexes inside circles.
- [x] Put product benefits pain-solution metrics in the top-right rounded corner.

### Task 4: Verify and Document

**Files:**
- Modify: `docs/module-development-standard.md`

- [x] Update rules for this bug batch.
- [x] Run affected verifiers plus `typecheck`, `build`, and `git diff --check`.

### Task 5: Commit and Push

- [ ] Commit with a focused message.
- [ ] Push to `origin/main`.
