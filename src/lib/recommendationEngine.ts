import type { 
  OfficialSicFasecoldaVehicle, 
  VehicleParameters, 
  VehicleAnalysisResult,
  FuelType 
} from '../types/vehicle';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';
import { analyzeVehicleDepreciation, formatCurrency } from './depreciationEngine';

export interface BudgetRecommendationParams {
  budget: number; // Monto en moneda seleccionada (COP o USD)
  currency: 'COP' | 'USD';
  tolerancePct?: number; // Ej: 0.15 para ±15%
  selectedCategory?: string; // 'all' o categoría específica
  selectedFuel?: string; // 'all' o fuelType
  priority?: 'commercial' | 'retention' | 'tco' | 'balanced'; // Criterio de orden
}

export interface RecommendedVehicleItem {
  officialVehicle: OfficialSicFasecoldaVehicle;
  vehicleParams: VehicleParameters;
  analysis: VehicleAnalysisResult;
  priceDiff: number; // referencePriceNew - budgetInCOP
  priceDiffPct: number;
  commercialScore: number; // 0 a 100
  retentionScore: number; // 0 a 100
  compositeScore: number; // 0 a 100
  badgeTag: string; // Ej: "🏆 Opción #1 Más Comercial de Colombia"
  segmentAvgDecayPct: number;
  annualSavingsVsSegment: number; // Dinero ahorrado al año por baja devaluación
  whyRecommendedSummary: string;
  detailedWhy: {
    marketLiquidity: string;
    depreciationAdvantage: string;
    operatingCostAdvantage: string;
    resaleSecurity: string;
  };
}

export interface BudgetRecommendationResult {
  budgetInCOP: number;
  budgetFormatted: string;
  currency: 'COP' | 'USD';
  rangeMin: number;
  rangeMax: number;
  tolerancePct: number;
  totalMatches: number;
  primaryRecommendation: RecommendedVehicleItem | null;
  alternativeRecommendations: RecommendedVehicleItem[];
  allCandidates: RecommendedVehicleItem[];
}

export const COP_USD_RATE = 4150; // Tipo de cambio de referencia comercial

/**
 * Convierte montos entre COP y USD
 */
export function convertToCOP(amount: number, currency: 'COP' | 'USD'): number {
  if (currency === 'USD') {
    return Math.round(amount * COP_USD_RATE);
  }
  return amount;
}

export function convertFromCOP(amountInCOP: number, currency: 'COP' | 'USD'): number {
  if (currency === 'USD') {
    return Math.round(amountInCOP / COP_USD_RATE);
  }
  return amountInCOP;
}

/**
 * Estimador de parámetros operativos (seguros, impuestos, combustible, mantenimiento)
 * adaptado a la economía colombiana y categoría del vehículo
 */
export function buildOperationalParameters(
  price: number,
  fuelType: FuelType,
  category: string
): {
  annualInsuranceCost: number;
  annualTaxCost: number;
  annualMaintenanceBaseCost: number;
  maintenanceInflationRatePct: number;
  fuelCostPerKm: number;
} {
  // Seguro todo riesgo anual promedio (~2.8% a 3.5% del valor comercial)
  const annualInsuranceCost = Math.round(price * 0.031);

  // Impuesto sobre vehículos automotores (Resolución MinHacienda / DIAN)
  // Rangos: hasta $54M: 1.5%, $54M a $121M: 2.5%, más de $121M: 3.5%
  let taxRate = 0.015;
  if (price > 121000000) taxRate = 0.035;
  else if (price > 54000000) taxRate = 0.025;
  const annualTaxCost = Math.round(price * taxRate);

  // Mantenimiento preventivo base
  let maintBase = 1350000;
  let maintInflation = 10;
  if (category === 'Premium') {
    maintBase = 4600000;
    maintInflation = 16;
  } else if (category === 'Camioneta Pick-Up') {
    maintBase = 2200000;
    maintInflation = 11;
  } else if (category === 'SUV Mediana') {
    maintBase = 2100000;
    maintInflation = 11;
  } else if (category === 'Hatchback') {
    maintBase = 1100000;
    maintInflation = 9;
  }

  // Costo de combustible por km (estimación Colombia 2024-2026)
  let fuelPerKm = 440; // Gasolina promedio (~$15.800/galón, 36 km/galón)
  if (fuelType === 'electrico') fuelPerKm = 65; // Carga residencial (~$850/kWh)
  else if (fuelType === 'hibrido') fuelPerKm = 270; // Alta eficiencia (60-75 km/galón)
  else if (fuelType === 'diesel') fuelPerKm = 360; // ACPM

  return {
    annualInsuranceCost,
    annualTaxCost,
    annualMaintenanceBaseCost: maintBase,
    maintenanceInflationRatePct: maintInflation,
    fuelCostPerKm: fuelPerKm
  };
}

