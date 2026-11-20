# Roadmap de Planes de Animación y Movimiento — AutoValua Pro

> Generado por la habilidad `improve-animations` siguiendo la filosofía de ingeniería de diseño de Emil Kowalski y los estándares de OpenDesign y antislop.

---

## 📊 Tabla General de Planes

| Plan # | Título | Severidad | Categoría | Archivos Afectados | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **[001](001-chart-interaction-responsiveness.md)** | Chart Interaction Responsiveness | **HIGH** | Easing & Duration / Performance | `chartSetup.ts`, `DepreciationChart.tsx` | `DONE` |
| **[002](002-gpu-scoped-transitions.md)** | GPU-Scoped Transitions (`transition-all` fix) | **HIGH** | Performance | `MetricCard.tsx`, `Header.tsx` | `DONE` |
| **[003](003-reduced-motion-accessibility.md)** | Reduced Motion Accessibility | **HIGH** | Accessibility | `index.css`, `chartSetup.ts` | `DONE` |
| **[004](004-valuation-modal-entrance.md)** | Valuation Modal Entrance & Physicality | **MEDIUM** | Physicality & Origin | `ValuationReportModal.tsx`, `index.css` | `DONE` |
| **[005](005-centralized-motion-tokens.md)** | Centralized Motion Tokens | **MEDIUM** | Cohesion & Tokens | `index.css`, `DESIGN.md` | `DONE` |
| **[006](006-tactile-press-feedback.md)** | Tactile Press Feedback (`:active:scale`) | **MEDIUM** | Physicality & Origin | `Header.tsx`, `SingleVehicleCalculator.tsx` | `DONE` |
| **[007](007-toast-interruptible-animation.md)** | Interruptible Toast Notification Transition | **LOW** | Interruptibility | `App.tsx`, `index.css` | `DONE` |

---

## 🎯 Orden Recomendado de Ejecución

Para evitar retrabajo y maximizar la coherencia:

1. **Fase 1: Fundamentos y Tokens (Prerrequisitos)**
   - Ejecutar **Plan 005 (Tokens Centralizados)**: Declara `--ease-out`, `--ease-in-out` y duraciones en el `@theme` de `src/index.css`.
   - Ejecutar **Plan 003 (Accesibilidad)**: Añade el bloque `@media (prefers-reduced-motion)` para proteger a todos los componentes desde la base.

2. **Fase 2: Rendimiento Crítico**
   - Ejecutar **Plan 001 (Chart Responsiveness)**: Elimina el retardo de 1,000ms de Chart.js para que el arrastre de sliders fluya a 60 fps.
   - Ejecutar **Plan 002 (GPU Transitions)**: Elimina `transition-all` de las tarjetas y pestañas.

3. **Fase 3: Física, Microinteracciones y Modales**
   - Ejecutar **Plan 004 (Modal Entrance)**: Agrega la entrada física con escala y fade al Dictamen Pericial.
   - Ejecutar **Plan 006 (Press Feedback)**: Añade compresión táctil (`:active:scale-[0.98]`) en los botones de acción.
   - Ejecutar **Plan 007 (Toast Notification)**: Reemplaza las clases inertes del Toast por animación nativa fluida.

---

## 🚀 Cómo Ejecutar un Plan

Cada plan en `plans/` es completamente autosuficiente con código antes/después y criterios de feel-check. Puede ser ejecutado por cualquier agente o modelo con la instrucción:

```markdown
Ejecuta el plan plans/001-chart-interaction-responsiveness.md
```
