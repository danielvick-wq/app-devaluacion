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
  // Penalización progresiva: -1.2% de valor por cada 1,500 km sobre el estándar, o bonificación hasta +8% si está guardado
  let kmMultiplier = 1.0 - (kmDiff / 15000) * 0.12;
  kmMultiplier = Math.min(Math.max(kmMultiplier, 0.72), 1.08); // Clamped [72%, 108%]
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

  // 3. Factor de Uso / Destino
  let usageFactor = 1.0;
  switch (v.usageType) {
    case 'particular': usageFactor = 1.00; break;
    case 'corporativo': usageFactor = 0.94; break;
    case 'carga_comercial': usageFactor = 0.86; break;
    case 'plataforma_taxi': usageFactor = 0.75; break;
    default: usageFactor = 1.00; break;
  }

  // 4. Factor de Siniestralidad
  let accidentFactor = 1.0;
  switch (v.accidentHistory) {
    case 'sin_siniestros': accidentFactor = 1.00; break;
    case 'estetico_menor': accidentFactor = 0.94; break;
    case 'medio_reparado': accidentFactor = 0.83; break;
    case 'estructural_severo': accidentFactor = 0.65; break;
    default: accidentFactor = 1.00; break;
  }

  // 5. Factor de Tecnología / Motorización
  let fuelTechFactor = 1.0;
  switch (v.fuelType) {
    case 'gasolina': fuelTechFactor = 1.00; break;
    case 'diesel': fuelTechFactor = 1.02; break; // Alta durabilidad
    case 'hibrido': fuelTechFactor = 1.03; break; // Exención pico y placa y alta demanda
    case 'electrico': fuelTechFactor = 0.96; break; // Obsolescencia tecnológica y degradación de celdas
    default: fuelTechFactor = 1.00; break;
  }

  const combinedMultiplier = kmMultiplier * maintenanceFactor * usageFactor * accidentFactor * fuelTechFactor;

  return {
    combinedMultiplier: Number(combinedMultiplier.toFixed(4)),
    mileagePenaltyPct,
    maintenanceFactor,
    usageFactor,
    accidentFactor,
    fuelTechFactor
  };
}

/**
 * Busca de forma segura un vehículo en la base oficial Fasecolda / SIC
 */
export function findFasecoldaVehicle(v: VehicleParameters): OfficialSicFasecoldaVehicle | undefined {
  if (v.fasecoldaCode) {
    const byCode = FASECOLDA_SIC_DATABASE.find(item => item.code === v.fasecoldaCode);
    if (byCode) return byCode;
  }

  const vBrand = (v.brand ?? '').toLowerCase().trim();
  const vLine = (v.line ?? '').toLowerCase().trim();
  if (!vBrand && !vLine) return undefined;

  return FASECOLDA_SIC_DATABASE.find(item => {
    const iBrand = item.brand.toLowerCase();
    const iLine = item.line.toLowerCase();
    const brandMatches = iBrand === vBrand || vBrand.includes(iBrand) || iBrand.includes(vBrand);
    const lineMatches = iLine.includes(vLine) || vLine.includes(iLine.split(' ')[0]);
    return brandMatches && lineMatches;
  });
}

/**
 * Resuelve el valor del vehículo en el año 't' según el modelo seleccionado
 */
