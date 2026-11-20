# 005 — Centralized Motion Tokens

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`src/index.css`)

## Problem

The design system `DESIGN.md` mandates an intentional rhythm and motion tier (ENERGY 2/5, MOTION 2/5 - sub-200ms transitions). However, `src/index.css` does not declare standardized motion tokens (`--ease-*` and `--duration-*`). Instead, arbitrary Tailwind defaults (`duration-150`, `duration-200`, or standard browser easings) are scattered across files, resulting in inconsistent timing across navigation, cards, sliders, and overlays.

```css
/* src/index.css:3-15 — current */
@theme {
  --color-canvas: #090D16;
  --color-surface: #0F172A;
  --color-surface-elevated: #1E293B;
  --color-surface-subtle: #131C31;
  --color-border-subtle: #1E293B;
  --color-accent-emerald: #10B981;
  --color-accent-cyan: #06B6D4;
  --color-accent-amber: #F59E0B;
  --color-accent-rose: #EF4444;
  --color-accent-indigo: #6366F1;
}
```

## Target

Declare the standardized motion tokens inside `@theme` and `:root` according to Emil Kowalski's guidelines:
- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (strong responsive ease-out for entering UI and feedback)
- `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` (strong curve for on-screen movement/morphing)
- `--duration-instant`: `100ms`
- `--duration-fast`: `160ms`
- `--duration-normal`: `240ms`

```css
/* src/index.css — target */
@theme {
  --color-canvas: #090D16;
  --color-surface: #0F172A;
  --color-surface-elevated: #1E293B;
  --color-surface-subtle: #131C31;
  --color-border-subtle: #1E293B;
  --color-accent-emerald: #10B981;
  --color-accent-cyan: #06B6D4;
  --color-accent-amber: #F59E0B;
  --color-accent-rose: #EF4444;
  --color-accent-indigo: #6366F1;

  /* Motion Tokens */
  --ease-ui-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-ui-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --duration-instant: 100ms;
  --duration-fast: 160ms;
  --duration-normal: 240ms;
}
```

## Repo conventions to follow

- Color tokens and Tailwind theme variables are configured in `src/index.css` inside `@theme`.
- CSS custom properties are placed in `:root` inside `@layer base`.

## Steps

1. In `src/index.css`, add `--ease-ui-out` and `--ease-ui-in-out` inside the `@theme` block.
2. In `src/index.css`, inside `:root`, define `--ease-out`, `--ease-in-out`, `--duration-instant`, `--duration-fast`, and `--duration-normal`.
3. In `DESIGN.md`, document these tokens under Section 1 & 2 so designers and future engineers share the single source of truth.

## Boundaries

- Do NOT alter existing color hex codes or typography scales.
- Do NOT use weak browser-default `ease` or `linear` for UI entrances.

## Verification

- **Mechanical**: Run `npm run build` to confirm CSS builds cleanly.
- **Feel check**: Inspect `:root` computed styles in DevTools Elements tab to verify variables are exported and accessible to components.
- **Done when**: All components can reference `var(--ease-out)` and `var(--duration-fast)` consistently.
