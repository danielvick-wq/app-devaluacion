# 007 — Interruptible Toast Notification Transition

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: LOW
- **Category**: Interruptibility & Easing
- **Estimated scope**: 2 files (`src/App.tsx`, `src/index.css`)

## Problem

In `src/App.tsx:212`, the Toast notification uses the utility classes `animate-in fade-in slide-in-from-bottom-2`. However, because `tailwindcss-animate` is not installed, these classes produce no animation; the notification pops onto the screen instantaneously and abruptly disappears when unmounted, without an exit fade.

```tsx
/* src/App.tsx:212 — current */
<div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-slate-100 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
```

## Target

Implement native CSS keyframes for the Toast in `src/index.css`:
- Entrance: rises smoothly from 12px below (`translateY(12px) opacity(0)`) to `translateY(0) opacity(1)` over 200ms using `cubic-bezier(0.23, 1, 0.32, 1)`.
- Exit: when disappearing or updated, handles transitions gracefully without jump.

```css
/* target css in src/index.css */
@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toast-animate-in {
  animation: toast-enter 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
```

## Repo conventions to follow

- Toast notification is rendered in `src/App.tsx`.
- Animation keyframes are placed in `src/index.css`.

## Steps

1. In `src/index.css`, add the `@keyframes toast-enter` and `.toast-animate-in` rules.
2. In `src/App.tsx:212`, replace `animate-in fade-in slide-in-from-bottom-2` with `toast-animate-in`.

## Boundaries

- Do NOT alter toast timeout duration (`3500ms`).
- Do NOT change toast text content or icon placement.

## Verification

- **Mechanical**: Run `npm run build` and ensure clean bundling.
- **Feel check**:
  - Click "Exportar Excel/CSV" or add a vehicle to comparison to trigger a notification.
  - Confirm the toast slides up fluidly by 12px while fading in cleanly over ~200ms.
- **Done when**: The toast notification enters with a smooth, physical slide-and-fade animation.
