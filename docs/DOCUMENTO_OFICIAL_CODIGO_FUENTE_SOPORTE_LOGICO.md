# DOCUMENTO TÉCNICO N° 4: EXTRACTO INDEXADO DE CÓDIGO FUENTE
# MUESTREO REPRESENTATIVO DE CÓDIGO FUENTE PARA REGISTRO DE SOPORTE LÓGICO

**REPÚBLICA DE COLOMBIA — DIRECCIÓN NACIONAL DE DERECHO DE AUTOR (DNDA)**  
**SOLICITUD DE REGISTRO DE SOPORTE LÓGICO (PROGRAMA DE COMPUTADOR)**  
**DENOMINACIÓN DE LA OBRA:** AUTOVALUA PRO — SISTEMA ACTUARIAL, ECONÓMICO Y ADMINISTRATIVO DE DEVALUACIÓN VEHICULAR  
**FECHA DE DOCUMENTACIÓN:** NOVIEMBRE DE 2026  
**VERSIÓN DEL SOFTWARE:** 2.5.0 (RELEASE OFICIAL DE PRODUCCIÓN)  
**TITULARIDAD DE DERECHOS:** DANIEL VICK  

---

## 1. PRESENTACIÓN FORMAL Y MARCO LEGAL DE PROTECCIÓN

El presente documento constituye el **MUESTREO REGISTRAL INDEXADO, EXTRACTO REPRESENTATIVO Y PROTOCOLO DE INTEGRIDAD DE CÓDIGO FUENTE** del programa de computador denominado **"AutoValua Pro — Sistema Actuarial, Económico y Administrativo de Devaluación Vehicular"**, elaborado en estricto cumplimiento de la **Ley 23 de 1982**, la **Decisión Andina 351 de 1993**, el **Decreto 1360 de 1989** y los lineamientos de depósito de la **Dirección Nacional de Derecho de Autor (DNDA)** de la República de Colombia.

Para satisfacer la exigencia legal de depósito de soporte lógico protegiendo el secreto industrial y evitando la vulneración de propiedad intelectual por terceros, el expediente se fundamenta en cuatro garantías:

1. **Mapa de Módulos e Indexación Criptográfica (SHA-256):** Identificación exhaustiva de los 22 archivos fuente que conforman el núcleo de la aplicación, totalizando **5,504 líneas de código**, cada uno avalado por su firma digital criptográfica inalterable calculada mediante algoritmo SHA-256 sobre el archivo íntegro.
2. **Muestreo Legal Representativo de Inicio y Cierre:** Depósito de las primeras 30 a 45 líneas y últimas 30 a 45 líneas de los módulos esenciales, certificando la estructura sintáctica, contratos de tipos y patrones de diseño.
3. **Reserva Legal de Código Intermedio:** Protección y secreto comercial sobre las rutinas numéricas intermedias de iteración de Terborgh, matrices de decaimiento continuo y algoritmos de interpolación.
4. **Validación de Integridad y Sanitización:** Aplicación de buenas prácticas de ingeniería de software, tipado estricto en TypeScript y protección contra inyecciones de código y fórmulas en exportaciones.

---

## 2. ÍNDICE GENERAL Y MAPA DE MÓDULOS DEL CÓDIGO FUENTE (22 ARCHIVOS / 5,504 LÍNEAS)

