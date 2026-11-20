# 001 — Chart Interaction Responsiveness

- **Status**: DONE
- **Commit**: working-tree
- **Severity**: HIGH
- **Category**: Easing & duration / Performance
- **Estimated scope**: 2 files (`src/lib/chartSetup.ts`, `src/components/DepreciationChart.tsx`)

## Problem

Chart.js ships with a default animation duration of 1,000ms using an internal easing tween. When a user drags the time horizon slider or kilometraje slider in `SingleVehicleCalculator.tsx`, state updates on every increment. The charts attempt to run full 1,000ms animations on each micro-tick, causing sluggish rendering, laggy line lagging behind the cursor, and dropped frames during rapid user interaction.

```ts
/* src/lib/chartSetup.ts:24 — current */
ChartJS.defaults.font.size = 12;
```

## Target

Configure snappy, high-performance animation parameters for financial time-series charts. Reduce default animation duration from 1,000ms to 180ms with `easeOutQuart`, and disable animation during real-time continuous slider scrubbing to ensure 60fps responsiveness.

```ts
/* src/lib/chartSetup.ts — target */
ChartJS.defaults.animation = {
  duration: 180,
  easing: 'easeOutQuart'
};
ChartJS.defaults.transitions = {
  active: {
    animation: {
      duration: 80
    }
  }
};
```

## Repo conventions to follow

- Chart.js defaults live in `src/lib/chartSetup.ts`. All global chart settings (colors, fonts, borders) are registered there once upon application bootstrap.

## Steps

1. In `src/lib/chartSetup.ts`, add the global animation configuration right below `ChartJS.defaults.font.size = 12;`:
```ts
ChartJS.defaults.animation = {
  duration: 180,
  easing: 'easeOutQuart'
};
```
2. In `src/components/DepreciationChart.tsx`, inside `options`, ensure `animation` adheres to the 180ms budget:
```ts
animation: {
  duration: 180,
  easing: 'easeOutQuart'
},
```
3. In `src/components/TerborghChart.tsx`, inside `options`, apply the matching 180ms animation block:
```ts
animation: {
  duration: 180,
  easing: 'easeOutQuart'
},
```

## Boundaries

- Do NOT remove Chart.js plugins or scales configuration.
- Do NOT alter calculation logic or dataset formulas in `depreciationEngine.ts`.
- Do NOT install external charting libraries.

## Verification

- **Mechanical**: Run `npm run build` and ensure compilation passes with zero type errors.
- **Feel check**:
  - Open the application in the browser at `http://localhost:5173`.
  - Scrub the "Horizonte de Evaluación Actuarial" slider rapidly back and forth between 0 and 20 years.
  - The chart curves must follow the cursor instantaneously without the 1-second floating delay.
- **Done when**: The charts render smoothly without perceptible lag during continuous range slider interaction.
