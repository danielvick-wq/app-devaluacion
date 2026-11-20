import React, { useState, useId } from 'react';
import type { VehicleParameters, ModelType, FuelType, MaintenanceCondition, UsageType, AccidentHistory } from '../types/vehicle';
import { analyzeVehicleDepreciation, formatCurrency, formatNumber } from '../lib/depreciationEngine';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';
import { MetricCard } from './MetricCard';
import { DepreciationChart } from './DepreciationChart';
import { TerborghChart } from './TerborghChart';
import { 
  DollarSign, 
  TrendingDown, 
  Gauge, 
  BarChart3, 
  Table, 
  Sparkles, 
  Info, 
  Clock, 
  Layers,
  AlertTriangle
} from 'lucide-react';

interface SingleVehicleCalculatorProps {
  vehicle: VehicleParameters;
  onUpdateVehicle: (v: VehicleParameters) => void;
  currency: 'COP' | 'USD';
  selectedModel: ModelType;
  onSelectModel: (m: ModelType) => void;
  projectionYears: number;
  onChangeProjectionYears: (y: number) => void;
  onAddVehicleToComparison: (v: VehicleParameters) => void;
  onOpenRecommender?: (budget: number) => void;
}

export const SingleVehicleCalculator: React.FC<SingleVehicleCalculatorProps> = ({
  vehicle,
  onUpdateVehicle,
  currency,
  selectedModel,
  onSelectModel,
  projectionYears,
  onChangeProjectionYears,
  onAddVehicleToComparison,
  onOpenRecommender
}) => {
  const [activeView, setActiveView] = useState<'chart_decay' | 'chart_terborgh' | 'table_data'>('chart_decay');
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  const vehiclePresetSelectId = useId();
  const vehicleBrandInputId = useId();
  const vehicleLineInputId = useId();
  const vehicleModelYearInputId = useId();
  const vehicleInitialPriceInputId = useId();
  const vehicleFuelTypeSelectId = useId();
  const vehicleFirstYearDropInputId = useId();
  const vehicleAnnualDeprecInputId = useId();
  const vehicleSalvagePctInputId = useId();
  const vehicleMileageRangeId = useId();
  const vehicleMaintenanceSelectId = useId();
  const vehicleUsageTypeSelectId = useId();
  const vehicleAccidentHistorySelectId = useId();
  const vehicleAnnualInsuranceInputId = useId();
  const vehicleAnnualTaxInputId = useId();
  const vehicleMantoBaseInputId = useId();
  const vehicleMantoInflationInputId = useId();
  const vehicleFuelPerKmInputId = useId();
  const vehicleInflationPctInputId = useId();
  const vehicleTaxShieldPctInputId = useId();
  const vehicleCurrentAgeRangeId = useId();

  // Ejecutamos el análisis con el motor matemático
  const analysis = analyzeVehicleDepreciation(vehicle, projectionYears, selectedModel);
  const userAge = vehicle.currentAgeYears ?? 5;
  const isZeroKm = userAge === 0;
  const targetYear = isZeroKm ? 0 : Math.min(Math.max(1, userAge), projectionYears);

  const targetProj = !isZeroKm
    ? (analysis.projections.find(p => p.year === targetYear) ?? analysis.projections[0])
    : {
        year: 0,
        nominalPrice: vehicle.initialPrice,
        realPriceDeflated: vehicle.initialPrice,
        accumulatedDepreciationVal: 0,
        accumulatedDepreciationPct: 0,
        annualDepreciationVal: 0,
        annualDepreciationPct: 0,
        depreciationPerKm: 0,
        monthlyDepreciationVal: 0,
        annualMaintenanceCost: 0,
        annualOpEx: 0,
        annualOperatingCost: 0,
        accumulatedOpEx: 0,
        accumulatedTCO: 0,
        averageAnnualCost: 0,
        accountingBookValue: vehicle.initialPrice,
        taxShieldSavings: 0,
        wearFactor: 1.0,
        accumulatedMileage: 0
      };

  // Cálculo de lambda equivalente continuo: λ = -ln(1 - d)
  const annualRate = vehicle.annualDepreciationRatePct / 100;
  const lambdaVal = (-Math.log(Math.max(0.01, 1 - annualRate))).toFixed(4);

  // Manejador seguro para inputs numéricos para evitar que borrar inserte números o genere NaN
  const updateNumericField = (field: keyof VehicleParameters, rawValue: string, fallback = 0) => {
    if (rawValue.trim() === '') {
      onUpdateVehicle({ ...vehicle, [field]: fallback });
      return;
    }
    const parsed = Number(rawValue);
    if (!Number.isNaN(parsed)) {
      onUpdateVehicle({ ...vehicle, [field]: parsed });
    }
  };

  const handlePresetSelect = (code: string) => {
    const preset = FASECOLDA_SIC_DATABASE.find(item => item.code === code);
    if (!preset) return;

    // Calcular costos operativos aproximados
    const price = preset.referencePriceNew;
    const annualInsuranceCost = Math.round(price * 0.032);
    let taxRate = 0.015;
    if (price > 121000000) taxRate = 0.035;
    else if (price > 54000000) taxRate = 0.025;
    const annualTaxCost = Math.round(price * taxRate);

    let maintBase = 1400000;
    if (preset.category === 'Premium') maintBase = 4500000;
    else if (preset.category === 'Camioneta Pick-Up' || preset.category === 'SUV Mediana') maintBase = 2200000;
    else if (preset.category === 'Hatchback') maintBase = 1100000;

    let fuelPerKm = 450;
    if (preset.fuelType === 'electrico') fuelPerKm = 160;
    else if (preset.fuelType === 'hibrido') fuelPerKm = 310;
    else if (preset.fuelType === 'diesel') fuelPerKm = 390;

    onUpdateVehicle({
      ...vehicle,
      name: `${preset.brand} ${preset.line}`,
      brand: preset.brand,
      line: preset.line,
      fasecoldaCode: preset.code,
      initialPrice: preset.referencePriceNew,
      fuelType: preset.fuelType,
      annualDepreciationRatePct: preset.typicalAnnualDecayPct,
      firstYearDropPct: Number((100 - preset.historicalRetentionPct[0]).toFixed(1)),
      annualInsuranceCost,
      annualTaxCost,
      annualMaintenanceBaseCost: maintBase,
      fuelCostPerKm: fuelPerKm
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Barra Superior de Control de Modelo y Preset */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label htmlFor={vehiclePresetSelectId} className="text-xs text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Plantilla Oficial Fasecolda / SIC:</span>
          </label>
          <select
            id={vehiclePresetSelectId}
            onChange={(e) => handlePresetSelect(e.target.value)}
            defaultValue=""
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 max-w-xs"
          >
            <option value="" disabled>Seleccionar vehículo de referencia oficial...</option>
            {FASECOLDA_SIC_DATABASE.map(item => (
              <option key={item.code} value={item.code}>
                {item.brand} {item.line} ({formatCurrency(item.referencePriceNew, currency)})
              </option>
            ))}
          </select>
        </div>

        {/* Selector de los 5 Modelos Matemáticos / Actuariales */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium">Modelo Teórico:</span>
          <div className="inline-flex flex-wrap rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => onSelectModel('exponential_continuous')}
              className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                selectedModel === 'exponential_continuous'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="V(t) = V0 * (1 - d1) * e^(-λ*(t-1)) decaimiento continuo"
            >
              Decaimiento Continuo (e^-λt)
            </button>
            <button
              onClick={() => onSelectModel('exponential_discrete')}
              className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                selectedModel === 'exponential_discrete'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="V(t) = V0 * (1 - d1) * (1 - d)^(t-1) discreto anual compuesto"
            >
              Discreto Compuesto ((1-d)^t)
            </button>
            <button
              onClick={() => onSelectModel('fasecolda_sic_table')}
              className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                selectedModel === 'fasecolda_sic_table'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablas empíricas oficiales Fasecolda"
            >
              Tabla Fasecolda
            </button>
            <button
              onClick={() => onSelectModel('accounting_straight')}
              className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                selectedModel === 'accounting_straight'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Línea Recta NIIF NIC 16 (Contable)"
            >
              Línea Recta NIC 16
            </button>
            <button
              onClick={() => onSelectModel('accounting_declining')}
              className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                selectedModel === 'accounting_declining'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Saldo Decreciente Doble (DDB) - Depreciación acelerada"
            >
              Doble Saldo DDB
            </button>
          </div>
        </div>
      </div>

      {/* Alerta si el modelo Fasecolda no coincide exactamente con la base */}
      {selectedModel === 'fasecolda_sic_table' && !analysis.isFasecoldaMatched && (
        <div className="bg-amber-950/30 border border-amber-600/50 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Aviso de Indexación SIC</strong>: La combinación de marca ({vehicle.brand}) y línea ({vehicle.line}) no se encuentra registrada de forma exacta en el baremo oficial de Fasecolda. Se aplicó la curva de decaimiento compuesta con base en sus parámetros declarados.
          </span>
        </div>
      )}

      {/* Grid Principal: Parámetros a la izquierda, Resultados/Dashboard a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA (5 cols): Panel de Configuración de Parámetros */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Identificación y Precio Base */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>1. Especificaciones del Automotor</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {vehicle.fuelType.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={vehicleBrandInputId} className="text-[11px] text-slate-400 font-medium block mb-1">Marca</label>
                <input
                  id={vehicleBrandInputId}
                  type="text"
                  value={vehicle.brand}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, brand: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor={vehicleLineInputId} className="text-[11px] text-slate-400 font-medium block mb-1">Línea / Versión</label>
                <input
                  id={vehicleLineInputId}
                  type="text"
                  value={vehicle.line}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, line: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor={vehicleModelYearInputId} className="text-[11px] text-slate-400 font-medium block mb-1">Año Modelo</label>
                <input
                  id={vehicleModelYearInputId}
                  type="number"
                  value={vehicle.modelYear || ''}
                  onChange={(e) => updateNumericField('modelYear', e.target.value, 2024)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label htmlFor={vehicleFuelTypeSelectId} className="text-[11px] text-slate-400 font-medium block mb-1">Motorización</label>
                <select
                  id={vehicleFuelTypeSelectId}
                  value={vehicle.fuelType}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, fuelType: e.target.value as FuelType })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="gasolina">Gasolina</option>
                  <option value="diesel">Diésel (Alta Durabilidad)</option>
                  <option value="hibrido">Híbrido (MHEV / HEV)</option>
                  <option value="electrico">100% Eléctrico (BEV)</option>
                </select>
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor={vehicleInitialPriceInputId} className="text-[11px] text-slate-400 font-medium">Precio Adquisición / 0 km (V₀)</label>
                  <span className="text-[11px] font-mono text-emerald-400">{formatCurrency(vehicle.initialPrice, currency)}</span>
                </div>
                <input
                  id={vehicleInitialPriceInputId}
                  type="number"
                  step="500000"
                  value={vehicle.initialPrice || ''}
                  onChange={(e) => updateNumericField('initialPrice', e.target.value, 10000000)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
                {onOpenRecommender && (
                  <button
                    type="button"
                    onClick={() => onOpenRecommender(vehicle.initialPrice)}
                    className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Ver autos más comerciales recomendados para este precio</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Parámetros de Decaimiento Exponencial y Actuarial */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-cyan-400" />
                <span>2. Parámetros de Devaluación Teórica</span>
              </span>
              <button
                onClick={() => setShowFormulaModal(!showFormulaModal)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono underline"
              >
                <Info className="h-3 w-3" />
                <span>Fórmula λ</span>
              </button>
            </div>

            {showFormulaModal && (
              <div className="p-2.5 bg-slate-950 rounded border border-cyan-900/60 text-xs text-slate-300 font-mono space-y-1">
                <p className="text-cyan-400 font-semibold">Ley de Decaimiento Continuo:</p>
                <p>V(t) = V₀ · (1 - d₁) · e^(-λ·(t-1))</p>
                <p className="text-[11px] text-slate-400">λ instantáneo = -ln(1 - {annualRate}) = <span className="text-white font-bold">{lambdaVal}</span></p>
                <p className="text-[11px] text-slate-400">Shock Inicial 1er año: V(1) = V₀ · (1 - {vehicle.firstYearDropPct}%)</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Shock de Rodamiento / 1er año */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label htmlFor={vehicleFirstYearDropInputId} className="text-slate-400 text-[11px]">Devaluación 1er Año (Shock Concesionario):</label>
                  <span className="font-mono text-cyan-400 font-bold">{vehicle.firstYearDropPct}%</span>
                </div>
                <input
                  id={vehicleFirstYearDropInputId}
                  type="range"
                  min="5"
                  max="35"
                  step="0.5"
                  value={vehicle.firstYearDropPct}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, firstYearDropPct: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>8% (Alta Retención)</span>
                  <span>16% (Promedio)</span>
                  <span>35% (Lujo/Depreciación Alta)</span>
                </div>
              </div>

              {/* Tasa Anual de Devaluación Post-Año 1 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label htmlFor={vehicleAnnualDeprecInputId} className="text-slate-400 text-[11px]">Tasa Anual de Decaimiento Post-Año 1 (d):</label>
                  <span className="font-mono text-emerald-400 font-bold">{vehicle.annualDepreciationRatePct}% anual</span>
                </div>
                <input
                  id={vehicleAnnualDeprecInputId}
                  type="range"
                  min="4"
                  max="25"
                  step="0.5"
                  value={vehicle.annualDepreciationRatePct}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, annualDepreciationRatePct: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>4% (Camionetas/Toyota)</span>
                  <span>10% (Estándar)</span>
                  <span>25% (Alta depreciación)</span>
                </div>
              </div>

              {/* Valor de Salvamento Residual */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label htmlFor={vehicleSalvagePctInputId} className="text-slate-400 text-[11px]">Valor de Salvamento Residual (Scrap Value):</label>
                  <span className="font-mono text-amber-400 font-bold">{vehicle.salvageValuePct}% ({formatCurrency(analysis.salvageValue, currency)})</span>
                </div>
                <input
                  id={vehicleSalvagePctInputId}
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={vehicle.salvageValuePct}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, salvageValuePct: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Factores de Desgaste Físico, Kilometraje y Operación */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-amber-400" />
                <span>3. Factores de Desgaste y Condición</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                analysis.combinedWearMultiplier >= 1.0 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                Factor: {(analysis.combinedWearMultiplier * 100).toFixed(1)}%
              </span>
            </div>

            {/* Slider de Kilometraje */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor={vehicleMileageRangeId} className="text-slate-400 text-[11px]">Kilometraje Anual Promedio:</label>
                <span className="font-mono text-slate-200 font-bold">{formatNumber(vehicle.annualMileageKm)} km/año</span>
              </div>
              <input
                id={vehicleMileageRangeId}
                type="range"
                min="3000"
                max="45000"
                step="1000"
                value={vehicle.annualMileageKm}
                onChange={(e) => onUpdateVehicle({ ...vehicle, annualMileageKm: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5,000 (Poco uso)</span>
                <span className="text-emerald-400 font-medium">15,000 (Estándar Colombia)</span>
                <span>40,000 (Uso intensivo)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label htmlFor={vehicleMaintenanceSelectId} className="text-[11px] text-slate-400 font-medium block mb-1">Mantenimiento</label>
                <select
                  id={vehicleMaintenanceSelectId}
                  value={vehicle.maintenance}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, maintenance: e.target.value as MaintenanceCondition })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="excelente">Excelente (Concesionario)</option>
                  <option value="bueno">Bueno (Preventivo)</option>
                  <option value="regular">Regular (Reactivo)</option>
                  <option value="deficiente">Deficiente (Sin historial)</option>
                </select>
              </div>

              <div>
                <label htmlFor={vehicleUsageTypeSelectId} className="text-[11px] text-slate-400 font-medium block mb-1">Tipo de Operación</label>
                <select
                  id={vehicleUsageTypeSelectId}
                  value={vehicle.usageType}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, usageType: e.target.value as UsageType })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="particular">Particular / Familiar</option>
                  <option value="corporativo">Corporativo / Flota</option>
                  <option value="carga_comercial">Carga Liviana</option>
                  <option value="plataforma_taxi">Transporte / Plataformas</option>
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor={vehicleAccidentHistorySelectId} className="text-[11px] text-slate-400 font-medium block mb-1">Historial de Siniestralidad</label>
                <select
                  id={vehicleAccidentHistorySelectId}
                  value={vehicle.accidentHistory}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, accidentHistory: e.target.value as AccidentHistory })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="sin_siniestros">Sin siniestros (Pintura original)</option>
                  <option value="estetico_menor">Golpe menor reparado (Cosmético)</option>
                  <option value="medio_reparado">Siniestro medio con cambio de piezas</option>
                  <option value="estructural_severo">Daño estructural en chasis / compactación</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 4: Parámetros Financieros & Administrativos (TCO) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>4. Costos Administrativos & Operación (TCO)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor={vehicleAnnualInsuranceInputId} className="text-[11px] text-slate-400 block mb-1">Seguro Todo Riesgo Anual</label>
                <input
                  id={vehicleAnnualInsuranceInputId}
                  type="number"
                  step="100000"
                  value={vehicle.annualInsuranceCost || ''}
                  onChange={(e) => updateNumericField('annualInsuranceCost', e.target.value, 1000000)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor={vehicleAnnualTaxInputId} className="text-[11px] text-slate-400 block mb-1">Impuesto Vehicular Anual</label>
                <input
                  id={vehicleAnnualTaxInputId}
                  type="number"
                  step="50000"
                  value={vehicle.annualTaxCost || ''}
                  onChange={(e) => updateNumericField('annualTaxCost', e.target.value, 500000)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor={vehicleMantoBaseInputId} className="text-[11px] text-slate-400 block mb-1">Manto. Preventivo Base/Año</label>
                <input
                  id={vehicleMantoBaseInputId}
                  type="number"
                  step="100000"
                  value={vehicle.annualMaintenanceBaseCost || ''}
                  onChange={(e) => updateNumericField('annualMaintenanceBaseCost', e.target.value, 500000)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor={vehicleMantoInflationInputId} className="text-[11px] text-slate-400 block mb-1">Incremento Manto. por Edad</label>
                <input
                  id={vehicleMantoInflationInputId}
                  type="number"
                  step="1"
                  value={vehicle.maintenanceInflationRatePct || ''}
                  onChange={(e) => updateNumericField('maintenanceInflationRatePct', e.target.value, 8)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor={vehicleFuelPerKmInputId} className="text-[11px] text-slate-400 block mb-1">Costo Combustible ($/km)</label>
                <input
                  id={vehicleFuelPerKmInputId}
                  type="number"
                  step="10"
                  value={vehicle.fuelCostPerKm || ''}
                  onChange={(e) => updateNumericField('fuelCostPerKm', e.target.value, 300)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor={vehicleInflationPctInputId} className="text-[11px] text-slate-400 block mb-1">Inflación Esperada (% anual)</label>
                <input
                  id={vehicleInflationPctInputId}
                  type="number"
                  step="0.5"
                  value={vehicle.expectedInflationPct || ''}
                  onChange={(e) => updateNumericField('expectedInflationPct', e.target.value, 4)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor={vehicleTaxShieldPctInputId} className="text-[11px] text-slate-400">Escudo Fiscal Corporativo (Tasa Renta Deducible):</label>
                  <span className="font-mono text-indigo-400 font-semibold">{vehicle.corporateTaxShieldPct}%</span>
                </div>
                <input
                  id={vehicleTaxShieldPctInputId}
                  type="range"
                  min="0"
                  max="35"
                  step="5"
                  value={vehicle.corporateTaxShieldPct}
                  onChange={(e) => onUpdateVehicle({ ...vehicle, corporateTaxShieldPct: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Botón para enviar a Comparación */}
          <button
            onClick={() => onAddVehicleToComparison(vehicle)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 active:scale-[0.98] ease-out shadow-sm"
          >
            <span>+ Agregar este vehículo al Comparador Multi-Unidad</span>
          </button>
        </div>

        {/* COLUMNA DERECHA (7 cols): Resultados Actuariales, Gráficos y Tablas */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Slider Central de Tiempo: ¿A cuántos años desea evaluar el vehículo? */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Horizonte de Evaluación Actuarial</span>
                </span>
                <p className="text-[11px] text-slate-400">Selecciona el año para proyectar el precio comercial y el costo operativo</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px] font-mono">
                  {[10, 15, 20].map(yr => (
                    <button
                      key={yr}
                      onClick={() => onChangeProjectionYears(yr)}
                      className={`px-2 py-0.5 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.95] ease-out ${
                        projectionYears === yr
                          ? 'bg-slate-800 text-emerald-400 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={`Extender simulación hasta ${yr} años`}
                    >
                      {yr}a
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Evaluar:</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                    {isZeroKm ? '0 km (Nuevo)' : `${targetYear} ${targetYear === 1 ? 'Año' : 'Años'}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <input
                id={vehicleCurrentAgeRangeId}
                aria-label="Horizonte de evaluación en años"
                type="range"
                min="0"
                max={projectionYears}
                step="1"
                value={targetYear}
                onChange={(e) => onUpdateVehicle({ ...vehicle, currentAgeYears: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span 
                  className={`cursor-pointer ${isZeroKm ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
                  onClick={() => onUpdateVehicle({ ...vehicle, currentAgeYears: 0 })}
                >
                  0 km
                </span>
                {Array.from({ length: projectionYears }, (_, i) => i + 1).map(y => (
                  <span 
                    key={y} 
                    className={`cursor-pointer ${y === targetYear ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
                    onClick={() => onUpdateVehicle({ ...vehicle, currentAgeYears: y })}
                  >
                    {y}a
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de KPIs Principales para el Año Objetivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <MetricCard
              title={isZeroKm ? 'Precio Comercial (0 km)' : `Precio Proyectado (Año ${targetYear})`}
              value={formatCurrency(targetProj.nominalPrice, currency)}
              subValue={`${(100 - targetProj.accumulatedDepreciationPct).toFixed(1)}% retenido`}
              subtitle={isZeroKm ? 'Valor nuevo de factura' : 'Valor comercial estimado en plaza'}
              trend={targetProj.accumulatedDepreciationPct > 50 ? 'warning' : 'positive'}
              trendText={`${targetProj.accumulatedDepreciationPct}% devaluado`}
              badge="Nominal"
            />

            <MetricCard
              title="Precio Real Deflactado"
              value={formatCurrency(targetProj.realPriceDeflated, currency)}
              subValue={isZeroKm ? '100% poder compra' : `-${((1 - targetProj.realPriceDeflated / vehicle.initialPrice) * 100).toFixed(1)}%`}
              subtitle={`Ajustado por inflación esperada del ${vehicle.expectedInflationPct}%`}
              trend="negative"
              trendText="Poder de Compra"
              badge="Moneda Constante"
            />

            <MetricCard
              title="Pérdida Neta de Capital"
              value={formatCurrency(targetProj.accumulatedDepreciationVal, currency)}
              subValue={`-${targetProj.accumulatedDepreciationPct}%`}
              subtitle="Depreciación acumulada en valor absoluto"
              trend="negative"
              trendText={isZeroKm ? '$0 devaluado' : `-$${formatNumber(targetProj.annualDepreciationVal)} este año`}
            />

            <MetricCard
              title="Costo de Devaluación / km"
              value={`$${targetProj.depreciationPerKm.toLocaleString('es-CO')}`}
              subValue={`${currency} / km`}
              subtitle={`Para ${formatNumber(vehicle.annualMileageKm)} km recorridos al año`}
              trend="neutral"
              trendText={`${formatNumber(targetProj.accumulatedMileage)} km acum.`}
            />

            <MetricCard
              title="Costo Mensual de Pérdida"
              value={formatCurrency(targetProj.monthlyDepreciationVal, currency)}
              subValue="/ mes"
              subtitle="Pérdida marginal de valor cada 30 días"
              trend="neutral"
              trendText="Gasto Oculto"
            />

            <MetricCard
              title="Año Óptimo de Reemplazo"
              value={`Año ${analysis.optimalReplacementYear}`}
              subValue={`~${formatNumber(analysis.optimalReplacementYear * vehicle.annualMileageKm)} km`}
              subtitle="Curva de Terborgh: Mínimo costo total de tenencia"
              trend="warning"
              trendText="Recomendación Flota"
              badge="Actuarial"
            />
          </div>

          {/* Pestañas de Vista Gráfica / Tabular */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Visualización Analítica:
                </span>
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveView('chart_decay')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                    activeView === 'chart_decay'
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Curva de Decaimiento</span>
                </button>

                <button
                  onClick={() => setActiveView('chart_terborgh')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                    activeView === 'chart_terborgh'
                      ? 'bg-slate-800 text-amber-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Curva Terborgh & TCO</span>
                </button>

                <button
                  onClick={() => setActiveView('table_data')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                    activeView === 'table_data'
                      ? 'bg-slate-800 text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Table className="h-3.5 w-3.5" />
                  <span>Matriz Anual</span>
                </button>
              </div>
            </div>

            {/* Contenido de la Vista Seleccionada */}
            {activeView === 'chart_decay' && (
              <div>
                <DepreciationChart
                  projections={analysis.projections}
                  initialPrice={vehicle.initialPrice}
                  currency={currency}
                  targetYear={targetYear}
                  salvageValue={analysis.salvageValue}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>🟢 Valor Comercial Nominal</span>
                  <span>🔵 Valor Real Deflactado</span>
                  <span>🟣 Valor en Libros (NIC 16 NIIF)</span>
                  <span>🟠 Valor de Salvamento Residual</span>
                </div>
              </div>
            )}

            {activeView === 'chart_terborgh' && (
              <div>
                <TerborghChart
                  projections={analysis.projections}
                  optimalYear={analysis.optimalReplacementYear}
                  currency={currency}
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  💡 <strong>Principio de Terborgh</strong>: La depreciación decrece con el tiempo pero los costos de mantenimiento preventivo y correctivo crecen de forma no lineal. El punto más bajo de la curva amarilla representa el año financiero ideal de sustitución del vehículo antes de que los sobrecostos de taller superen la amortización de una nueva unidad.
                </p>
              </div>
            )}

            {activeView === 'table_data' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Año</th>
                      <th className="py-2.5 px-3 text-right">Precio Nominal</th>
                      <th className="py-2.5 px-3 text-right">Retención %</th>
                      <th className="py-2.5 px-3 text-right">Pérdida Anual</th>
                      <th className="py-2.5 px-3 text-right">Costo / km</th>
                      <th className="py-2.5 px-3 text-right">OpEx Anual</th>
                      <th className="py-2.5 px-3 text-right">TCO Acumulado</th>
                      <th className="py-2.5 px-3 text-right">Libros NIC 16</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {analysis.projections.map((p) => {
                      const isTarget = p.year === targetYear;
                      const isOptimal = p.year === analysis.optimalReplacementYear;
                      return (
                        <tr 
                          key={p.year}
                          className={`transition-colors ${
                            isTarget 
                              ? 'bg-emerald-950/40 text-emerald-200 font-semibold' 
                              : isOptimal
                              ? 'bg-amber-950/20 text-amber-200'
                              : 'hover:bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3 flex items-center gap-1.5 font-sans font-medium">
                            <span>Año {p.year}</span>
                            {isTarget && <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-400 rounded">TARGET</span>}
                            {isOptimal && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded">ÓPTIMO</span>}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-100">
                            {formatCurrency(p.nominalPrice, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-emerald-400">
                            {(100 - p.accumulatedDepreciationPct).toFixed(1)}%
                          </td>
                          <td className="py-2 px-3 text-right text-rose-400">
                            -{formatCurrency(p.annualDepreciationVal, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-400">
                            ${p.depreciationPerKm} {currency}/km
                          </td>
                          <td className="py-2 px-3 text-right text-cyan-400">
                            {formatCurrency(p.annualOpEx, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-amber-400 font-semibold">
                            {formatCurrency(p.accumulatedTCO, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-indigo-400">
                            {formatCurrency(p.accountingBookValue, currency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Desglose de Factores de Desgaste (Anti-slop / Explicabilidad Total) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
              Auditoría de Factores Ponderados del Vehículo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Penaliz. Kilometraje</span>
                <span className={analysis.breakdown.mileagePenaltyPct > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {analysis.breakdown.mileagePenaltyPct > 0 ? `-${analysis.breakdown.mileagePenaltyPct}%` : `+${Math.abs(analysis.breakdown.mileagePenaltyPct)}%`}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Factor Mantenimiento</span>
                <span className="text-slate-200">{analysis.breakdown.maintenanceFactor}x</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Factor Tipo Uso</span>
                <span className="text-slate-200">{analysis.breakdown.usageFactor}x</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Factor Siniestros</span>
                <span className="text-slate-200">{analysis.breakdown.accidentFactor}x</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