| Archivo / Módulo Fuente | Rol y Descripción Funcional | Lenguaje / Formato | Total Líneas | Muestreo Depositado | Firma Digital de Autenticidad (SHA-256) | Estado de Reserva |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `src/lib/depreciationEngine.ts` | Motor Matemático y Actuarial de Devaluación (Continuo $e^{-\lambda t}$, Discreto, NIC 16, DDB, Terborgh) | TypeScript Nativo | 361 | Líneas 1–40 y 330–361 | `AEC12FAE1668DCF24F38F159C73C3C6690A1715F55D22469ECA0538FA0B8B044` | Reservado (Reserva Parcial Intermedia) |
| `src/lib/recommendationEngine.ts` | Motor de Recomendación por Presupuesto, Ponderación Comercial y Análisis de Segmento | TypeScript Nativo | 311 | Líneas 1–45 y 275–311 | `9BBDC9CECBCD57489D343676C98470AA307E22427D7F00099B11DD2CCF425E2E` | Reservado (Reserva Parcial Intermedia) |
| `src/data/sicFasecoldaData.ts` | Base de Datos Oficial Robusta de 51 Vehículos, Retenciones Históricas y Baremo Fasecolda/SIC | TypeScript Nativo | 1,110 | Líneas 1–45 y 1070–1110 | `375001BD2689FC3F4BCE96A5CE8B48124B45EBAA972C04FBA3D69176D869DD3F` | Reservado (Reserva Parcial Intermedia) |
| `src/types/vehicle.ts` | Modelado de Entidades de Dominio, Parámetros Vehiculares, Proyecciones y Tipos Actuariales | TypeScript Types | 108 | Líneas 1–35 y 75–108 | `E5DBA454DB9D9880871E771599F490808BEE96FF968EE0C21A1660A52E35E9D9` | Registrado Completo |
| `src/lib/chartSetup.ts` | Configuración y Registro Global de Componentes de Renderizado Vectorial Chart.js | TypeScript Nativo | 38 | Líneas 1–38 (Completo) | `A267AFE65F51F37BFB18CCDF32528F069AA1B0629315EBF74D0A51C576DBCFF8` | Registrado Completo |
| `src/App.tsx` | Enrutador Central de Pestañas, Orquestador de Estado Global y Control de Notificaciones | React 19 / TSX | 340 | Líneas 1–45 y 300–340 | `A651C81B66149017D1E96C5C4BB9F34AA5B53279BA216FA0F34D4430D1E1671C` | Reservado (Reserva Parcial Intermedia) |
| `src/components/BudgetRecommender.tsx` | Asesor Inteligente de Compra por Presupuesto, Justificación Comercial y Análisis Actuarial | React 19 / TSX | 618 | Líneas 1–45 y 575–618 | `60DAE4FED249F6D882F8E8DFF0EAA0083BC51A1EB5A1A0A418D76ED71852CF77` | Reservado (Reserva Parcial Intermedia) |
| `src/components/SingleVehicleCalculator.tsx` | Valuador Actuarial Individual, Panel de Sliders, Matriz Temporal y Desglose de Desgaste | React 19 / TSX | 885 | Líneas 1–45 y 845–885 | `DAF1E742670973E5A06220C9364B2917A0D3E97B8947ADC4A7AF6E664023ECFF` | Reservado (Reserva Parcial Intermedia) |
| `src/components/VehicleComparison.tsx` | Comparador Multi-Vehículo en Horizontes de 3 a 10 Años con Trazas de Retención, Precios y TCO | React 19 / TSX | 351 | Líneas 1–40 y 315–351 | `02EA67338D3C4F824BED1F038B35EC5ED3D0B6B8B606B65F46E9E58051E2E454` | Reservado (Reserva Parcial Intermedia) |
| `src/components/SicFasecoldaExplorer.tsx` | Explorador Filtrable de Tablas Oficiales con Búsqueda en Vivo y Filtros de Segmento | React 19 / TSX | 171 | Líneas 1–35 y 135–171 | `F6EE2994675F9375761B2E3CB68099A0614C7235457327D4B5321BACE7A09382` | Reservado (Reserva Parcial Intermedia) |
| `src/components/DepreciationChart.tsx` | Renderizador de Curvas de Decaimiento Financiero (Nominal, Deflactado, NIC 16, Salvamento) | React 19 / TSX | 147 | Líneas 1–35 y 115–147 | `509F733151C87781BE25FF5B27D4AA1D9229D43921CAAC5BFFF1D3D9AC3C0536` | Reservado (Reserva Parcial Intermedia) |
| `src/components/TerborghChart.tsx` | Renderizador Gráfico de Curva de Terborgh y Costo Medio Anual Acumulado ($AAC$) | React 19 / TSX | 139 | Líneas 1–35 y 105–139 | `664557CF372F4DF742CD0979333BBB92FC14BB04C09A06FFBBB9C62E91654C9D` | Reservado (Reserva Parcial Intermedia) |
| `src/components/ValuationReportModal.tsx` | Generador de Dictamen Pericial de Avalúo Formateado para Impresión y Emisión de PDF | React 19 / TSX | 235 | Líneas 1–40 y 195–235 | `6C79EE6F5C2FBB64D4C5DCC7E4D4425F2ADA3B1111CA36A990FF466C59158D68` | Reservado (Reserva Parcial Intermedia) |
| `src/components/EconomicTheoryGuide.tsx` | Módulo de Pedagogía Económica, Fundamentación de Fórmulas y Marco Normativo NIIF | React 19 / TSX | 126 | Líneas 1–30 y 95–126 | `767887CF7D4F5C84933406ED4D58C6A007A318ACCF1EF82D0D036A1F4DC4350C` | Registrado Parcial |
| `src/components/Header.tsx` | Cabecera Institucional, Selector de Moneda COP/USD y Navegación entre Módulos | React 19 / TSX | 164 | Líneas 1–35 y 130–164 | `1ECFBA2D40618EB45CF861B137FA14E1C4137249EA74AB0CC9917A19CCB0AB3D` | Registrado Parcial |
| `src/components/MetricCard.tsx` | Tarjeta Analítica de Métricas Financieras con Indicador de Tendencia y Badge | React 19 / TSX | 87 | Líneas 1–30 y 60–87 | `1C3C11EB4E9D8F069510CEE8F881FB552ED5BE392E3AB9C75D8F115CF5ACFEB7` | Registrado Completo |
| `src/index.css` | Sistema de Diseño Global, Estilos de Impresión (@media print) y Variables CSS | CSS3 / Tailwind v4 | 146 | Líneas 1–30 y 115–146 | `C223D24D06F147C70964D6FBE2EF78DE83173F4F715353368B4D027204C72700` | Registrado Parcial |
| `src/App.css` | Reglas de Animación Específicas y Micro-transiciones Fluidas | CSS3 | 158 | Líneas 1–30 y 125–158 | `6E25A776D3E8102DA5BACB3CB99F4A5FC662A2E01E6143140671A556D28C3D5C` | Registrado Parcial |
| `src/main.tsx` | Punto de Entrada de la Aplicación y Montaje en el DOM de React 19 | TypeScript Nativo | 9 | Líneas 1–9 (Completo) | `6E9E5807FCBD48B75A96DB5CBEF36C996262196BE42E6D4760DC86BABBE61AD2` | Registrado Completo |
| `scripts/verify-actuarial-engine.ts` | Suite de Pruebas Unitarias del Motor Actuarial, Terborgh y Aislamiento Contable | TypeScript Nativo | 75 | Líneas 1–75 (Completo) | `44E7F9ED1406ADBA39C8A9C8F7860BCAE0B4A224B1F80B9FD753209C5082BDD3` | Registrado Completo |
| `scripts/verify-recommendation-engine.ts` | Suite de Pruebas Automatizadas del Motor de Recomendación por Presupuesto | TypeScript Nativo | 39 | Líneas 1–39 (Completo) | `7D8B96F2B61B19829AB8BE18B4E7B0E2335095E9960B060C65088E276655D60F` | Registrado Completo |
| `public/icons.svg` | Sprite Vectorial de Identificadores y Marcadores Visuales | SVG Vectorial | 24 | Líneas 1–24 (Completo) | `B45FA506195CFCDEF406BA9F0C77B36DDC1A7C224040926EC70ABC2FDEA7B93A` | Registrado Completo |

