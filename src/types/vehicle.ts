/**
 * AutoValua Pro — Tipos y Estructuras de Datos
 * Modelado económico, actuarial y administrativo de depreciación vehicular.
 */

export type ModelType = 
  | 'exponential_continuous' // V(t) = V0 * e^(-λt) decaimiento continuo
  | 'exponential_discrete'   // V(t) = V0 * (1 - d1) * (1 - d)^(t-1) discreto anual
  | 'accounting_straight'    // Línea Recta Contable NIIF (NIC 16)
  | 'accounting_declining'   // Saldo Decreciente Doble (DDB)
  | 'fasecolda_sic_table';   // Tablas Oficiales de Referencia Fasecolda / SIC

export type FuelType = 'gasolina' | 'diesel' | 'hibrido' | 'electrico';

export type MaintenanceCondition = 'excelente' | 'bueno' | 'regular' | 'deficiente';

export type UsageType = 'particular' | 'corporativo' | 'plataforma_taxi' | 'carga_comercial';

export type AccidentHistory = 'sin_siniestros' | 'estetico_menor' | 'medio_reparado' | 'estructural_severo';

export interface VehicleParameters {
  id: string;
  name: string;
  brand: string;
  line: string;
  modelYear: number;
  initialPrice: number; // Precio de compra o 0 km (COP o USD)
  currentAgeYears: number; // Años transcurridos o proyectados (0 a N)
  fasecoldaCode?: string; // Código de vehículo en base Fasecolda/SIC
  
  // Parámetros económicos y devaluación
  firstYearDropPct: number; // % Devaluación primer año (shock de concesionario, ej: 18%)
  annualDepreciationRatePct: number; // % Tasa anual de decaimiento post-año 1 (ej: 10%)
  lambdaRate?: number; // Tasa continua instantánea λ (manual o calculada: -ln(1 - d))
  salvageValuePct: number; // Valor residual de salvamento (ej: 15%)
  
  // Factores de desgaste
  annualMileageKm: number; // Km promedio al año (referencia estándar: 15,000 km)
  maintenance: MaintenanceCondition;
  usageType: UsageType;
  accidentHistory: AccidentHistory;
  fuelType: FuelType;
  
  // Parámetros de administración y TCO
  annualInsuranceCost: number; // Seguro todo riesgo anual
  annualTaxCost: number; // Impuesto de vehículos anual
  annualMaintenanceBaseCost: number; // Mantenimiento preventivo anual base
  maintenanceInflationRatePct: number; // Incremento anual por envejecimiento mecánico (ej: 12% anual)
  fuelCostPerKm: number; // Costo de combustible/energía por km
  expectedInflationPct: number; // Tasa de inflación anual esperada para valores reales
  corporateTaxShieldPct: number; // Escudo fiscal deducible (ej: 35% en personas jurídicas)
}

export interface YearProjection {
  year: number;
  nominalPrice: number;
  realPriceDeflated: number; // Ajustado por inflación
  accumulatedDepreciationVal: number; // Pérdida de capital acumulada: V0 - Vt
  accumulatedDepreciationPct: number; // % pérdida de capital
  annualDepreciationVal: number; // Pérdida marginal de capital en el año t: V(t-1) - V(t)
  annualDepreciationPct: number;
  depreciationPerKm: number;
  monthlyDepreciationVal: number;
  
  // Costos operativos (OpEx) y TCO
  annualMaintenanceCost: number;
  annualOpEx: number; // OpEx puro: Mantenimiento + Seguro + Impuestos + Combustible
  annualOperatingCost: number; // Alias para compatibilidad: OpEx puro del año
  accumulatedOpEx: number; // Suma acumulada de OpEx hasta el año t
  accumulatedTCO: number; // TCO = (V0 - Vt) + accumulatedOpEx (Sin doble conteo de depreciación)
  averageAnnualCost: number; // Costo Medio Anual Terborgh = accumulatedTCO / t
  accountingBookValue: number; // Valor en libros NIIF NIC 16
  taxShieldSavings: number; // Ahorro por deducción fiscal
  
  // Métricas de desgaste
  wearFactor: number;
  accumulatedMileage: number;
}

export interface VehicleAnalysisResult {
  vehicle: VehicleParameters;
  currentEstimatedValue: number;
  targetYearEstimatedValue: number;
  projections: YearProjection[];
  optimalReplacementYear: number; // Año óptimo de reemplazo (Mínimo de la Curva de Terborgh)
  totalDepreciationAtTargetYear: number;
  totalTCOAtTargetYear: number;
  effectiveAnnualDecayRatePct: number;
  salvageValue: number;
  combinedWearMultiplier: number;
  isFasecoldaMatched: boolean;
  breakdown: {
    mileagePenaltyPct: number;
    maintenanceFactor: number;
    usageFactor: number;
    accidentFactor: number;
    fuelTechFactor: number;
  };
}

export interface OfficialSicFasecoldaVehicle {
  code: string;
  brand: string;
  line: string;
  category: 'Sedán' | 'Hatchback' | 'SUV Compacta' | 'SUV Mediana' | 'Camioneta Pick-Up' | 'Utilitario' | 'Premium' | 'Eléctrico/Híbrido';
  fuelType: FuelType;
  referencePriceNew: number; // Precio nuevo promedio 2025-2026
  historicalRetentionPct: number[]; // % retención histórica años 1 a 10 según guía Fasecolda
  typicalAnnualDecayPct: number;
  marketLiquidityScore: 'Alta' | 'Media' | 'Baja';
  reliabilityScore: number; // 1 a 10
  commercialRank?: number; // 1 a 100 ranking de rotación comercial en Colombia (menor número = mayor rotación)
  resaleDaysAverage?: number; // Días promedio en vitrina/portal antes de reventa (ej: 14 días)
  whyRecommended?: string; // Justificación detallada comercial y actuarial
  pros?: string[]; // Puntos destacados de valor comercial
  targetAudience?: string; // Perfil idóneo de comprador
}
