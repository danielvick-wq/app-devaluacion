import React from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import type { YearProjection } from '../types/vehicle';
import { formatCurrency } from '../lib/depreciationEngine';
import type { TooltipItem } from 'chart.js';

interface DepreciationChartProps {
  projections: YearProjection[];
  initialPrice: number;
  currency: 'COP' | 'USD';
  targetYear: number;
  salvageValue: number;
}

export const DepreciationChart: React.FC<DepreciationChartProps> = ({
  projections,
  initialPrice,
  currency,
  targetYear,
  salvageValue
}) => {
  const labels = ['0 km', ...projections.map(p => `Año ${p.year}`)];
  const nominalData = [initialPrice, ...projections.map(p => p.nominalPrice)];
  const realData = [initialPrice, ...projections.map(p => p.realPriceDeflated)];
  const bookData = [initialPrice, ...projections.map(p => p.accountingBookValue)];
  const salvageData = [salvageValue, ...projections.map(() => salvageValue)];

  const data = {
    labels,
    datasets: [
      {
        label: 'Valor Comercial Nominal (Mercado)',
        data: nominalData,
        borderColor: '#10B981', // Emerald 500
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5,
        pointBackgroundColor: labels.map((_, i) => (i === targetYear ? '#34D399' : '#10B981')),
        pointRadius: labels.map((_, i) => (i === targetYear ? 6 : 3.5)),
        pointHoverRadius: 7,
      },
      {
        label: 'Valor Real Deflactado (Poder Adquisitivo)',
        data: realData,
        borderColor: '#06B6D4', // Cyan 500
        backgroundColor: 'transparent',
        borderDash: [5, 4],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: 'Valor en Libros (Contable NIC 16 NIIF)',
        data: bookData,
        borderColor: '#818CF8', // Indigo 400
        backgroundColor: 'transparent',
        borderDash: [2, 2],
        borderWidth: 1.5,
        tension: 0,
        pointRadius: 2.5,
      },
      {
        label: 'Valor de Salvamento Residual',
        data: salvageData,
        borderColor: '#F59E0B', // Amber 500
        backgroundColor: 'transparent',
        borderDash: [6, 6],
        borderWidth: 1.5,
        pointRadius: 0,
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
            const pctOfInitial = ((val / initialPrice) * 100).toFixed(1);
            return ` ${label}: ${formatCurrency(val, currency)} (${pctOfInitial}% del inicial)`;
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
    <div className="h-[340px] w-full">
      <Line data={data} options={options} />
    </div>
  );
};