---

## 3. SECCIÓN I: MUESTREO REPRESENTATIVO DEL MOTOR ACTUARIAL (`src/lib/depreciationEngine.ts`)

### 3.1 Encabezado y Factores de Desgaste (Líneas 1 a 40)

```typescript
/**
 * AutoValua Pro — Motor Matemático y Actuarial de Depreciación Vehicular
 * Incorpora:
 * - Ley de decaimiento exponencial continuo V(t) = V0 * e^(-λt)
 * - Decaimiento discreto compuesto con shock de rodamiento (concesionario)
 * - Métodos contables NIIF (Línea Recta y Saldo Decreciente DDB)
 * - Tablas actuariales de referencia Fasecolda / SIC
 * - Factores multivariables de desgaste físico, kilometraje y mercado
 * - Curva de Terborgh y Costo Total de Propiedad (TCO) sin doble conteo
 */

import type {
  VehicleParameters,
  VehicleAnalysisResult,
  YearProjection,
  ModelType,
  OfficialSicFasecoldaVehicle
} from '../types/vehicle';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';

/**
 * Calcula los multiplicadores de desgaste basados en condiciones operativas
 */
export function calculateWearBreakdown(v: VehicleParameters) {
  // 1. Factor de Kilometraje (Ref: 15,000 km/año estándar Colombia / Latam)
  const standardKm = 15000;
  const kmDiff = v.annualMileageKm - standardKm;
  let kmMultiplier = 1.0 - (kmDiff / 15000) * 0.12;
  kmMultiplier = Math.min(Math.max(kmMultiplier, 0.72), 1.08);
  const mileagePenaltyPct = Number(((1 - kmMultiplier) * 100).toFixed(1));

  // 2. Factor de Mantenimiento
  let maintenanceFactor = 1.0;
  switch (v.maintenance) {
    case 'excelente': maintenanceFactor = 1.04; break;
    case 'bueno': maintenanceFactor = 1.00; break;
    case 'regular': maintenanceFactor = 0.92; break;
    case 'deficiente': maintenanceFactor = 0.82; break;
    default: maintenanceFactor = 1.00; break;
  }
```

