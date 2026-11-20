# 006 — Tactile Press Feedback

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files (`src/components/Header.tsx`, `src/components/SingleVehicleCalculator.tsx`)

## Problem

Action buttons (such as "Exportar Excel/CSV", "Dictamen Pericial", currency toggle buttons, and "+ Agregar este vehículo al Comparador") feature hover color shifts, but lack active/press physical response. When clicked or tapped, the button surface remains rigid. In high-craft software (Linear, Apple, Raycast), interactive controls compress slightly on mousedown / touch to provide tactile confirmation of user intent.

```tsx
/* src/components/Header.tsx:82 — current */
className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"

/* src/components/Header.tsx:92 — current */
className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-sm"

/* src/components/SingleVehicleCalculator.tsx:617 — current */
className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
```

## Target

Add subtle, hardware-accelerated press feedback:
- `:active:scale-[0.98]`
- `transition: transform 120ms ease-out, background-color 150ms ease-out`
- Keep scale between 0.97 and 0.98 (never deeper, which would feel cartoonish or sluggish).

```tsx
/* target pattern */
className="... transition-[transform,background-color] duration-150 active:scale-[0.98] active:duration-75 ease-out"
```

## Repo conventions to follow

- Tailwind utility classes are applied directly to JSX elements.
- Keep duration snappy: 75ms for the press down, 150ms for release back to 1.0.

## Steps

1. In `src/components/Header.tsx`, update the action buttons:
   - "COP / USD" toggle buttons: add `active:scale-[0.97] transition-all duration-100`
   - "Exportar Excel/CSV" button: add `active:scale-[0.98] transition-[transform,background-color] duration-150`
   - "Dictamen Pericial" button: add `active:scale-[0.98] transition-[transform,background-color] duration-150`
   - Reset button: add `active:scale-[0.95] transition-transform duration-100`
2. In `src/components/SingleVehicleCalculator.tsx`, update the "+ Agregar este vehículo al Comparador" button (line 617):
   - Add `active:scale-[0.98] transition-[transform,background-color] duration-150`

## Boundaries

- Do NOT scale child text independently.
- Do NOT add press scale to inputs, sliders, or table cells—buttons only.

## Verification

- **Mechanical**: Run `npm run build` and ensure no syntax or Tailwind class compilation errors.
- **Feel check**:
  - Click and hold "Dictamen Pericial" and "Exportar Excel/CSV".
  - Observe the subtle 2% indentation (scale down to 0.98).
  - Release the mouse button and observe the immediate spring-like return to 1.0.
- **Done when**: Every primary and secondary action button provides tactile click feedback.
