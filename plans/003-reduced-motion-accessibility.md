# 003 — Reduced Motion Accessibility

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file (`src/index.css`)

## Problem

The application contains zero rules for `@media (prefers-reduced-motion: reduce)`. Users with vestibular disorders, motion sickness, or cognitive sensitivities who configure their operating system to reduce motion are subjected to uninhibited slide-in transforms, toast translations, and transitions. According to WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions), movement and positional changes must be suppressible while preserving functional feedback (color, opacity).

```css
/* src/index.css — current */
/* No prefers-reduced-motion rules exist */
```

## Target

Implement a robust, normative reduced-motion layer in `src/index.css`. The rule drops position translations, scale transforms, and long durations, replacing them with instant or gentle 100ms fade/color updates.

```css
/* src/index.css — target */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Preserve essential opacity feedback without spatial displacement */
  .motion-reduce-fade {
    transition: opacity 100ms ease-out !important;
    transform: none !important;
  }
}
```

## Repo conventions to follow

- Global CSS and theme directives reside in `src/index.css`.
- Tailwind CSS v4 `@layer base` handles root baseline resets.

## Steps

1. In `src/index.css`, append the `@media (prefers-reduced-motion: reduce)` block at the bottom of the stylesheet.
2. In `src/lib/chartSetup.ts`, check for reduced motion to disable Chart.js animations when the user prefers reduced motion:
```ts
if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ChartJS.defaults.animation = false;
}
```

## Boundaries

- Do NOT completely remove hover color transitions for regular users.
- Do NOT disable interactive functionality (buttons, sliders, tabs remain 100% interactive).

## Verification

- **Mechanical**: Run `npm run build` to verify syntax.
- **Feel check**:
  - Open Chrome/Edge DevTools -> Command Menu (`Ctrl+Shift+P`).
  - Type `Show Rendering` and press Enter.
  - In the Rendering panel, navigate to "Emulate CSS media feature prefers-reduced-motion" and set to `prefers-reduced-motion: reduce`.
  - Trigger toast notifications, modal dialogs, and slider scrubbing.
  - Confirm that elements appear with gentle opacity or instant appearance, without sliding, shaking, or translational motion.
- **Done when**: `prefers-reduced-motion: reduce` cleanly disables motion throughout the entire interface.
