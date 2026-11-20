import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import type { VehicleParameters } from '../types/vehicle';
import { analyzeVehicleDepreciation, formatCurrency, formatNumber } from '../lib/depreciationEngine';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';
import { GitCompare, Trash2 } from 'lucide-react';
import type { TooltipItem } from 'chart.js';

interface VehicleComparisonProps {
  vehicles: VehicleParameters[];
  onRemoveVehicle: (id: string) => void;
  onAddPresetVehicle: (code: string) => void;
  currency: 'COP' | 'USD';
}

const COMPARISON_COLORS = [
  { border: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' }, // Emerald
  { border: '#06B6D4', bg: 'rgba(6, 182, 212, 0.2)' },  // Cyan
  { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' }, // Amber
  { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.2)' }, // Pink/Rose
];

export const VehicleComparison: React.FC<VehicleComparisonProps> = ({
  vehicles,
  onRemoveVehicle,
  onAddPresetVehicle,
  currency
}) => {
  const [comparisonHorizonYears, setComparisonHorizonYears] = useState<number>(5);
  const [metricMode, setMetricMode] = useState<'retention_pct' | 'nominal_price' | 'tco_total'>('retention_pct');

  // Analizamos cada vehículo para el horizonte de comparación (hasta 10 años)
  const analyzedVehicles = vehicles.map(v => ({
    vehicle: v,
    analysis: analyzeVehicleDepreciation(v, 10, 'exponential_continuous')
  }));

  // Sincronizamos las etiquetas del gráfico con el horizonte seleccionado (3, 5, 7 o 10 años)
  const baseLabels = ['0 km', 'Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5', 'Año 6', 'Año 7', 'Año 8', 'Año 9', 'Año 10'];
  const yearsLabels = baseLabels.slice(0, comparisonHorizonYears + 1);

  const lineChartData = {
    labels: yearsLabels,
    datasets: analyzedVehicles.map((item, index) => {
      const color = COMPARISON_COLORS[index % COMPARISON_COLORS.length];
      
      let allPoints: number[] = [];
      if (metricMode === 'retention_pct') {
        allPoints = [100, ...item.analysis.projections.map(p => 100 - p.accumulatedDepreciationPct)];
      } else if (metricMode === 'nominal_price') {
        allPoints = [item.vehicle.initialPrice, ...item.analysis.projections.map(p => p.nominalPrice)];
      } else {
        // TCO Acumulado
        allPoints = [0, ...item.analysis.projections.map(p => p.accumulatedTCO)];
      }

      // Cortamos los puntos según el horizonte seleccionado
      const dataPoints = allPoints.slice(0, comparisonHorizonYears + 1);

      return {
        label: `${item.vehicle.brand} ${item.vehicle.line}`,
        data: dataPoints,
        borderColor: color.border,
        backgroundColor: color.bg,
        tension: 0.3,
        borderWidth: 2.5,
        pointRadius: 3.5,
        pointHoverRadius: 6,
      };
    })
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#CBD5E1',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label ?? '';
            const val = context.parsed.y ?? 0;
            if (metricMode === 'retention_pct') {
              return ` ${label}: ${val.toFixed(1)}% del valor original`;
            }
            return ` ${label}: ${formatCurrency(val, currency)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#1E293B' },
        ticks: { color: '#64748B' }
      },
      y: {
        grid: { color: '#1E293B' },
        ticks: {
          color: '#64748B',
          callback: (value: string | number) => {
            const num = Number(value);
            if (metricMode === 'retention_pct') return `${num}%`;
            if (currency === 'COP') return `$${(num / 1000000).toFixed(0)}M`;
            return `$${(num / 1000).toFixed(0)}k`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header del Comparador */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <GitCompare className="h-4 w-4 text-emerald-400" />
            <span>Benchmark & Comparador Multi-Unidad ({vehicles.length}/4)</span>
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Compara retención de valor, curvas de decaimiento y costo total de propiedad (TCO) lado a lado
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Horizonte de Comparación */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Horizonte:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px] font-mono">
              {[3, 5, 7, 10].map(yr => (
                <button
                  key={yr}
                  onClick={() => setComparisonHorizonYears(yr)}
                  className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.95] ease-out ${
                    comparisonHorizonYears === yr
                      ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Comparar a ${yr} años`}
                >
                  {yr}a
                </button>
              ))}
            </div>
          </div>

          {/* Añadir vehículo de referencia */}
          {vehicles.length < 4 && (
            <div className="flex items-center gap-2">
              <label htmlFor="comparison-preset-select" className="text-xs text-slate-400">Agregar:</label>
              <select
                id="comparison-preset-select"
                aria-label="Agregar vehículo a la comparación"
                onChange={(e) => {
                  if (e.target.value) {
                    onAddPresetVehicle(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="" disabled>+ Seleccionar de Base SIC...</option>
                {FASECOLDA_SIC_DATABASE.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.brand} {item.line} ({item.fuelType})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de Vehículos en Comparación */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyzedVehicles.map((item, index) => {
          const color = COMPARISON_COLORS[index % COMPARISON_COLORS.length];
          const targetIndex = Math.min(comparisonHorizonYears, item.analysis.projections.length) - 1;
          const projTarget = item.analysis.projections[targetIndex] ?? item.analysis.projections[0];

          return (
            <div 
              key={item.vehicle.id}
              className="bg-slate-900 border rounded-xl p-4 relative shadow-sm flex flex-col justify-between"
              style={{ borderColor: color.border }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: color.bg, color: color.border }}>
                      {item.vehicle.fuelType.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1">
                      {item.vehicle.brand} {item.vehicle.line}
                    </h4>
                    <span className="text-xs text-slate-400">Modelo {item.vehicle.modelYear}</span>
                  </div>
                  {vehicles.length > 1 && (
                    <button
                      onClick={() => onRemoveVehicle(item.vehicle.id)}
                      title="Eliminar de la comparación"
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-[transform,color] duration-100 active:scale-[0.90] ease-out"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Precio Inicial:</span>
                    <span className="text-slate-200 font-semibold">{formatCurrency(item.vehicle.initialPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valor a {comparisonHorizonYears} Años:</span>
                    <span className="font-bold text-slate-100">{formatCurrency(projTarget.nominalPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Retención {comparisonHorizonYears}a:</span>
                    <span className="font-bold" style={{ color: color.border }}>
                      {(100 - projTarget.accumulatedDepreciationPct).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TCO Acumulado:</span>
                    <span className="text-amber-400 font-semibold">{formatCurrency(projTarget.accumulatedTCO, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Costo / km:</span>
                    <span className="text-slate-300">${projTarget.depreciationPerKm} {currency}/km</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Reemplazo Óptimo:</span>
                <span className="font-mono text-emerald-400 font-semibold">Año {item.analysis.optimalReplacementYear}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico Comparativo Dinámico */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Análisis Comparativo Gráfico (Horizonte {comparisonHorizonYears} Años):
            </span>
            <p className="text-[11px] text-slate-400">Comportamiento multilínea sincronizado</p>
          </div>

          {/* Toggle de Métricas */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setMetricMode('retention_pct')}
              className={`px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                metricMode === 'retention_pct'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              % Retención de Valor
            </button>
            <button
              onClick={() => setMetricMode('nominal_price')}
              className={`px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                metricMode === 'nominal_price'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Precio Nominal ($)
            </button>
            <button
              onClick={() => setMetricMode('tco_total')}
              className={`px-3 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-medium ${
                metricMode === 'tco_total'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TCO Acumulado ($)
            </button>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Matriz Comparativa Detallada */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-3">
          Matriz Ejecutiva de Decisión de Flota & Inversión:
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Vehículo</th>
                <th className="py-2.5 px-3 text-right">Precio 0 km</th>
                <th className="py-2.5 px-3 text-right">Valor Año 3</th>
                <th className="py-2.5 px-3 text-right">Valor Año 5</th>
                <th className="py-2.5 px-3 text-right">Retención 5a %</th>
                <th className="py-2.5 px-3 text-right">Pérdida 5a ($)</th>
                <th className="py-2.5 px-3 text-right">TCO 5 Años</th>
                <th className="py-2.5 px-3 text-right">Año Reemplazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {analyzedVehicles.map((item, idx) => {
                const proj3 = item.analysis.projections[2] ?? item.analysis.projections[item.analysis.projections.length - 1];
                const proj5 = item.analysis.projections[4] ?? item.analysis.projections[item.analysis.projections.length - 1];
                const color = COMPARISON_COLORS[idx % COMPARISON_COLORS.length];

                return (
                  <tr key={item.vehicle.id} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.border }} />
                      <div>
                        <span className="text-slate-100 font-bold block">{item.vehicle.brand} {item.vehicle.line}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.vehicle.fuelType} • {formatNumber(item.vehicle.annualMileageKm)} km/a</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      {formatCurrency(item.vehicle.initialPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-100">
                      {formatCurrency(proj3.nominalPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                      {formatCurrency(proj5.nominalPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold" style={{ color: color.border }}>
                      {(100 - proj5.accumulatedDepreciationPct).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-400">
                      -{formatCurrency(proj5.accumulatedDepreciationVal, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-400 font-semibold">
                      {formatCurrency(proj5.accumulatedTCO, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                      Año {item.analysis.optimalReplacementYear}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
