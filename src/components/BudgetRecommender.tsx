import React, { useState, useId } from 'react';
import type { OfficialSicFasecoldaVehicle, VehicleParameters } from '../types/vehicle';
import { 
  getBudgetRecommendations, 
  convertFromCOP 
} from '../lib/recommendationEngine';
import { formatCurrency } from '../lib/depreciationEngine';
import { 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Flame, 
  SlidersHorizontal,
  CheckCircle2,
  Wrench,
  Info
} from 'lucide-react';

interface BudgetRecommenderProps {
  onSelectVehicleForValuation: (v: OfficialSicFasecoldaVehicle) => void;
  onAddVehicleToComparison: (v: VehicleParameters) => void;
  currency: 'COP' | 'USD';
  initialBudget?: number;
}

const BUDGET_PRESETS_COP = [
  { label: '$55M', value: 55000000, desc: 'Económicos / Entrada' },
  { label: '$75M', value: 75000000, desc: 'Sedanes & Crossovers' },
  { label: '$95M', value: 95000000, desc: 'SUVs & Compactos' },
  { label: '$120M', value: 120000000, desc: 'SUVs Top Ventas' },
  { label: '$140M', value: 140000000, desc: 'Híbridos Líderes' },
  { label: '$175M', value: 175000000, desc: 'SUVs Medianas / PHEV' },
  { label: '$240M', value: 240000000, desc: 'Pick-Ups 4x4 / Diésel' },
  { label: '$380M', value: 380000000, desc: 'Gama Alta / Blindaje' }
];

