# DESIGN.md — Sistema de Diseño: AutoValua Pro (Fintech Analytical Workbench)

> **Inspiración y Paradigma**: OpenDesign `linear-app` / `supabase` / Bloomberg Financial Terminal.
> **Propósito**: Herramienta de alta precisión para valoración de activos móviles, cálculo actuarial de devaluación y depreciación contable/económica de automotores bajo estándares NIIF (NIC 16), tablas SIC/Fasecolda y modelos estocásticos/exponenciales de mercado.
> **Audiencia**: Administradores de flotas, economistas, peritos avaluadores, directores financieros (CFOs), concesionarios y propietarios exigentes.

---

## 1. Diales Antislop (R-37)

- **ENERGY**: 2 / 5 (Sobrio, institucional, fidedigno; sin fuegos artificiales decorativos ni hiperactividad visual).
- **RHYTHM**: 4 / 5 (Estructura de cuadrícula modular densa, micro-jerarquías tabulares, métricas clave con lectura analítica inmediata).
- **MOTION**: 2 / 5 (Transiciones fluidas sub-200ms para interactividad de sliders y filtros; sin animaciones gratuitas que retrasen el análisis de datos).

---

## 2. Paleta de Color Tokens (Estricto Contraste WCAG AA / AAA)

Evitamos deliberadamente los degradados morados/fucsias genéricos de IA ("AI slop"). Empleamos una paleta técnica Slate/Zinc de inspiración financiera:

- **Fondos (Backgrounds)**:
  - `bg-canvas`: `#090D16` (Negro pizarra ultra profundo para reducir fatiga ocular)
  - `bg-surface`: `#0F172A` (Slate 900 estructurado)
  - `bg-surface-elevated`: `#1E293B` (Slate 800 para tarjetas y paneles interactivos)
  - `bg-surface-subtle`: `#131C31` (Slate 850 para filas de tabla alternas)
  - `border-subtle`: `#1E293B` / `#334155` (Bordes milimétricos nítidos de 1px)

- **Tipografía y Legibilidad**:
  - `text-primary`: `#F8FAFC` (Slate 50, contraste 14.8:1 con el fondo)
  - `text-secondary`: `#94A3B8` (Slate 400, contraste 5.8:1)
  - `text-muted`: `#64748B` (Slate 500, etiquetas secundarias y unidades)

- **Acentos Semánticos Financieros**:
  - `accent-emerald`: `#10B981` / `#059669` (Retención de valor, rendimiento positivo, vehículos con baja devaluación, estados óptimos)
  - `accent-amber`: `#F59E0B` / `#D97706` (Alertas de depreciación moderada, costo de mantenimiento creciente, punto de alerta de reemplazo)
  - `accent-rose`: `#EF4444` / `#DC2626` (Pérdida de valor acelerada, punto crítico de reemplazo vehicular, siniestralidad severa)
  - `accent-cyan`: `#06B6D4` / `#0891B2` (Proyecciones matemáticas teóricas, curvas de decaimiento exponencial continuo)
  - `accent-indigo`: `#6366F1` (Tablas regulatorias oficiales SIC / Fasecolda)

- **Tokens de Movimiento & Easing (Emil Kowalski Motion Design)**:
  - `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (Curva de entrada rápida y desaceleración responsiva)
  - `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` (Curva para morphing de datos)
  - `--duration-instant`: `100ms` (Retroalimentación táctil de botones)
  - `--duration-fast`: `160ms` (Hover y microtransiciones)
  - `--duration-normal`: `240ms` (Entrada de modales y diálogos)

---

## 3. Tipografía & Jerarquía Numérica

- **Tipografía Principal**: `Inter`, system-ui, sans-serif (legibilidad óptima en dashboards densos).
- **Tipografía Numérica / Tabular**: `JetBrains Mono`, `Fira Code`, monospace con soporte de `font-variant-numeric: tabular-nums` para que los importes monetarios ($ COP / USD) y porcentajes no salten al actualizarse en tiempo real.
- **Jerarquía**:
  - `Display / KPI`: `text-2xl` a `text-3xl` bold tabular con etiqueta descriptor en `text-xs uppercase tracking-wider text-muted`.
  - `Secciones`: `text-base` font-semibold con identificador de módulo.
  - `Datos de tabla`: `text-sm` regular con alineación numérica estricta a la derecha.

---

## 4. Filosofía de Componentes y Funcionalidad Completa

1. **Cero Elementos Dummy**: Cada botón, pestaña, selector y slider calcula y actualiza la matriz financiera al instante.
2. **Explicabilidad Matemática**: Toda métrica cuenta con tooltip o panel de desglose que enseña la fórmula matemática aplicada ($V(t) = V_0 e^{-\lambda t}$, tasa anual $d$, factor de kilometraje $F_{km}$, etc.).
3. **Estados de Error y Validaciones Robustas**: Si el usuario introduce valores fuera de rango (ej. precios negativos, kilometrajes imposibles), la interfaz provee retroalimentación preventiva sin romperse.
4. **Exportabilidad Real**: Posibilidad de exportar los reportes a CSV/Excel y generar vista imprimible de dictamen pericial.
