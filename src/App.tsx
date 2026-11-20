import React, { useState } from 'react';
import type { VehicleParameters, OfficialSicFasecoldaVehicle, ModelType, FuelType } from './types/vehicle';
import { analyzeVehicleDepreciation } from './lib/depreciationEngine';
import { FASECOLDA_SIC_DATABASE } from './data/sicFasecoldaData';
import { Header } from './components/Header';
import { BudgetRecommender } from './components/BudgetRecommender';
import { SingleVehicleCalculator } from './components/SingleVehicleCalculator';
import { VehicleComparison } from './components/VehicleComparison';
import { SicFasecoldaExplorer } from './components/SicFasecoldaExplorer';
import { EconomicTheoryGuide } from './components/EconomicTheoryGuide';
import { ValuationReportModal } from './components/ValuationReportModal';
import { Check } from 'lucide-react';

const DEFAULT_VEHICLE: VehicleParameters = {
  id: 'veh-main-001',
  name: 'Toyota Corolla Cross HEV (Híbrida)',
  brand: 'Toyota',
  line: 'Corolla Cross HEV XEI',
  modelYear: 2024,
  initialPrice: 135000000,
  currentAgeYears: 5,
  fasecoldaCode: 'FAS-TOY-COR-CRS',
  firstYearDropPct: 13.5,
  annualDepreciationRatePct: 8.5,
  salvageValuePct: 18,
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

const DEFAULT_COMPARISON_LIST: VehicleParameters[] = [
  DEFAULT_VEHICLE,
  {
    id: 'veh-comp-002',
    name: 'Mazda CX-30 Grand Touring',
    brand: 'Mazda',
    line: 'CX-30 Grand Touring 2.0L',
    modelYear: 2024,
    initialPrice: 122000000,
    currentAgeYears: 5,
    fasecoldaCode: 'FAS-MAZ-CX30',
    firstYearDropPct: 16.0,
    annualDepreciationRatePct: 10.2,
    salvageValuePct: 15,
    annualMileageKm: 15000,
    maintenance: 'bueno',
    usageType: 'particular',
    accidentHistory: 'sin_siniestros',
    fuelType: 'gasolina',
    annualInsuranceCost: 3900000,
    annualTaxCost: 3050000,
    annualMaintenanceBaseCost: 1600000,
    maintenanceInflationRatePct: 12,
    fuelCostPerKm: 450,
    expectedInflationPct: 5.5,
    corporateTaxShieldPct: 35
  },
  {
    id: 'veh-comp-003',
    name: 'BMW 330i M Sport',
    brand: 'BMW',
    line: 'Serie 3 330i M Sport',
    modelYear: 2024,
    initialPrice: 265000000,
    currentAgeYears: 5,
    fasecoldaCode: 'FAS-BMW-330-MSM',
    firstYearDropPct: 24.0,
    annualDepreciationRatePct: 16.5,
    salvageValuePct: 14,
    annualMileageKm: 12000,
    maintenance: 'excelente',
    usageType: 'particular',
    accidentHistory: 'sin_siniestros',
    fuelType: 'gasolina',
    annualInsuranceCost: 8480000,
    annualTaxCost: 9275000,
    annualMaintenanceBaseCost: 4500000,
    maintenanceInflationRatePct: 18,
    fuelCostPerKm: 540,
    expectedInflationPct: 5.5,
    corporateTaxShieldPct: 35
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommender' | 'calculator' | 'comparison' | 'database' | 'theory'>('recommender');
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');
  const [selectedModel, setSelectedModel] = useState<ModelType>('exponential_continuous');
  const [projectionYears, setProjectionYears] = useState<number>(10);
  
  const [activeVehicle, setActiveVehicle] = useState<VehicleParameters>(DEFAULT_VEHICLE);
  const [recommenderBudget, setRecommenderBudget] = useState<number>(DEFAULT_VEHICLE.initialPrice);
  const [comparisonVehicles, setComparisonVehicles] = useState<VehicleParameters[]>(DEFAULT_COMPARISON_LIST);
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenRecommender = (budget: number) => {
    setRecommenderBudget(budget);
    setActiveTab('recommender');
  };

  const generateUniqueId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Estimador paramétrico de costos operativos para evitar herencias erróneas
  const estimateOperationalParameters = (price: number, fuelType: FuelType, category: string) => {
    const annualInsuranceCost = Math.round(price * 0.032);
    let taxRate = 0.015;
    if (price > 121000000) taxRate = 0.035;
    else if (price > 54000000) taxRate = 0.025;
    const annualTaxCost = Math.round(price * taxRate);

    let maintBase = 1400000;
    if (category === 'Premium') maintBase = 4500000;
    else if (category === 'Camioneta Pick-Up' || category === 'SUV Mediana') maintBase = 2200000;
    else if (category === 'Hatchback') maintBase = 1100000;

    let fuelPerKm = 450;
    if (fuelType === 'electrico') fuelPerKm = 160;
    else if (fuelType === 'hibrido') fuelPerKm = 310;
    else if (fuelType === 'diesel') fuelPerKm = 390;

    return { annualInsuranceCost, annualTaxCost, annualMaintenanceBaseCost: maintBase, fuelCostPerKm: fuelPerKm };
  };

  const handleResetVehicle = () => {
    setActiveVehicle({ ...DEFAULT_VEHICLE, id: generateUniqueId('veh') });
    showNotification('Parámetros restablecidos a la configuración base.');
  };

  const handleAddVehicleToComparison = (v: VehicleParameters) => {
    if (comparisonVehicles.length >= 4) {
      showNotification('Límite alcanzado: Máximo 4 vehículos en comparación simultánea.');
      return;
    }
    const newVeh = { ...v, id: generateUniqueId('veh-comp') };
    setComparisonVehicles([...comparisonVehicles, newVeh]);
    showNotification(`${v.brand} ${v.line} añadido al comparador.`);
    setActiveTab('comparison');
  };

  const handleRemoveVehicleFromComparison = (id: string) => {
    if (comparisonVehicles.length <= 1) {
      showNotification('Se requiere al menos un vehículo en la lista.');
      return;
    }
    setComparisonVehicles(comparisonVehicles.filter(v => v.id !== id));
  };

  const handleAddPresetToComparison = (code: string) => {
    const preset = FASECOLDA_SIC_DATABASE.find(item => item.code === code);
    if (!preset) return;
    if (comparisonVehicles.length >= 4) {
      showNotification('Límite alcanzado: Máximo 4 vehículos en comparación simultánea.');
      return;
    }

    const estimatedOps = estimateOperationalParameters(preset.referencePriceNew, preset.fuelType, preset.category);

    const newVeh: VehicleParameters = {
      ...DEFAULT_VEHICLE,
      id: generateUniqueId('veh-comp'),
      name: `${preset.brand} ${preset.line}`,
      brand: preset.brand,
      line: preset.line,
      fasecoldaCode: preset.code,
      initialPrice: preset.referencePriceNew,
      fuelType: preset.fuelType,
      annualDepreciationRatePct: preset.typicalAnnualDecayPct,
      firstYearDropPct: Number((100 - preset.historicalRetentionPct[0]).toFixed(1)),
      ...estimatedOps
    };

    setComparisonVehicles([...comparisonVehicles, newVeh]);
    showNotification(`${preset.brand} ${preset.line} agregado al comparador.`);
  };

  const handleSelectFromDatabase = (item: OfficialSicFasecoldaVehicle) => {
    const estimatedOps = estimateOperationalParameters(item.referencePriceNew, item.fuelType, item.category);

    setActiveVehicle({
      ...activeVehicle,
      id: generateUniqueId('veh'),
      name: `${item.brand} ${item.line}`,
      brand: item.brand,
      line: item.line,
      fasecoldaCode: item.code,
      initialPrice: item.referencePriceNew,
      fuelType: item.fuelType,
      annualDepreciationRatePct: item.typicalAnnualDecayPct,
      firstYearDropPct: Number((100 - item.historicalRetentionPct[0]).toFixed(1)),
      ...estimatedOps
    });
    setActiveTab('calculator');
    showNotification(`Cargado en Valuador: ${item.brand} ${item.line}`);
  };

  // Exportar Proyección a CSV con sanitización estricta (RFC 4180 & Anti-Formula Injection)
  const handleExportCSV = () => {
    const analysis = analyzeVehicleDepreciation(activeVehicle, projectionYears, selectedModel);

    const sanitizeCell = (val: string | number) => {
      let str = String(val);
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    let csvContent = '\uFEFF'; // BOM para asegurar caracteres UTF-8 en Excel
    csvContent += 'INFORME DEVALUACION ACTUARIAL - AUTOVALUA PRO\r\n';
    csvContent += `${sanitizeCell('Vehículo')},${sanitizeCell(`${activeVehicle.brand} ${activeVehicle.line}`)}\r\n`;
    csvContent += `${sanitizeCell('Modelo Teórico')},${sanitizeCell(selectedModel)}\r\n`;
    csvContent += `${sanitizeCell('Precio Inicial (V0)')},${activeVehicle.initialPrice}\r\n`;
    csvContent += `${sanitizeCell('Moneda')},${sanitizeCell(currency)}\r\n`;
    csvContent += `${sanitizeCell('Fecha de Generación')},${sanitizeCell(new Date().toLocaleString('es-CO'))}\r\n\r\n`;

    const headers = [
      'Año',
      'Precio Nominal',
      'Retención %',
      'Pérdida Anual',
      'Costo por km',
      'Mantenimiento Anual',
      'OpEx Anual',
      'TCO Acumulado',
      'Libros NIC 16'
    ].map(sanitizeCell).join(',');
    csvContent += headers + '\r\n';

    analysis.projections.forEach(p => {
      const row = [
        p.year,
        p.nominalPrice,
        (100 - p.accumulatedDepreciationPct).toFixed(2),
        p.annualDepreciationVal,
        p.depreciationPerKm,
        p.annualMaintenanceCost,
        p.annualOpEx,
        p.accumulatedTCO,
        p.accountingBookValue
      ].map(sanitizeCell).join(',');
      csvContent += row + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeFilename = `${activeVehicle.brand}_${activeVehicle.line}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `AutoValua_Pro_${safeFilename}_proyeccion.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Archivo CSV exportado exitosamente con codificación UTF-8.');
  };

  const currentAnalysis = analyzeVehicleDepreciation(activeVehicle, projectionYears, selectedModel);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-slate-100 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium toast-animate-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Institucional y Barra de Navegación */}
      <div className={showPrintReport ? 'no-print' : ''}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          onPrintReport={() => setShowPrintReport(true)}
          onExportCSV={handleExportCSV}
          onResetVehicle={handleResetVehicle}
        />
      </div>

      {/* Contenido Dinámico Principal */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 ${showPrintReport ? 'no-print' : ''}`}>
        {activeTab === 'recommender' && (
          <BudgetRecommender
            onSelectVehicleForValuation={handleSelectFromDatabase}
            onAddVehicleToComparison={handleAddVehicleToComparison}
            currency={currency}
            initialBudget={recommenderBudget}
          />
        )}

        {activeTab === 'calculator' && (
          <SingleVehicleCalculator
            vehicle={activeVehicle}
            onUpdateVehicle={setActiveVehicle}
            currency={currency}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            projectionYears={projectionYears}
            onChangeProjectionYears={setProjectionYears}
            onAddVehicleToComparison={handleAddVehicleToComparison}
            onOpenRecommender={handleOpenRecommender}
          />
        )}

        {activeTab === 'comparison' && (
          <VehicleComparison
            vehicles={comparisonVehicles}
            onRemoveVehicle={handleRemoveVehicleFromComparison}
            onAddPresetVehicle={handleAddPresetToComparison}
            currency={currency}
          />
        )}

        {activeTab === 'database' && (
          <SicFasecoldaExplorer
            onSelectVehicleForValuation={handleSelectFromDatabase}
            currency={currency}
          />
        )}

        {activeTab === 'theory' && (
          <EconomicTheoryGuide />
        )}
      </main>

      {/* Footer Institucional & Normativo */}
      <footer className={`border-t border-slate-800 bg-slate-950 py-4 mt-auto text-xs text-slate-400 ${showPrintReport ? 'no-print' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AutoValua Pro</span>
            <span>•</span>
            <span>Motor Actuarial de Devaluación Vehicular</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Metodología basada en la Ley de Decaimiento Continuo, Guía de Valores Fasecolda, Resoluciones MinTransporte/SIC y NIIF NIC 16.
          </div>
        </div>
      </footer>

      {/* Modal de Dictamen Pericial Imprimible */}
      {showPrintReport && (
        <ValuationReportModal
          vehicle={activeVehicle}
          analysis={currentAnalysis}
          currency={currency}
          onClose={() => setShowPrintReport(false)}
        />
      )}

    </div>
  );
};

export default App;
