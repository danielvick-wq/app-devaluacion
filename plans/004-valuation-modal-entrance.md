# 004 — Valuation Modal Entrance & Physicality

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files (`src/components/ValuationReportModal.tsx`, `src/index.css`)

## Problem

The modal for the Executive Appraisal Certificate (`ValuationReportModal.tsx`) renders abruptly upon clicking "Dictamen Pericial". The dark backdrop and the modal dialog appear instantaneously with zero transition or scale physics, creating a visual flash/jump that violates Emil Kowalski's guidelines on spatial entrance. Furthermore, in real life objects do not appear from scale(0) or from nowhere; they should enter with a subtle scale (`scale(0.96) -> scale(1)`) and fade (`opacity: 0 -> 1`).

```tsx
/* src/components/ValuationReportModal.tsx:66-67 — current */
<div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm modal-backdrop-print">
  <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 card-print">
```

## Target

Implement an entrance transition on the modal overlay and dialog card:
- Backdrop: `opacity: 0 -> 1` over 200ms `ease-out`.
- Modal Dialog Card: enters from `opacity: 0; transform: scale(0.96) translateY(8px)` to `opacity: 1; transform: scale(1) translateY(0)` over 220ms using `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- Modals are centered, so `transform-origin: center` is correct and preserved.

```css
/* target css in src/index.css */
@keyframes modal-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-content-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-backdrop {
  animation: modal-backdrop-in 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-modal-content {
  animation: modal-content-in 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
  transform-origin: center;
}
```

## Repo conventions to follow

- Custom animation keyframes and classes are declared in `src/index.css`.
- Classes are applied to components using Tailwind class lists.

## Steps

1. In `src/index.css`, add the `@keyframes modal-backdrop-in` and `@keyframes modal-content-in` definitions alongside `.animate-modal-backdrop` and `.animate-modal-content`.
2. In `src/components/ValuationReportModal.tsx`, update the backdrop container and dialog container classes:
   - On the backdrop `<div>`: add `animate-modal-backdrop`.
   - On the inner card `<div>`: add `animate-modal-content`.

## Boundaries

- Do NOT change modal markup, print layout, or appraisal certificate data.
- Never use `scale(0)` (always start at `scale(0.96)`).
- Ensure print media styles continue to override animations with `animation: none !important;`.

## Verification

- **Mechanical**: Run `npm run build` and check for clean compilation.
- **Feel check**:
  - Click "Dictamen Pericial" in the top bar.
  - In DevTools Animations tab, set speed to 25%.
  - Verify that the backdrop fades in while the dialog card expands smoothly from 96% to 100% with a slight 8px upward settling motion.
- **Done when**: The modal opens with a fluid, natural entrance that feels anchored rather than flashing onto the screen.
