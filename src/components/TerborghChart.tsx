import React from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import type { YearProjection } from '../types/vehicle';
import { formatCurrency } from '../lib/depreciationEngine';
import type { TooltipItem } from 'chart.js';

interface TerborghChartProps {
  projections: YearProjection[];
  optimalYear: number;
  currency: 'COP' | 'USD';
}

export const TerborghChart: React.FC<TerborghChartProps> = ({
  projections,
  optimalYear,
  currency
}) => {
  const labels = projections.map(p => `Año ${p.year}`);
  const annualDeprecData = projections.map(p => p.annualDepreciationVal);
  const annualMantoData = projections.map(p => p.annualMaintenanceCost);
  
  // Costo medio anual acumulado (Modelo de Terborgh riguroso = TCO(t) / t)
  const averageTotalCostData = projections.map((p) => p.averageAnnualCost);

  const data = {
    labels,
    datasets: [
      {
        label: 'Costo Medio Anual Acumulado (Curva Terborgh)',
        data: averageTotalCostData,
        borderColor: '#F59E0B', // Amber 500
        backgroundColor: 'rgba(245, 158, 11, 0.06)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: labels.map((_, i) => (i + 1 === optimalYear ? '#F59E0B' : '#78350F')),
        pointRadius: labels.map((_, i) => (i + 1 === optimalYear ? 7 : 3)),
        pointHoverRadius: 8,
      },
      {
        label: 'Depreciación Marginal Anual (Pérdida de Capital)',
        data: annualDeprecData,
        borderColor: '#EF4444', // Rose 500
        borderDash: [4, 4],
        borderWidth: 1.8,
        tension: 0.2,
        pointRadius: 2.5,
      },
      {
        label: 'Costo Anual de Mantenimiento Preventivo/Correctivo',
        data: annualMantoData,
        borderColor: '#06B6D4', // Cyan 500
        borderDash: [3, 3],
        borderWidth: 1.8,
        tension: 0.2,
        pointRadius: 2.5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          color: '#94A3B8',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label ?? '';
            const val = context.parsed.y ?? 0;
            return ` ${label}: ${formatCurrency(val, currency)}`;
          },
          afterBody: (contexts: TooltipItem<'line'>[]) => {
            const year = contexts[0].dataIndex + 1;
            if (year === optimalYear) {
              return [` ⭐ AÑO ${year}: PUNTO ÓPTIMO DE REEMPLAZO (Mínimo de costo medio anual)`];
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#1E293B',
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#1E293B',
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11
          },
          callback: (value: string | number) => {
            const num = Number(value);
            if (currency === 'COP') {
              return `$${(num / 1000000).toFixed(0)}M`;
            }
            return `$${(num / 1000).toFixed(0)}k`;
          }
        }
      }
    }
  };

  return (
    <div className="h-[320px] w-full">
      <Line data={data} options={options} />
    </div>
  );
};