export function calculateYearValue(
  v: VehicleParameters,
  t: number,
  model: ModelType,
  wearMultiplier: number
): { nominalValue: number; accountingBookValue: number; isFasecoldaMatched: boolean } {
  const V0 = Math.max(1000, v.initialPrice);
  const salvageValue = V0 * (Math.max(0, v.salvageValuePct) / 100);
  const usefulLife = 10; // Años vida útil contable NIC 16

  // 1. Valor en libros contable (Línea Recta NIIF)
  const annualStraightQuota = (V0 - salvageValue) / usefulLife;
  const accountingBookValue = Math.max(salvageValue, V0 - t * annualStraightQuota);

  if (t === 0) {
    return { nominalValue: V0, accountingBookValue: V0, isFasecoldaMatched: true };
  }

  let theoreticalValue = V0;
  let isFasecoldaMatched = true;

  switch (model) {
    case 'exponential_continuous': {
      // Ley de decaimiento continuo: V(t) = V0 * (1 - d1) * e^(-λ*(t-1)) para t >= 1
      const firstYearDrop = Math.max(0, Math.min(100, v.firstYearDropPct)) / 100;
      const annualRate = Math.max(0, Math.min(99, v.annualDepreciationRatePct)) / 100;
      const lambda = v.lambdaRate ?? -Math.log(Math.max(0.001, 1 - annualRate));

      if (t === 1) {
        theoreticalValue = V0 * (1 - firstYearDrop);
      } else {
        const v1 = V0 * (1 - firstYearDrop);
        theoreticalValue = v1 * Math.exp(-lambda * (t - 1));
      }
      break;
    }

    case 'exponential_discrete': {
      // Decaimiento discreto año a año
      const firstYearDrop = Math.max(0, Math.min(100, v.firstYearDropPct)) / 100;
      const annualRate = Math.max(0, Math.min(99, v.annualDepreciationRatePct)) / 100;
      if (t === 1) {
        theoreticalValue = V0 * (1 - firstYearDrop);
      } else {
        const v1 = V0 * (1 - firstYearDrop);
        theoreticalValue = v1 * Math.pow(1 - annualRate, t - 1);
      }
      break;
    }

    case 'accounting_straight': {
      theoreticalValue = accountingBookValue;
      break;
    }

    case 'accounting_declining': {
      // Doble saldo decreciente (DDB - Double Declining Balance)
      const ddbRate = 2 / usefulLife; // 20% anual sobre saldo
      let currentVal = V0;
      for (let i = 1; i <= t; i++) {
        currentVal = Math.max(salvageValue, currentVal * (1 - ddbRate));
      }
      theoreticalValue = currentVal;
      break;
    }

    case 'fasecolda_sic_table': {
      const matched = findFasecoldaVehicle(v);

      if (matched) {
        const retIndex = Math.min(t - 1, matched.historicalRetentionPct.length - 1);
        const retentionPct = matched.historicalRetentionPct[retIndex] / 100;
        
        if (t <= matched.historicalRetentionPct.length) {
          theoreticalValue = V0 * retentionPct;
        } else {
          const baseYear10 = V0 * (matched.historicalRetentionPct[matched.historicalRetentionPct.length - 1] / 100);
          const extraYears = t - matched.historicalRetentionPct.length;
          theoreticalValue = baseYear10 * Math.pow(1 - (matched.typicalAnnualDecayPct / 100), extraYears);
        }
      } else {
        // Fallback no destructivo: Si no existe en la base SIC, usar decaimiento compuesto
        isFasecoldaMatched = false;
        const firstYearDrop = Math.max(0, Math.min(100, v.firstYearDropPct)) / 100;
        const annualRate = Math.max(0, Math.min(99, v.annualDepreciationRatePct)) / 100;
        if (t === 1) {
          theoreticalValue = V0 * (1 - firstYearDrop);
        } else {
          const v1 = V0 * (1 - firstYearDrop);
          theoreticalValue = v1 * Math.pow(1 - annualRate, t - 1);
        }
      }
      break;
    }
  }

  // Modelos contables (NIC 16 y DDB) son determinísticos y NO deben ser multiplicados por factores de desgaste físico
  const isAccountingModel = model === 'accounting_straight' || model === 'accounting_declining';
  
  if (isAccountingModel) {
    return {
      nominalValue: Math.round(theoreticalValue),
      accountingBookValue: Math.round(accountingBookValue),
      isFasecoldaMatched
    };
  }

  // Para modelos económicos y de mercado:
  // Aplicamos el multiplicador de desgaste físico y operativo sobre el valor depreciado
  const ageImpactWeight = Math.min(1.0, 0.4 + 0.06 * t);
  const adjustedWearFactor = 1.0 + (wearMultiplier - 1.0) * ageImpactWeight;
  const adjustedValue = Math.max(salvageValue, theoreticalValue * adjustedWearFactor);

  return {
    nominalValue: Math.round(adjustedValue),
    accountingBookValue: Math.round(accountingBookValue),
    isFasecoldaMatched
  };
}

/**
 * Ejecuta el análisis completo y proyecciones a N años para un vehículo
 */