/**
 * Convierte un OfficialSicFasecoldaVehicle a VehicleParameters completo
 */
export function convertOfficialToVehicleParameters(
  official: OfficialSicFasecoldaVehicle,
  customInitialPrice?: number
): VehicleParameters {
  const price = customInitialPrice ?? official.referencePriceNew;
  const ops = buildOperationalParameters(price, official.fuelType, official.category);
  const firstYearDrop = Number((100 - official.historicalRetentionPct[0]).toFixed(1));

  return {
    id: `veh-rec-${official.code.toLowerCase()}`,
    name: `${official.brand} ${official.line}`,
    brand: official.brand,
    line: official.line,
    modelYear: 2025,
    initialPrice: price,
    currentAgeYears: 5,
    fasecoldaCode: official.code,
    firstYearDropPct: firstYearDrop,
    annualDepreciationRatePct: official.typicalAnnualDecayPct,
    salvageValuePct: official.category === 'Premium' ? 12 : 16,
    annualMileageKm: 15000,
    maintenance: 'bueno',
    usageType: 'particular',
    accidentHistory: 'sin_siniestros',
    fuelType: official.fuelType,
    expectedInflationPct: 5.5,
    corporateTaxShieldPct: 35,
    ...ops
  };
}

/**
 * Calcula la tasa promedio de devaluación del segmento
 */
function getSegmentAverageDecay(category: string): number {
  switch (category) {
    case 'Hatchback': return 11.2;
    case 'Sedán': return 11.4;
    case 'SUV Compacta': return 10.8;
    case 'SUV Mediana': return 11.2;
    case 'Camioneta Pick-Up': return 9.2;
    case 'Eléctrico/Híbrido': return 11.0;
    case 'Premium': return 15.6;
    case 'Utilitario': return 13.0;
    default: return 11.5;
  }
}

/**
 * Motor Principal de Recomendación por Presupuesto
 * Busca los autos más comerciales en el rango de precio, calcula su devaluación completa
 * y fundamenta por qué se recomiendan.
 */
