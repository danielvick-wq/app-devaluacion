import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'positive' | 'negative' | 'neutral' | 'warning';
  trendText?: string;
  badge?: string;
  footnote?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendText,
  badge,
  footnote
}) => {
  const getTrendStyle = () => {
    switch (trend) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 relative overflow-hidden transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-700 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
            {title}
          </span>
          {Icon && (
            <div className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {subValue}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {(trendText || badge || footnote) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {trendText && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border ${getTrendStyle()}`}>
              {trendText}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {badge}
            </span>
          )}
          {footnote && (
            <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={footnote}>
              {footnote}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
