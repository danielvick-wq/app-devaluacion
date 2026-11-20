import React from 'react';
import { 
  BookOpen, 
  TrendingDown, 
  Scale, 
  FileCheck2, 
  AlertCircle
} from 'lucide-react';

export const EconomicTheoryGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Encabezado Principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            Fundamentos de Economía, Finanzas & Administración del Activo Automotor
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tratado metodológico y teórico que fundamenta los algoritmos de cálculo, la ley de decaimiento exponencial, los estándares NIIF (NIC 16) y los modelos de reemplazo óptimo de activos de capital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sección 1: Ley de Decaimiento Exponencial */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <TrendingDown className="h-4 w-4" />
            <span>1. Ley de Decaimiento Exponencial Continuo</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 space-y-1">
            <p className="text-cyan-400 font-bold">Ecuación Diferencial Fundamental:</p>
            <p className="text-slate-300">dV/dt = -λ · V(t)</p>
            <p className="text-emerald-400 font-bold pt-1">Solución de Decaimiento Continuo:</p>
            <p className="text-slate-100 font-semibold">V(t) = V₀ · e^(-λ · t)</p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-0.5 font-sans">
              <p>• <strong>V₀</strong>: Valor de adquisición o precio de factura 0 km.</p>
              <p>• <strong>λ (lambda)</strong>: Tasa instantánea de devaluación continua = -ln(1 - d).</p>
              <p>• <strong>d</strong>: Tasa anual compuesta equivalente (ej. 10% anual = 0.10).</p>
              <p>• <strong>t</strong>: Tiempo transcurrido en años (fraccionable en meses o días).</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            A diferencia de la depreciación contable lineal (que asume erróneamente que un bien pierde valor a un ritmo constante en pesos cada año), el valor de mercado real de un automóvil se comporta como un fenómeno no lineal: la pérdida monetaria es máxima en los primeros periodos y decrece exponencialmente a medida que el valor residual se aproxima al piso de salvamento.
          </p>
        </div>

        {/* Sección 2: El Shock de Salida de Concesionario */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>2. Efecto Concesionario & Asimetría de Información</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-amber-400">¿Por qué un vehículo pierde 15% - 25% al salir a la calle?</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              En economía, este fenómeno fue demostrado por George Akerlof (Premio Nobel 2001) en su ensayo <em>"The Market for Lemons"</em>. En el instante de la matrícula:
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1 font-sans">
              <li><strong>Pérdida de tributos no recuperables</strong>: IVA (19% en Colombia), impuesto al consumo y aranceles de importación.</li>
              <li><strong>Costos transaccionales y de matrícula</strong>: Gastos de placa, SOAT, impuestos de rodamiento y margen operativo de la red de concesionarios.</li>
              <li><strong>Riesgo de información asimétrica</strong>: El mercado de segunda mano descuenta una prima de incertidumbre ante la duda de por qué el dueño original revende un auto con cero kilómetros.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Por esta razón, nuestro motor actuarial aplica un modelo híbrido en dos fases: un shock de discontinuidad discreta en el año 1 ($t=1$), seguido de una función de decaimiento continuo amortiguado para $t &gt; 1$.
          </p>
        </div>

        {/* Sección 3: El Modelo de Terborgh y Año Óptimo de Reemplazo */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Scale className="h-4 w-4" />
            <span>3. Modelo de Reemplazo de Activos (George Terborgh)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            En administración de operaciones e ingeniería económica, el <strong>problema de reemplazo de equipo</strong> busca responder: <em>¿En qué año es financieramente óptimo sustituir un vehículo?</em>
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 space-y-1">
            <p className="text-emerald-400 font-semibold">Costo Medio Anual Acumulado (CMA):</p>
            <p className="text-slate-300">CMA(t) = [ Pérdida Capital Acum.(t) + Gastos Operativos Acum.(t) ] / t</p>
            <p className="text-[11px] text-slate-400 font-sans pt-1">
              • <strong>Fase Descendente (Años 1 a 4)</strong>: La depreciación inicial se diluye entre los años transcurridos y el costo de taller es mínimo.
            </p>
            <p className="text-[11px] text-slate-400 font-sans">
              • <strong>Punto Crítico (Año Óptimo)</strong>: Mínimo global de la curva en U.
            </p>
            <p className="text-[11px] text-slate-400 font-sans">
              • <strong>Fase Ascendente (Post-Año Óptimo)</strong>: Las averías correctivas, repuestos, pérdida de confiabilidad y consumos exceden el costo de amortizar una unidad nueva.
            </p>
          </div>
        </div>

        {/* Sección 4: Normativa Contable NIIF (NIC 16) vs Estatuto Tributario */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <FileCheck2 className="h-4 w-4" />
            <span>4. Normativa Contable NIIF (NIC 16) & Escudo Fiscal</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Desde la perspectiva de la contabilidad financiera corporativa, existe una dualidad estricta entre la norma fiscal y la norma financiera internacional:
          </p>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-0.5">Norma Fiscal Colombiana (Art. 137 E.T.):</span>
              <p className="text-slate-400 text-[11px]">
                Fija una tasa máxima de depreciación anual del 20% en línea recta (vida útil de 5 años), generando una deducción directa sobre la renta líquida imponible.
              </p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-0.5">Norma NIIF / IFRS (NIC 16 Propiedad, Planta y Equipo):</span>
              <p className="text-slate-400 text-[11px]">
                Exige estimar la <strong>vida útil económica real</strong> (usualmente 10 años para vehículos de pasajeros) y descontar el <strong>valor residual de salvamento</strong> (10% - 20%), reflejando el verdadero deterioro del potencial de servicio del bien.
              </p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-0.5">Escudo Fiscal (Tax Shield):</span>
              <p className="text-slate-400 text-[11px]">
                El gasto por depreciación contable genera un ahorro de tesorería equivalente a: <code>Ahorro = Depreciación_Deducible × Tarifa_Renta (35%)</code>.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