export function analyzeVehicleDepreciation(
  vehicle: VehicleParameters,
  maxProjectionYears: number = 10,
  selectedModel: ModelType = 'exponential_continuous'
): VehicleAnalysisResult {
  const breakdown = calculateWearBreakdown(vehicle);
  const wearMultiplier = breakdown.combinedMultiplier;
  const salvageValue = Math.round(vehicle.initialPrice * (vehicle.salvageValuePct / 100));

  const projections: YearProjection[] = [];
  let accumulatedOpEx = 0;
  let previousNominal = vehicle.initialPrice;
  let isFasecoldaMatched = true;

  // Calculamos proyecciones año a año desde año 1 hasta maxProjectionYears
  for (let t = 1; t <= maxProjectionYears; t++) {
    const yearVal = calculateYearValue(vehicle, t, selectedModel, wearMultiplier);
    const nominalValue = yearVal.nominalValue;
    const accountingBookValue = yearVal.accountingBookValue;
    if (!yearVal.isFasecoldaMatched) isFasecoldaMatched = false;
    
    // Pérdida de capital acumulada: V0 - Vt
    const accumulatedDepreciationVal = Math.max(0, vehicle.initialPrice - nominalValue);
    const accumulatedDepreciationPct = Number(((accumulatedDepreciationVal / vehicle.initialPrice) * 100).toFixed(2));
    
    // Pérdida de capital marginal del año t
    const annualDepreciationVal = Math.max(0, previousNominal - nominalValue);
    const annualDepreciationPct = previousNominal > 0 
      ? Number(((annualDepreciationVal / previousNominal) * 100).toFixed(2))
      : 0;
    previousNominal = nominalValue;

    // Ajuste por inflación para valor real deflactado
    const inflationFactor = Math.pow(1 + vehicle.expectedInflationPct / 100, t);
    const realPriceDeflated = Math.round(nominalValue / inflationFactor);

    // Métricas operativas y kilometraje
    const accumulatedMileage = vehicle.annualMileageKm * t;
    const depreciationPerKm = vehicle.annualMileageKm > 0 
      ? Number((annualDepreciationVal / vehicle.annualMileageKm).toFixed(2)) 
      : 0;
    const monthlyDepreciationVal = Math.round(annualDepreciationVal / 12);

    // Costos Operativos Puros del Año (OpEx)
    // El mantenimiento preventivo crece con el envejecimiento mecánico
    const annualMaintenanceCost = Math.round(
      vehicle.annualMaintenanceBaseCost * Math.pow(1 + vehicle.maintenanceInflationRatePct / 100, t - 1)
    );
    const annualFuelCost = Math.round(vehicle.annualMileageKm * vehicle.fuelCostPerKm);
    const annualTaxesAndInsurance = vehicle.annualInsuranceCost + vehicle.annualTaxCost;
    
    // OpEx puro anual (Sin incluir depreciación aquí para evitar doble conteo en TCO)
    const annualOpEx = annualMaintenanceCost + annualFuelCost + annualTaxesAndInsurance;
    accumulatedOpEx += annualOpEx;

    // Costo Total de Propiedad Acumulado (TCO):
    // TCO(t) = Pérdida Neta de Capital (V0 - Vt) + Gastos Operativos Acumulados
    const accumulatedTCO = accumulatedDepreciationVal + accumulatedOpEx;

    // Costo Medio Anual Acumulado (Modelo Terborgh):
    // AAC(t) = TCO(t) / t
    const averageAnnualCost = Number((accumulatedTCO / t).toFixed(2));

    // Escudo fiscal contable anual (Ahorro en impuesto de renta corporativo)
    const annualAccountingDeprec = t <= 5 ? (vehicle.initialPrice - salvageValue) / 5 : 0;
    const taxShieldSavings = Math.round(annualAccountingDeprec * (vehicle.corporateTaxShieldPct / 100));

    // Factor de desgaste dinámico año t
    const currentWearFactor = Number((wearMultiplier * (1 - 0.015 * t)).toFixed(3));

    projections.push({
      year: t,
      nominalPrice: nominalValue,
      realPriceDeflated,
      accumulatedDepreciationVal,
      accumulatedDepreciationPct,
      annualDepreciationVal,
      annualDepreciationPct,
      depreciationPerKm,
      monthlyDepreciationVal,
      annualMaintenanceCost,
      annualOpEx,
      annualOperatingCost: annualOpEx, // Compatibilidad
      accumulatedOpEx,
      accumulatedTCO,
      averageAnnualCost,
      accountingBookValue,
      taxShieldSavings,
      wearFactor: currentWearFactor,
      accumulatedMileage
    });
  }

  // Determinación Rigurosa del Año Óptimo de Reemplazo (Curva de Terborgh / Asset Replacement Model)
  // El año donde el Costo Medio Anual Acumulado (AAC = accumulatedTCO / t) alcanza su mínimo estricto
  let optimalReplacementYear = 5;
  let minAverageAnnualCost = Infinity;

  projections.forEach((proj) => {
    if (proj.averageAnnualCost < minAverageAnnualCost) {
      minAverageAnnualCost = proj.averageAnnualCost;
      optimalReplacementYear = proj.year;
    }
  });

  // Manejo de vehículo 0 km (currentAgeYears = 0)
  const userAge = vehicle.currentAgeYears ?? 5;
  let currentEstValue: number;
  let targetYearEstimatedValue: number;
  let totalDeprecAtTarget: number;
  let totalTCOAtTarget: number;

  if (userAge === 0) {
    currentEstValue = vehicle.initialPrice;
    targetYearEstimatedValue = vehicle.initialPrice;
    totalDeprecAtTarget = 0;
    totalTCOAtTarget = 0;
  } else {
    const targetIndex = Math.min(Math.max(1, userAge), maxProjectionYears) - 1;
    const targetYearProj = projections[targetIndex] ?? projections[0];
    currentEstValue = targetYearProj.nominalPrice;
    targetYearEstimatedValue = targetYearProj.nominalPrice;
    totalDeprecAtTarget = targetYearProj.accumulatedDepreciationVal;
    totalTCOAtTarget = targetYearProj.accumulatedTCO;
  }

  // Tasa efectiva anual de decaimiento compuesta
  const totalYears = maxProjectionYears;
  const lastNominal = projections[projections.length - 1]?.nominalPrice ?? vehicle.initialPrice;
  const effectiveAnnualDecayRatePct = Number(
    ((1 - Math.pow(Math.max(0.01, lastNominal) / vehicle.initialPrice, 1 / totalYears)) * 100).toFixed(2)
  );

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

/**
 * Formatea valores monetarios en moneda local (COP) o USD
 */
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

/**
 * Formatea números con separador de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}