### 3.2 Cierre y Formateadores Numéricos (Líneas 330 a 361)

```typescript
  // Determinación Rigurosa del Año Óptimo de Reemplazo (Curva de Terborgh)
  let optimalReplacementYear = 5;
  let minAverageAnnualCost = Infinity;

  projections.forEach((proj) => {
    if (proj.averageAnnualCost < minAverageAnnualCost) {
      minAverageAnnualCost = proj.averageAnnualCost;
      optimalReplacementYear = proj.year;
    }
  });

  return {
    vehicle,
    currentEstimatedValue: currentEstValue,
    targetYearEstimatedValue,
    projections,
    optimalReplacementYear,
    totalDepreciationAtTargetYear: totalDeprecAtTarget,
    totalTCOAtTargetYear: totalTCOAtTarget,
    effectiveAnnualDecayRatePct,
    salvageValue,
    combinedWearMultiplier: wearMultiplier,
    isFasecoldaMatched,
    breakdown
  };
}

export function formatCurrency(amount: number, currency: 'COP' | 'USD' = 'COP'): string {
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
```

---

## 4. SECCIÓN II: MUESTREO REPRESENTATIVO DEL RECOMENDADOR (`src/lib/recommendationEngine.ts`)

### 4.1 Encabezado y Conversiones de Presupuesto (Líneas 1 a 45)

```typescript
import type { 
  OfficialSicFasecoldaVehicle, 
  VehicleParameters, 
  VehicleAnalysisResult,
  FuelType 
} from '../types/vehicle';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';
import { analyzeVehicleDepreciation, formatCurrency } from './depreciationEngine';

export interface BudgetRecommendationParams {
  budget: number;
  currency: 'COP' | 'USD';
  tolerancePct?: number;
  selectedCategory?: string;
  selectedFuel?: string;
  priority?: 'commercial' | 'retention' | 'tco' | 'balanced';
}

export interface RecommendedVehicleItem {
  officialVehicle: OfficialSicFasecoldaVehicle;
  vehicleParams: VehicleParameters;
  analysis: VehicleAnalysisResult;
  priceDiff: number;
  priceDiffPct: number;
  commercialScore: number;
  retentionScore: number;
  compositeScore: number;
  badgeTag: string;
  segmentAvgDecayPct: number;
  annualSavingsVsSegment: number;
  whyRecommendedSummary: string;
  detailedWhy: {
    marketLiquidity: string;
    depreciationAdvantage: string;
    operatingCostAdvantage: string;
    resaleSecurity: string;
  };
}
```

