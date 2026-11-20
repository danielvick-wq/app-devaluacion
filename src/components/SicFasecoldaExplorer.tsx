import React, { useState } from 'react';
import { FASECOLDA_SIC_DATABASE } from '../data/sicFasecoldaData';
import type { OfficialSicFasecoldaVehicle } from '../types/vehicle';
import { formatCurrency } from '../lib/depreciationEngine';
import { 
  Database, 
  Search, 
  Filter, 
  ArrowRight
} from 'lucide-react';

interface SicFasecoldaExplorerProps {
  onSelectVehicleForValuation: (v: OfficialSicFasecoldaVehicle) => void;
  currency: 'COP' | 'USD';
}

export const SicFasecoldaExplorer: React.FC<SicFasecoldaExplorerProps> = ({
  onSelectVehicleForValuation,
  currency
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');

  const categories = ['all', 'SUV Compacta', 'SUV Mediana', 'Sedán', 'Hatchback', 'Camioneta Pick-Up', 'Eléctrico/Híbrido', 'Premium', 'Utilitario'];

  const filteredVehicles = FASECOLDA_SIC_DATABASE.filter(item => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.line.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesFuel = selectedFuel === 'all' || item.fuelType === selectedFuel;

    return matchesSearch && matchesCategory && matchesFuel;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner Informativo Normativo */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Tablas Oficiales de Referencia: Fasecolda / SIC / MinTransporte
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          En el ordenamiento jurídico y financiero colombiano (Superintendencia de Industria y Comercio, DIAN y Ministerio de Transporte), la <strong>Guía de Valores Fasecolda</strong> constituye el baremo actuarial estándar para la determinación de valores comerciales asegurables, liquidación de siniestros, indemnizaciones y bases gravables del impuesto sobre vehículos automotores.
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            aria-label="Buscar vehículo por marca, línea o código"
            placeholder="Buscar por marca, línea o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filtro por Categoría */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              aria-label="Filtrar por categoría de automotor"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Combustible */}
          <select
            aria-label="Filtrar por tipo de motorización o combustible"
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos los combustibles</option>
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="hibrido">Híbrido</option>
            <option value="electrico">100% Eléctrico</option>
          </select>
        </div>
      </div>

      {/* Tabla de Base de Datos */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código / Modelo</th>
                <th className="py-3 px-3">Segmento</th>
                <th className="py-3 px-3 text-right">Precio 0 km Ref.</th>
                <th className="py-3 px-2 text-center">Año 1</th>
                <th className="py-3 px-2 text-center">Año 2</th>
                <th className="py-3 px-2 text-center">Año 3</th>
                <th className="py-3 px-2 text-center">Año 5</th>
                <th className="py-3 px-2 text-center">Año 10</th>
                <th className="py-3 px-3 text-right">Tasa Media</th>
                <th className="py-3 px-3 text-center">Liquidez</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredVehicles.map((item) => (
                <tr key={item.code} className="hover:bg-slate-800/40 text-slate-300 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium">
                    <span className="text-[10px] font-mono text-slate-400 block">{item.code}</span>
                    <span className="text-slate-100 font-bold block">{item.brand} {item.line}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{item.fuelType}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100">
                    {formatCurrency(item.referencePriceNew, currency)}
                  </td>
                  <td className="py-3 px-2 text-center text-emerald-400 font-semibold">
                    {item.historicalRetentionPct[0]}%
                  </td>
                  <td className="py-3 px-2 text-center text-emerald-400/90">
                    {item.historicalRetentionPct[1]}%
                  </td>
                  <td className="py-3 px-2 text-center text-cyan-400">
                    {item.historicalRetentionPct[2]}%
                  </td>
                  <td className="py-3 px-2 text-center text-amber-400 font-semibold">
                    {item.historicalRetentionPct[4]}%
                  </td>
                  <td className="py-3 px-2 text-center text-rose-400">
                    {item.historicalRetentionPct[9]}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200">
                    {item.typicalAnnualDecayPct}% / año
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      item.marketLiquidityScore === 'Alta' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.marketLiquidityScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectVehicleForValuation(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-medium font-sans transition-[transform,background-color] duration-150 active:scale-[0.95] ease-out shadow-sm"
                    >
                      <span>Valuar</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