export const BudgetRecommender: React.FC<BudgetRecommenderProps> = ({
  onSelectVehicleForValuation,
  onAddVehicleToComparison,
  currency,
  initialBudget
}) => {
  const defaultBudget = initialBudget && initialBudget > 10000000 
    ? initialBudget 
    : 120000000;

  const [budgetValue, setBudgetValue] = useState<number>(defaultBudget);
  const [tolerancePct, setTolerancePct] = useState<number>(0.15);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [priority, setPriority] = useState<'commercial' | 'retention' | 'tco' | 'balanced'>('commercial');
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(3); // Año para inspeccionar devaluación

  const budgetInputId = useId();
  const categorySelectId = useId();
  const fuelSelectId = useId();

  // Ejecutamos el motor de recomendación inteligente
  const recommendation = getBudgetRecommendations({
    budget: budgetValue,
    currency,
    tolerancePct,
    selectedCategory,
    selectedFuel,
    priority
  });

  const primary = recommendation.primaryRecommendation;
  const alternatives = recommendation.alternativeRecommendations;

  const categories = [
    { id: 'all', label: 'Todas las categorías' },
    { id: 'SUV Compacta', label: 'SUV Compacta' },
    { id: 'SUV Mediana', label: 'SUV Mediana' },
    { id: 'Sedán', label: 'Sedán' },
    { id: 'Hatchback', label: 'Hatchback' },
    { id: 'Camioneta Pick-Up', label: 'Pick-Up 4x4' },
    { id: 'Eléctrico/Híbrido', label: 'Híbrido / Eléctrico' },
    { id: 'Premium', label: 'Premium / Lujo' }
  ];

  const handlePresetClick = (amountInCOP: number) => {
    const adjustedAmount = currency === 'USD' ? convertFromCOP(amountInCOP, 'USD') : amountInCOP;
    setBudgetValue(adjustedAmount);
  };

  const handleBudgetChange = (raw: string) => {
    const clean = raw.replace(/[^0-9]/g, '');
    const num = Number(clean);
    if (!Number.isNaN(num)) {
      setBudgetValue(num);
    }
  };

  // Cálculos de devaluación proyectada para el año objetivo seleccionado (1, 3 o 5 años)
  const targetProjection = primary?.analysis.projections.find(p => p.year === selectedTargetYear) ?? primary?.analysis.projections[2];

  return (
    <div className="space-y-6">
      
      {/* Banner Introductorio Institucional */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Asesor Inteligente de Compra por Presupuesto</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ACTUARIAL & MERCADO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ingresa tu presupuesto disponible: analizamos los vehículos más comerciales de Colombia, su curva de retención de valor y el menor costo de devaluación en plaza.
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Entrada de Presupuesto */}
        <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* Input Principal de Presupuesto */}
          <div className="lg:col-span-5 space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor={budgetInputId} className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>¿Cuánto deseas invertir? (Presupuesto {currency}):</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {formatCurrency(budgetValue, currency)}
              </span>
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-mono font-bold">$</span>
              <input
                id={budgetInputId}
                type="text"
                value={budgetValue ? budgetValue.toLocaleString('es-CO') : ''}
                onChange={(e) => handleBudgetChange(e.target.value)}
                placeholder="Ej: 120.000.000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>
          </div>

          {/* Selector de Tolerancia de Rango */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Tolerancia de Búsqueda:</span>
              <span className="font-mono text-cyan-400 font-bold">±{(tolerancePct * 100).toFixed(0)}%</span>
            </label>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[0.10, 0.15, 0.20, 0.25].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTolerancePct(t)}
                  className={`flex-1 py-1.5 rounded-lg text-center font-mono font-semibold transition-[transform,background-color,color] duration-100 active:scale-[0.96] ${
                    tolerancePct === t
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ±{(t * 100).toFixed(0)}%
                </button>
              ))}
            </div>
          </div>

          {/* Prioridad de Recomendación */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Priorizar Recomendación Por:
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setPriority('commercial')}
                className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                  priority === 'commercial' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Más Comercial
              </button>
              <button
                type="button"
                onClick={() => setPriority('retention')}
                className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                  priority === 'retention' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💎 Menor Devaluación
              </button>
            </div>
          </div>
        </div>

        {/* Presets Rápidos en Colombia */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Presupuestos Populares:</span>
          </span>
          {BUDGET_PRESETS_COP.map((preset) => {
            const isSelected = budgetValue === (currency === 'USD' ? convertFromCOP(preset.value, 'USD') : preset.value);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-[transform,background-color] duration-100 active:scale-[0.96] ${
                  isSelected 
                    ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
                title={preset.desc}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Filtros Opcionales de Categoría y Combustible */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Filtrar segmento:</span>
            <select
              id={categorySelectId}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Motorización:</span>
            <select
              id={fuelSelectId}
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todos los combustibles</option>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel (Pesado / 4x4)</option>
              <option value="hibrido">Híbrido (MHEV / HEV / PHEV)</option>
              <option value="electrico">100% Eléctrico (BEV)</option>
            </select>
          </div>

          <div className="ml-auto text-[11px] font-mono text-slate-400">
            Buscando entre <span className="text-slate-200 font-bold">{formatCurrency(recommendation.rangeMin, currency)}</span> y <span className="text-slate-200 font-bold">{formatCurrency(recommendation.rangeMax, currency)}</span> ({recommendation.totalMatches} opciones analizadas)
          </div>
        </div>
      </div>

      {/* Si no hay coincidencia */}
      {!primary && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Info className="h-8 w-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No encontramos vehículos en ese rango específico</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Prueba aumentando la tolerancia de búsqueda o cambiando el filtro de carrocería o combustible.
          </p>
        </div>
      )}

      {/* TARJETA PRINCIPAL: RECOMENDACIÓN #1 MÁS COMERCIAL */}
      {primary && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
          
          {/* Header de la Tarjeta Recomendada */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{primary.badgeTag}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {primary.officialVehicle.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {primary.officialVehicle.fuelType}
                </span>
              </div>

              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  {primary.officialVehicle.brand} {primary.officialVehicle.line}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Código Oficial Fasecolda: <span className="text-slate-300">{primary.officialVehicle.code}</span> • Modelo 2025 (0 km ref.)
                </p>
              </div>
            </div>

            {/* Precio y Comparación vs Presupuesto */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-medium">Precio Oficial de Referencia:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                {formatCurrency(primary.officialVehicle.referencePriceNew, currency)}
              </span>
              <div className="text-[11px] font-mono pt-1">
                {primary.priceDiff === 0 ? (
                  <span className="text-slate-400">Coincide exactamente con tu presupuesto</span>
                ) : primary.priceDiff > 0 ? (
                  <span className="text-amber-400">
                    +{formatCurrency(primary.priceDiff, currency)} ({primary.priceDiffPct}% sobre tu presupuesto)
                  </span>
                ) : (
                  <span className="text-emerald-400">
                    -{formatCurrency(Math.abs(primary.priceDiff), currency)} (¡Te sobran {formatCurrency(Math.abs(primary.priceDiff), currency)}!)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: ¿POR QUÉ SE RECOMIENDA ESTE VEHÍCULO? (Justificación Detallada) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                ¿Por qué te recomendamos este carro para tu presupuesto?
              </h4>
            </div>

            {/* Resumen Comercial Oficial */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <p className="font-medium text-slate-200 mb-2">
                {primary.whyRecommendedSummary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                <div>
                  <strong className="text-slate-200 block mb-0.5">Perfil de Usuario Recomendado:</strong>
                  <span>{primary.officialVehicle.targetAudience ?? 'Ideal para uso familiar, viajes y personas que valoran tranquilidad financiera y reventa rápida.'}</span>
                </div>
                <div>
                  <strong className="text-slate-200 block mb-0.5">Velocidad de Reventa en Colombia:</strong>
                  <span>Se vende en un promedio récord de <strong className="text-emerald-400">~{primary.officialVehicle.resaleDaysAverage ?? 16} días</strong> en vitrina y portales especializados.</span>
                </div>
              </div>
            </div>

            {/* 4 Pilares de Justificación Técnica & Actuarial */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-bold text-slate-200 uppercase">1. Demanda Comercial</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {primary.detailedWhy.marketLiquidity}
                </p>
                <div className="pt-1 text-[10px] font-mono text-emerald-400 font-bold">
                  Liquidez: {primary.officialVehicle.marketLiquidityScore.toUpperCase()} (Puesto #{primary.officialVehicle.commercialRank ?? 1})
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-bold text-slate-200 uppercase">2. Menor Devaluación</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {primary.detailedWhy.depreciationAdvantage}
                </p>
                <div className="pt-1 text-[10px] font-mono text-cyan-400 font-bold">
                  Tasa Anual: {primary.officialVehicle.typicalAnnualDecayPct}% (Segmento: {primary.segmentAvgDecayPct}%)
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <Wrench className="h-4 w-4" />
                  <span className="text-xs font-bold text-slate-200 uppercase">3. Economía y Repuestos</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {primary.detailedWhy.operatingCostAdvantage}
                </p>
                <div className="pt-1 text-[10px] font-mono text-amber-400 font-bold">
                  Combustible: ${primary.vehicleParams.fuelCostPerKm} COP/km
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold text-slate-200 uppercase">4. Fiabilidad Mecánica</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {primary.detailedWhy.resaleSecurity}
                </p>
                <div className="pt-1 text-[10px] font-mono text-indigo-400 font-bold">
                  Confiabilidad: {primary.officialVehicle.reliabilityScore} / 10
                </div>
              </div>

            </div>

            {/* Pros Destacados en Viñetas */}
            {primary.officialVehicle.pros && primary.officialVehicle.pros.length > 0 && (
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-300">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Puntos Clave:</span>
                </span>
                {primary.officialVehicle.pros.map((pro, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="text-emerald-400">•</span>
                    <span>{pro}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: ANÁLISIS COMPLETO DE DEVALUACIÓN Y COSTOS OPERATIVOS */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                  Análisis Actuarial de Devaluación y Costos (TCO)
                </h4>
              </div>

              {/* Selector de Horizonte para la proyección: 1, 2, 3 o 5 años */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Inspeccionar al:</span>
                <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
                  {[1, 2, 3, 5, 10].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setSelectedTargetYear(yr)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        selectedTargetYear === yr
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Año {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* KPIs de Devaluación para el año seleccionado */}
            {targetProjection && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Valor en Año {selectedTargetYear}</span>
                  <span className="text-sm font-black text-slate-100 font-mono block">
                    {formatCurrency(targetProjection.nominalPrice, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {(100 - targetProjection.accumulatedDepreciationPct).toFixed(1)}% retenido
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Pérdida de Capital</span>
                  <span className="text-sm font-black text-rose-400 font-mono block">
                    -{formatCurrency(targetProjection.accumulatedDepreciationVal, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-rose-400/80">
                    -{targetProjection.accumulatedDepreciationPct}% acumulado
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Costo Pérdida / km</span>
                  <span className="text-sm font-black text-amber-400 font-mono block">
                    ${targetProjection.depreciationPerKm.toLocaleString('es-CO')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currency}/km recorrido
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Pérdida Mensual</span>
                  <span className="text-sm font-black text-slate-200 font-mono block">
                    {formatCurrency(targetProjection.monthlyDepreciationVal, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Por cada 30 días
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">TCO Acumulado</span>
                  <span className="text-sm font-black text-cyan-400 font-mono block">
                    {formatCurrency(targetProjection.accumulatedTCO, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Deprec. + OpEx {selectedTargetYear}a
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Año Óptimo Venta</span>
                  <span className="text-sm font-black text-emerald-400 font-mono block">
                    Año {primary.analysis.optimalReplacementYear}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Curva Terborgh
                  </span>
                </div>

              </div>
            )}

            {/* Matriz de Retención Histórica Fasecolda (Años 1 al 10) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Retención Histórica de Capital (% y valor en dinero según Baremo Oficial):
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center font-mono">
                {primary.officialVehicle.historicalRetentionPct.map((pct, idx) => {
                  const yr = idx + 1;
                  const estimatedVal = Math.round(primary.officialVehicle.referencePriceNew * (pct / 100));
                  const isCurrentTarget = yr === selectedTargetYear;
                  return (
                    <div 
                      key={yr}
                      onClick={() => setSelectedTargetYear(yr)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        isCurrentTarget
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] text-slate-500 block uppercase">Año {yr}</span>
                      <span className="text-xs font-bold block">{pct}%</span>
                      <span className="text-[9px] text-slate-400 truncate block">
                        ${(convertFromCOP(estimatedVal, currency) / 1000000).toFixed(0)}M
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN PRINCIPALES */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onSelectVehicleForValuation(primary.officialVehicle)}
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 active:scale-[0.98] shadow-lg shadow-emerald-950/40"
            >
              <Sparkles className="h-4 w-4" />
              <span>⚡ Cargar en el Valuador Actuarial Completo</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => onAddVehicleToComparison(primary.vehicleParams)}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 active:scale-[0.98]"
            >
              <span>➕ Añadir al Comparador Multi-Vehículo</span>
            </button>
          </div>

        </div>
      )}

      {/* SECCIÓN 3: OTRAS ALTERNATIVAS COMERCIALES EN ESTE MISMO RANGO */}
      {alternatives.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Otras opciones destacadas en tu rango de presupuesto
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {alternatives.length} alternativas evaluadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <div 
                key={alt.officialVehicle.code}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 pb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {alt.officialVehicle.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {alt.officialVehicle.typicalAnnualDecayPct}% deval. anual
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-100 pt-1">
                    {alt.officialVehicle.brand} {alt.officialVehicle.line}
                  </h5>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {formatCurrency(alt.officialVehicle.referencePriceNew, currency)}
                  </p>

                  <p className="text-xs text-slate-400 pt-2 line-clamp-3 leading-relaxed">
                    {alt.whyRecommendedSummary}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Reventa: ~{alt.officialVehicle.resaleDaysAverage ?? 20} días</span>
                    <span className="text-emerald-400">Retención 3a: {alt.officialVehicle.historicalRetentionPct[2]}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectVehicleForValuation(alt.officialVehicle)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Valuar</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddVehicleToComparison(alt.vehicleParams)}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors"
                      title="Comparar este auto"
                    >
                      + Comparar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
