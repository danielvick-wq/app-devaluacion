# 002 — GPU-Scoped Transitions

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files (`src/components/MetricCard.tsx`, `src/components/Header.tsx`)

## Problem

`transition-all` is applied to `MetricCard` containers and top navigation tab buttons. `transition-all` instructs the browser to transition every computed property—including layout-triggering properties (`padding`, `margin`, `border-width`, `font-size`) that cannot be GPU-composited. On dashboards with multiple cards and dense tables, this forces style recalculations and layout thrashing on every pointer hover.

```tsx
/* src/components/MetricCard.tsx:41 — current */
<div className="bg-slate-900 border border-slate-800 rounded-lg p-4 relative overflow-hidden transition-all hover:border-slate-700 shadow-sm flex flex-col justify-between">

/* src/components/Header.tsx:113 — current */
className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all border-b-2 whitespace-nowrap ...`}
```

## Target

Replace `transition-all` with targeted transitions that animate only GPU-accelerated or non-layout properties (`border-color`, `background-color`, `color`, `box-shadow`):

```tsx
/* src/components/MetricCard.tsx — target */
<div className="bg-slate-900 border border-slate-800 rounded-lg p-4 relative overflow-hidden transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-700 shadow-sm flex flex-col justify-between">

/* src/components/Header.tsx — target */
className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ...`}
```

## Repo conventions to follow

- Tailwind utility classes are used for interactive UI styling.
- Transitions should use standard durations under 200ms (`duration-150`) and `ease-out`.

## Steps

1. In `src/components/MetricCard.tsx`, locate line 41 and replace `transition-all` with:
   `transition-[border-color,box-shadow] duration-150 ease-out`
2. In `src/components/Header.tsx`, locate lines 113, 125, 137, and 149 on the navigation `<button>` elements and replace `transition-all` with:
   `transition-colors duration-150 ease-out`

## Boundaries

- Do NOT change the layout, padding, font sizes, or border widths of the cards or navigation tabs.
- Do NOT touch business logic or metric calculations.

## Verification

- **Mechanical**: Run `npm run build` and verify that Tailwind compiles the custom transition without errors.
- **Feel check**:
  - Hover over the 6 KPI metric cards in the dashboard.
  - Hover over the 4 navigation tabs.
  - Confirm the borders and colors change smoothly with crisp sub-150ms feedback, without any jitter or layout recalculation.
- **Done when**: Zero occurrences of `transition-all` remain in `src/components/MetricCard.tsx` and `src/components/Header.tsx`.
