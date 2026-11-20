import React, { useMemo } from 'react';
import type { VehicleParameters, VehicleAnalysisResult } from '../types/vehicle';
import { formatCurrency, formatNumber } from '../lib/depreciationEngine';
import { Printer, X, Calculator } from 'lucide-react';

interface ValuationReportModalProps {
  vehicle: VehicleParameters;
  analysis: VehicleAnalysisResult;
  currency: 'COP' | 'USD';
  onClose: () => void;
}

export const ValuationReportModal: React.FC<ValuationReportModalProps> = ({
  vehicle,
  analysis,
  currency,
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Identificador de dictamen estable para evitar mutaciones en re-renders
  const registrationId = useMemo(() => {
    const hash = Math.abs(
      (vehicle.id + vehicle.name).split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString();
    return `AVP-VAL-${hash.padEnd(8, '0').slice(0, 8)}`;
  }, [vehicle.id, vehicle.name]);

  const targetYear = vehicle.currentAgeYears ?? 5;
  const isZeroKm = targetYear === 0;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm modal-backdrop-print animate-modal-backdrop">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 card-print animate-modal-content">
        
        {/* Barra de Controles de Impresión */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Calculator className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold">AutoValua Pro — Dictamen Pericial Ejecutivo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-[transform,background-color] duration-150 active:scale-[0.98] ease-out"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-[transform,background-color] duration-150 active:scale-[0.95] ease-out"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenido Imprimible del Informe */}
        <div className="p-8 space-y-6 bg-slate-900 text-slate-200 text-xs card-print">
          
          {/* Encabezado del Certificado */}
          <div className="border-b-2 border-slate-700 pb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-white tracking-tight">DICTAMEN PERICIAL DE AVALÚO COMERCIAL</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Certificación Técnica y Actuarial de Devaluación Vehicular • SIC / Fasecolda & NIIF NIC 16
              </p>
              <p className="text-slate-400 text-[11px] font-mono mt-0.5">
                Número de Registro: {registrationId}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">FECHA DE EMISIÓN:</span>
              <span className="text-xs font-bold text-slate-200">{currentDate}</span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 badge-print">
                AUDITORÍA VALUADA
              </span>
            </div>
          </div>

          {/* Ficha Técnica del Automotor */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 card-print">
            <span className="font-bold text-slate-100 uppercase text-[11px] tracking-wider block">
              1. Identificación y Especificaciones Técnicas del Vehículo
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">MARCA:</span>
                <span className="font-semibold text-white">{vehicle.brand}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">LÍNEA / VERSIÓN:</span>
                <span className="font-semibold text-white">{vehicle.line}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">AÑO MODELO:</span>
                <span className="font-semibold text-white">{vehicle.modelYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">MOTORIZACIÓN:</span>
                <span className="font-semibold text-white uppercase">{vehicle.fuelType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">KILOMETRAJE ANUAL:</span>
                <span className="font-semibold text-white">{formatNumber(vehicle.annualMileageKm)} km/a</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ESTADO MANTENIMIENTO:</span>
                <span className="font-semibold text-white uppercase">{vehicle.maintenance}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TIPO DE USO:</span>
                <span className="font-semibold text-white uppercase">{vehicle.usageType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SINIESTRALIDAD:</span>
                <span className="font-semibold text-white uppercase">{vehicle.accidentHistory.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Resumen del Avalúo Comercial y Económico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 card-print">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Valor Adquisición (V₀)</span>
              <span className="text-xl font-bold text-slate-100 font-mono block mt-1">
                {formatCurrency(vehicle.initialPrice, currency)}
              </span>
              <span className="text-[11px] text-slate-400">Condición inicial nuevo / 0 km</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 card-print">
              <span className="text-emerald-400 text-[10px] uppercase font-mono block">
                {isZeroKm ? 'Valor Comercial (0 km Nuevo)' : `Valor Comercial Año ${targetYear}`}
              </span>
              <span className="text-xl font-bold text-emerald-300 font-mono block mt-1">
                {formatCurrency(targetProj.nominalPrice, currency)}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                Retención: {(100 - targetProj.accumulatedDepreciationPct).toFixed(1)}% del valor original
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 card-print">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Pérdida Neta de Capital</span>
              <span className="text-xl font-bold text-rose-400 font-mono block mt-1">
                -{formatCurrency(targetProj.accumulatedDepreciationVal, currency)}
              </span>
              <span className="text-[11px] text-slate-400">Depreciación del {targetProj.accumulatedDepreciationPct}%</span>
            </div>
          </div>

          {/* Tabla de Proyección Actuarial */}
          <div className="space-y-2">
            <span className="font-bold text-slate-100 uppercase text-[11px] tracking-wider block">
              2. Tabla de Amortización y Valor Residual a 10 Años
            </span>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Horizonte</th>
                    <th className="py-2 px-3 text-right">Valor Comercial ($)</th>
                    <th className="py-2 px-3 text-right">Retención %</th>
                    <th className="py-2 px-3 text-right">Pérdida Anual ($)</th>
                    <th className="py-2 px-3 text-right">Costo / km</th>
                    <th className="py-2 px-3 text-right">TCO Acumulado ($)</th>
                    <th className="py-2 px-3 text-right">Libros NIC 16 ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {analysis.projections.slice(0, 10).map(p => (
                    <tr key={p.year} className={p.year === targetYear ? 'bg-emerald-950/30 font-semibold' : ''}>
                      <td className="py-1.5 px-3 font-sans">Año {p.year}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-slate-100">{formatCurrency(p.nominalPrice, currency)}</td>
                      <td className="py-1.5 px-3 text-right text-emerald-400">{(100 - p.accumulatedDepreciationPct).toFixed(1)}%</td>
                      <td className="py-1.5 px-3 text-right text-rose-400">-{formatCurrency(p.annualDepreciationVal, currency)}</td>
                      <td className="py-1.5 px-3 text-right text-slate-300">${p.depreciationPerKm} {currency}/km</td>
                      <td className="py-1.5 px-3 text-right text-amber-400">{formatCurrency(p.accumulatedTCO, currency)}</td>
                      <td className="py-1.5 px-3 text-right text-indigo-400">{formatCurrency(p.accountingBookValue, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dictamen y Recomendación de Reemplazo */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 card-print">
            <span className="font-bold text-slate-100 uppercase text-[11px] tracking-wider block">
              3. Conclusión Pericial y Recomendación de Reemplazo (Modelo Terborgh)
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              El análisis actuarial determina que el <strong>Año Óptimo de Reemplazo</strong> para esta unidad corresponde al <strong>Año {analysis.optimalReplacementYear}</strong> (aproximadamente a los {formatNumber(analysis.optimalReplacementYear * vehicle.annualMileageKm)} kilómetros recorridos). A partir de dicho punto de corte, el costo marginal acumulado de mantenimiento correctivo y fallas mecánicas sobrepasa la amortización de una unidad moderna de última generación.
            </p>
          </div>

          {/* Firmas de Responsabilidad Pericial */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-600 w-48 mx-auto mb-2" />
              <span className="font-bold text-slate-200 block">Ingeniero Perito Tasador</span>
              <span className="text-[11px] text-slate-400">R.N.A. No. 49204-SIC / Colperitos</span>
            </div>

            <div>
              <div className="border-b border-slate-600 w-48 mx-auto mb-2" />
              <span className="font-bold text-slate-200 block">Dirección Actuarial y Financiera</span>
              <span className="text-[11px] text-slate-400">AutoValua Pro Analytical Workbench</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
