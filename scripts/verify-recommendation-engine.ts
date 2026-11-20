import { getBudgetRecommendations } from '../src/lib/recommendationEngine.ts';
import { FASECOLDA_SIC_DATABASE } from '../src/data/sicFasecoldaData.ts';

console.log('=== TEST DE MOTOR DE RECOMENDACIÓN POR PRESUPUESTO ===\n');

console.log(`Total de vehículos en base de datos robusta: ${FASECOLDA_SIC_DATABASE.length}`);
if (FASECOLDA_SIC_DATABASE.length < 35) {
  console.error('❌ Base de datos insuficiente.');
  process.exit(1);
}
console.log('✅ Base de datos robusta cargada correctamente.\n');

const testBudgets = [
  { budget: 65000000, label: '$65M (Entrada/Urbano)' },
  { budget: 95000000, label: '$95M (Gama Media/Crossover)' },
  { budget: 125000000, label: '$125M (SUV Compacta Top)' },
  { budget: 180000000, label: '$180M (SUV Mediana/Híbrida)' },
  { budget: 245000000, label: '$245M (Pick-Up 4x4 Diésel)' },
  { budget: 390000000, label: '$390M (Gama Alta/Campero)' }
];

testBudgets.forEach(t => {
  console.log(`--- Probando presupuesto: ${t.label} ---`);
  const result = getBudgetRecommendations({
    budget: t.budget,
    currency: 'COP',
    tolerancePct: 0.15,
    priority: 'commercial'
  });

  if (!result.primaryRecommendation) {
    console.error(`❌ No se encontró recomendación para presupuesto ${t.label}`);
    process.exit(1);
  }

  const rec = result.primaryRecommendation;
  console.log(`  ⭐ Recomendado #1: ${rec.officialVehicle.brand} ${rec.officialVehicle.line}`);
  console.log(`  💵 Precio Referencia: $${rec.officialVehicle.referencePriceNew.toLocaleString()}`);
  console.log(`  🔥 Liquidez: ${rec.officialVehicle.marketLiquidityScore} (Puesto Comercial #${rec.officialVehicle.commercialRank})`);
  console.log(`  📉 Devaluación Anual: ${rec.officialVehicle.typicalAnnualDecayPct}% (Retención 3a: ${rec.officialVehicle.historicalRetentionPct[2]}%)`);
  console.log(`  💡 ¿Por qué?: ${rec.whyRecommendedSummary.substring(0, 110)}...`);
  console.log(`  👥 Alternativas encontradas: ${result.alternativeRecommendations.length}`);
  console.log('  ✅ OK\n');
});

console.log('🎉 TODOS LOS TESTS DE RECOMENDACIÓN POR PRESUPUESTO PASARON EXITOSAMENTE.');