export function getBudgetRecommendations(params: BudgetRecommendationParams): BudgetRecommendationResult {
  const {
    budget,
    currency,
    tolerancePct = 0.15,
    selectedCategory = 'all',
    selectedFuel = 'all',
    priority = 'commercial'
  } = params;

  const budgetInCOP = convertToCOP(budget, currency);
  let effectiveTolerance = Math.max(0.05, Math.min(0.40, tolerancePct));
  
  let rangeMin = Math.round(budgetInCOP * (1 - effectiveTolerance));
  let rangeMax = Math.round(budgetInCOP * (1 + effectiveTolerance));

  // Filtrado preliminar por categoría y combustible
  const filterBySpec = (item: OfficialSicFasecoldaVehicle) => {
    const categoryMatches = selectedCategory === 'all' || item.category === selectedCategory;
    const fuelMatches = selectedFuel === 'all' || item.fuelType === selectedFuel;
    return categoryMatches && fuelMatches;
  };

  let matchingVehicles = FASECOLDA_SIC_DATABASE.filter(item => {
    return filterBySpec(item) && item.referencePriceNew >= rangeMin && item.referencePriceNew <= rangeMax;
  });

  // Si no hay suficientes coincidencias en el rango estricto, ampliamos tolerancia de forma segura
  if (matchingVehicles.length < 3) {
    effectiveTolerance = 0.28;
    rangeMin = Math.round(budgetInCOP * (1 - effectiveTolerance));
    rangeMax = Math.round(budgetInCOP * (1 + effectiveTolerance));
    
    matchingVehicles = FASECOLDA_SIC_DATABASE.filter(item => {
      return filterBySpec(item) && item.referencePriceNew >= rangeMin && item.referencePriceNew <= rangeMax;
    });
  }

  // Si aún así no hay, traemos los más cercanos al presupuesto
  if (matchingVehicles.length === 0) {
    const sortedByDistance = [...FASECOLDA_SIC_DATABASE]
      .filter(filterBySpec)
      .sort((a, b) => Math.abs(a.referencePriceNew - budgetInCOP) - Math.abs(b.referencePriceNew - budgetInCOP));
    matchingVehicles = sortedByDistance.slice(0, 4);
    if (matchingVehicles.length > 0) {
      rangeMin = Math.min(...matchingVehicles.map(m => m.referencePriceNew));
      rangeMax = Math.max(...matchingVehicles.map(m => m.referencePriceNew));
    }
  }

  // Evaluamos cada vehículo con el motor de análisis actuarial y puntuamos
  const evaluatedItems: RecommendedVehicleItem[] = matchingVehicles.map(official => {
    const vehicleParams = convertOfficialToVehicleParameters(official);
    const analysis = analyzeVehicleDepreciation(vehicleParams, 10, 'exponential_continuous');

    const priceDiff = official.referencePriceNew - budgetInCOP;
    const priceDiffPct = Number(((priceDiff / budgetInCOP) * 100).toFixed(1));

    // 1. Puntaje de Liquidez Comercial (0 - 100)
    let liquidityBase = 50;
    if (official.marketLiquidityScore === 'Alta') liquidityBase = 90;
    else if (official.marketLiquidityScore === 'Media') liquidityBase = 65;
    else liquidityBase = 40;

    const rankBonus = official.commercialRank ? Math.max(0, (25 - official.commercialRank) * 2.5) : 10;
    const daysFactor = official.resaleDaysAverage ? Math.max(0, (40 - official.resaleDaysAverage) * 1.5) : 10;
    const commercialScore = Math.min(100, Math.round(liquidityBase * 0.6 + rankBonus + daysFactor));

    // 2. Puntaje de Retención de Valor / Devaluación (0 - 100)
    // Menor decay anual = mayor retención
    const decayScore = Math.max(10, Math.min(100, Math.round((20 - official.typicalAnnualDecayPct) * 6.5)));
    const ret5Year = official.historicalRetentionPct[4] ?? 50;
    const retentionScore = Math.min(100, Math.round(decayScore * 0.5 + ret5Year * 0.5));

    // 3. Puntuación de Confiabilidad y Proximidad
    const relScore = (official.reliabilityScore / 10) * 100;
    const proximityScore = Math.max(0, 100 - Math.abs(priceDiffPct) * 3);

    // 4. Ponderación Compuesta según prioridad
    let compositeScore = 0;
    if (priority === 'commercial') {
      compositeScore = commercialScore * 0.45 + retentionScore * 0.30 + relScore * 0.15 + proximityScore * 0.10;
    } else if (priority === 'retention') {
      compositeScore = retentionScore * 0.50 + commercialScore * 0.25 + relScore * 0.15 + proximityScore * 0.10;
    } else if (priority === 'tco') {
      const isEfficient = official.fuelType === 'hibrido' || official.fuelType === 'electrico' ? 95 : 70;
      compositeScore = isEfficient * 0.40 + retentionScore * 0.30 + commercialScore * 0.20 + proximityScore * 0.10;
    } else {
      // Balanceado
      compositeScore = commercialScore * 0.35 + retentionScore * 0.35 + relScore * 0.20 + proximityScore * 0.10;
    }
    compositeScore = Math.round(compositeScore);

    // Comparativa de Devaluación vs Promedio de Segmento
    const segmentAvgDecayPct = getSegmentAverageDecay(official.category);
    const decayDiffPct = segmentAvgDecayPct - official.typicalAnnualDecayPct;
    const annualSavingsVsSegment = Math.round(official.referencePriceNew * (decayDiffPct / 100));

    // Badge inteligente
    let badgeTag = 'Recomendado Comercial';
    if (official.commercialRank && official.commercialRank <= 3) {
      badgeTag = '🏆 Top 3 Más Comercial de Colombia';
    } else if (official.typicalAnnualDecayPct <= 8.5) {
      badgeTag = '💎 Máxima Retención de Capital';
    } else if (official.fuelType === 'hibrido' || official.fuelType === 'electrico') {
      badgeTag = '⚡ Libre de Pico y Placa & Menor TCO';
    } else if (official.marketLiquidityScore === 'Alta') {
      badgeTag = '🔥 Alta Liquidez y Reventa Rápida';
    }

    const whySummary = official.whyRecommended || 
      `${official.brand} ${official.line} es uno de los vehículos con mejor rotación en su rango de precio ($${formatCurrency(official.referencePriceNew, 'COP')}), destacando por su sólida retención de valor a 5 años y amplia red de servicio.`;

    const detailedWhy = {
      marketLiquidity: official.marketLiquidityScore === 'Alta'
        ? `Alta liquidez en mercado de usados con un tiempo estimado de venta de solo ~${official.resaleDaysAverage ?? 18} días. Es un modelo con alta demanda en portales como TuCarro y concesionarios multimarca.`
        : `Liquidez moderada (~${official.resaleDaysAverage ?? 32} días en vitrina). Cuenta con un nicho leal de compradores dispuestos a pagar por su tecnología y confort.`,
      depreciationAdvantage: decayDiffPct > 0
        ? `Se devalúa solo un ${official.typicalAnnualDecayPct}% anual en promedio, superando al promedio de su segmento (${segmentAvgDecayPct}% anual). Esto representa un ahorro estimado de aprox. ${formatCurrency(annualSavingsVsSegment, currency)} al año en conservación patrimonial.`
        : `Tiene una tasa de devaluación anual del ${official.typicalAnnualDecayPct}%, típica de su segmento, con una retención proyectada del ${official.historicalRetentionPct[2]}% al tercer año.`,
      operatingCostAdvantage: official.fuelType === 'hibrido' || official.fuelType === 'electrico'
        ? `Costo operativo ultrabajo gracias a su motorización ${official.fuelType}. Además de exención tributaria y de Pico y Placa, el costo por kilómetro en combustible es significativamente menor al promedio de gasolina.`
        : `Costos de mantenimiento y repuestos altamente predecibles y estandarizados. Amplia disponibilidad de autopartes originales y homologadas en todo el territorio colombiano.`,
      resaleSecurity: `Puntuación de confiabilidad mecánica de ${official.reliabilityScore}/10 según registros de taller y baremo Fasecolda. Gran facilidad de peritaje y traspaso rápido sin trabas administrativas.`
    };

    return {
      officialVehicle: official,
      vehicleParams,
      analysis,
      priceDiff,
      priceDiffPct,
      commercialScore,
      retentionScore,
      compositeScore,
      badgeTag,
      segmentAvgDecayPct,
      annualSavingsVsSegment,
      whyRecommendedSummary: whySummary,
      detailedWhy
    };
  });

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
