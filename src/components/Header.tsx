import React from 'react';
import { 
  Sparkles,
  Calculator, 
  GitCompare, 
  Database, 
  BookOpen, 
  Printer, 
  Download, 
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'recommender' | 'calculator' | 'comparison' | 'database' | 'theory';
  setActiveTab: (tab: 'recommender' | 'calculator' | 'comparison' | 'database' | 'theory') => void;
  currency: 'COP' | 'USD';
  setCurrency: (c: 'COP' | 'USD') => void;
  onPrintReport: () => void;
  onExportCSV: () => void;
  onResetVehicle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onPrintReport,
  onExportCSV,
  onResetVehicle
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-4">
          
          {/* Logo & Identidad Institucional */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-slate-100 tracking-tight">AutoValua<span className="text-emerald-400 font-bold">Pro</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wide bg-slate-800 text-slate-300 border border-slate-700">v2.5 ACTUARIAL</span>
              </div>
              <p className="text-xs text-slate-400">
                Sistema Económico & Administrativo de Devaluación Vehicular • SIC / Fasecolda & NIC 16
              </p>
            </div>
          </div>

          {/* Acciones Rápidas Superiores */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Selector de Moneda */}
            <div className="flex items-center bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
              <button
                onClick={() => setCurrency('COP')}
                className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-mono font-medium ${
                  currency === 'COP'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                COP ($)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded transition-[transform,background-color,color] duration-100 active:scale-[0.97] ease-out font-mono font-medium ${
                  currency === 'USD'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Exportar CSV */}
            <button
              onClick={onExportCSV}
              title="Exportar proyección a archivo CSV compatible con Excel"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-[transform,background-color] duration-150 active:scale-[0.98] ease-out"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Exportar Excel/CSV</span>
            </button>

            {/* Dictamen Pericial Imprimible */}
            <button
              onClick={onPrintReport}
              title="Generar dictamen pericial de valoración imprimible / PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-medium transition-[transform,background-color] duration-150 active:scale-[0.98] ease-out shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Dictamen Pericial</span>
            </button>

            {/* Reiniciar Valores */}
            <button
              onClick={onResetVehicle}
              title="Restablecer parámetros a valores base predeterminados"
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-[transform,background-color] duration-150 active:scale-[0.95] ease-out"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de Navegación por Pestañas */}
        <nav className="flex space-x-1 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('recommender')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ${
              activeTab === 'recommender'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Asesor por Presupuesto</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Valuador & Proyección Temporal</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <GitCompare className="h-4 w-4" />
            <span>Comparador Multi-Vehículo</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Tablas Oficiales SIC / Fasecolda</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors duration-150 ease-out border-b-2 whitespace-nowrap ${
              activeTab === 'theory'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Fundamentos Económicos & Fórmulas</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