### 4.2 Cierre y Ensamblador de Resultados (Líneas 275 a 311)

```typescript
  // Ordenamos de mayor a menor puntuación compuesta
  evaluatedItems.sort((a, b) => b.compositeScore - a.compositeScore);

  const primaryRecommendation = evaluatedItems[0] || null;
  const alternativeRecommendations = evaluatedItems.slice(1, 4);

  return {
    budgetInCOP,
    budgetFormatted: formatCurrency(budget, currency),
    currency,
    rangeMin,
    rangeMax,
    tolerancePct: effectiveTolerance,
    totalMatches: evaluatedItems.length,
    primaryRecommendation,
    alternativeRecommendations,
    allCandidates: evaluatedItems
  };
}
```

---

## 5. SECCIÓN III: MUESTREO DE LA BASE DE DATOS OFICIAL (`src/data/sicFasecoldaData.ts`)

### 5.1 Encabezado y Registro de Segmentos de Entrada (Líneas 1 a 45)

```typescript
import type { OfficialSicFasecoldaVehicle } from '../types/vehicle';

/**
 * Base de Datos Oficial Robusta de Referencia: Fasecolda / SIC / ANDEMOS / MinTransporte (Colombia)
 * Actualizada con los vehículos más comerciales y representativos de cada segmento en Colombia (2024-2026).
 * Incluye histórico actuarial de retención a 1, 2, 3, 4, 5, 6, 7, 8, 9 y 10 años, métricas de liquidez de reventa,
 * días promedio en vitrina y argumentos técnicos/financieros de recomendación por presupuesto.
 */
export const FASECOLDA_SIC_DATABASE: OfficialSicFasecoldaVehicle[] = [
  // ==========================================
  // SEGMENTO ECONÓMICO Y DE ENTRADA ($45M - $75M)
  // ==========================================
  {
    code: 'FAS-REN-KWD-OUT',
    brand: 'Renault',
    line: 'Kwid Outsider 1.0L',
    category: 'Hatchback',
    fuelType: 'gasolina',
    referencePriceNew: 56000000,
    historicalRetentionPct: [80.0, 69.5, 60.5, 52.8, 46.0, 40.0, 34.8, 30.2, 26.0, 22.5],
    typicalAnnualDecayPct: 12.5,
    marketLiquidityScore: 'Alta',
    reliabilityScore: 8.2,
    commercialRank: 8,
    resaleDaysAverage: 22,
    whyRecommended: 'Líder en ventas de entrada por su precio sumamente asequible y excelente despeje al suelo (18.5 cm) para vías colombianas. Mantenimiento y repuestos hiper económicos disponibles en cualquier rincón del país.',
    pros: [
      'Repuestos y filtros de bajo costo en cualquier almacén',
      'Consumo promedio sobresaliente de 55-60 km/galón',
      'Despeje al suelo estilo crossover para baches urbanos'
    ],
    targetAudience: 'Primer vehículo, presupuesto ajustado, movilidad urbana y estudiantes'
  },
```

---

## 6. CONCLUSIÓN REGISTRAL Y FIRMA DEL TITULAR

El presente extracto constituye el reflejo fidedigno de los componentes de código fuente que integran el software **AutoValua Pro (Versión 2.5.0)**. Todas las firmas de autenticidad criptográfica SHA-256 han sido verificadas en el entorno local de desarrollo de Manizales, Caldas, Colombia.

**TITULAR DE LA OBRA Y AUTOR:**  
**DANIEL VICK**  
*Ingeniero y Creador del Software*  
*Dirección Nacional de Derecho de Autor (DNDA) — República de Colombia*
