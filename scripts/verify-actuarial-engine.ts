import { analyzeVehicleDepreciation, calculateYearValue, findFasecoldaVehicle } from '../src/lib/depreciationEngine.ts';
import type { VehicleParameters } from '../src/types/vehicle.ts';

console.log('=== VERIFICACIÓN ACTUARIAL Y MATEMÁTICA DE AUTOVALUA PRO ===\n');

const testVehicle: VehicleParameters = {
  id: 'test-veh-01',
  name: 'Toyota Corolla Cross HEV',
  brand: 'Toyota',
  line: 'Corolla Cross HEV',
  modelYear: 2024,
  initialPrice: 135000000,
  currentAgeYears: 5,
  fasecoldaCode: 'FAS-TOY-COR-CRS',
  firstYearDropPct: 13.5,
  annualDepreciationRatePct: 8.5,
  salvageValuePct: 15,
  annualMileageKm: 15000,
  maintenance: 'excelente',
  usageType: 'particular',
  accidentHistory: 'sin_siniestros',
  fuelType: 'hibrido',
  annualInsuranceCost: 4320000,
  annualTaxCost: 4725000,
  annualMaintenanceBaseCost: 1400000,
  maintenanceInflationRatePct: 10,
  fuelCostPerKm: 310,
  expectedInflationPct: 5.5,
  corporateTaxShieldPct: 35
};

// Test 1: Verificación de Terborgh (Sin doble conteo)
console.log('1. Test: Verificación de Terborgh y TCO');
const analysis = analyzeVehicleDepreciation(testVehicle, 10, 'exponential_continuous');
const proj5 = analysis.projections[4]; // Año 5

console.log(`- Precio Inicial V0: $${testVehicle.initialPrice.toLocaleString()}`);
console.log(`- Valor Nominal Año 5: $${proj5.nominalPrice.toLocaleString()}`);
console.log(`- Depreciación Acumulada Año 5 (V0 - V5): $${proj5.accumulatedDepreciationVal.toLocaleString()}`);
console.log(`- OpEx Acumulado Año 5 (Manto + Seguros + Impuestos + Combustible): $${proj5.accumulatedOpEx.toLocaleString()}`);
console.log(`- TCO Acumulado Año 5: $${proj5.accumulatedTCO.toLocaleString()}`);
console.log(`- Costo Medio Anual Terborgh (TCO / 5): $${proj5.averageAnnualCost.toLocaleString()}`);

const expectedTCO = proj5.accumulatedDepreciationVal + proj5.accumulatedOpEx;
if (proj5.accumulatedTCO === expectedTCO) {
  console.log('✅ PASÓ: TCO acumulado suma exactamente (Pérdida de Capital + OpEx) sin duplicación.');
} else {
  console.error(`❌ ERROR: TCO ${proj5.accumulatedTCO} != ${expectedTCO}`);
  process.exit(1);
}

console.log(`- Año Óptimo de Reemplazo Calculado: Año ${analysis.optimalReplacementYear}`);

// Test 2: Vehículo 0 km (currentAgeYears = 0)
console.log('\n2. Test: Manejo de Vehículo Nuevo 0 km');
const newCarAnalysis = analyzeVehicleDepreciation({ ...testVehicle, currentAgeYears: 0 }, 10, 'exponential_continuous');
if (newCarAnalysis.currentEstimatedValue === testVehicle.initialPrice && newCarAnalysis.totalDepreciationAtTargetYear === 0) {
  console.log('✅ PASÓ: Vehículo 0 km conserva el 100% de valor sin devaluación anticipada.');
} else {
  console.error('❌ ERROR: Vehículo 0 km calculó depreciación errónea.');
  process.exit(1);
}

// Test 3: Modelos Contables NIIF (Aislamiento de factores de desgaste físico)
console.log('\n3. Test: Aislamiento de Modelos Contables NIC 16 (Línea Recta y DDB)');
const straightLineVal = calculateYearValue(testVehicle, 5, 'accounting_straight', 0.70); // Desgaste severo
const expectedStraight = 135000000 - 5 * ((135000000 - 135000000 * 0.15) / 10);
if (straightLineVal.nominalValue === expectedStraight) {
  console.log('✅ PASÓ: Línea Recta NIC 16 es puramente contable y no sufre alteración por desgaste de mercado.');
} else {
  console.error(`❌ ERROR: Valor libros contable ${straightLineVal.nominalValue} != ${expectedStraight}`);
  process.exit(1);
}

// Test 4: Base de Datos Fasecolda / SIC
console.log('\n4. Test: Búsqueda en Base Oficial Fasecolda');
const found = findFasecoldaVehicle(testVehicle);
if (found && found.code === 'FAS-TOY-COR-CRS') {
  console.log(`✅ PASÓ: Vehículo indexado correctamente en Fasecolda: ${found.brand} ${found.line}`);
} else {
  console.error('❌ ERROR: Vehículo no encontrado en base oficial.');
  process.exit(1);
}

console.log('\n🎉 TODAS LAS VERIFICACIONES ACTUARIALES Y DE CALIDAD HAN PASADO SATISFACTORIAMENTE.');
