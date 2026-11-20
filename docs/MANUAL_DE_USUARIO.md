# REGISTRO DE PROPIEDAD INTELECTUAL Y GUÍA DE OPERACIÓN TÉCNICA
## MANUAL DE USUARIO Y FUNCIONAMIENTO OPERATIVO — AUTOVALUA PRO

---

**INFORMACIÓN FORMAL DEL REGISTRO**
* **Nombre Comercial del Software:** AutoValua Pro — Sistema Actuarial, Económico y Administrativo de Devaluación Vehicular (AutoValua Pro Valuation & Depreciation Suite)
* **Autor y Creador de la Obra:** Daniel Vick
* **Versión del Software:** 2.5.0 (Release Oficial de Producción)
* **Clasificación del Software:** Aplicación Web de Simulación Financiera, Peritaje de Activos Móviles y Cálculo Actuarial de Devaluación
* **Fecha de Documentación:** Noviembre de 2026
* **Licencia y Régimen Legal:** Derechos Reservados del Autor / Registro de Soporte Lógico DNDA (Ley 23 de 1982, Decisión Andina 351 de 1993 y Decreto 1360 de 1989)
* **Marco Normativo y Regulatorio:** Normas Internacionales de Información Financiera (NIIF / NIC 16), Estatuto Tributario Colombiano (Art. 137 E.T.), Guía Oficial de Valores Fasecolda y Resoluciones MinTransporte / Superintendencia de Industria y Comercio (SIC).

---

## 1. INTRODUCCIÓN Y PROPÓSITO INSTITUCIONAL

El presente **Manual de Usuario** constituye la guía oficial y exhaustiva de operación del software **AutoValua Pro**. Desarrollado como una plataforma de grado pericial y financiero para directores financieros (CFOs), administradores de flotas, peritos avaluadores, concesionarios, economistas y usuarios particulares exigentes, el sistema permite evaluar, modelar y proyectar la pérdida de capital, el costo por kilómetro y el Costo Total de Propiedad (TCO) de cualquier vehículo automotor con base en estándares actuariales, matemáticos y tributarios reconocidos internacionalmente.

La suite integra:
1. **Asesor Inteligente por Presupuesto:** Algoritmo de recomendación que analiza el mercado colombiano para sugerir vehículos en el rango de inversión del usuario, priorizando modelos de mayor liquidez comercial, menor tasa de devaluación y alta rotación en portales de usados.
2. **Motor Actuarial Multimodelo:** Implementación de cinco paradigmas matemáticos de devaluación (Decaimiento Continuo Exponencial, Decaimiento Discreto Compuesto, Tablas Oficiales Fasecolda, Línea Recta NIIF NIC 16 y Doble Saldo Decreciente DDB).
3. **Simulador de Desgaste Multivariable:** Ponderación rigurosa de factores reales de uso (kilometraje vs estándar de 15.000 km/año, historial de siniestros, calidad de mantenimiento preventivo, destino de uso y tecnología de motorización).
4. **Curva de Terborgh y Costo Total de Propiedad (TCO):** Determinación actuarial del año óptimo de reemplazo o desinversión del automotor mediante el punto mínimo de la curva de Costo Medio Anual Acumulado ($AAC = \frac{TCO}{t}$), eliminando matemáticamente cualquier doble conteo de depreciación.
5. **Comparador Multi-Vehículo Simultáneo:** Evaluación gráfica y tabular sincronizada de hasta cuatro unidades vehiculares en horizontes de 3 a 10 años.
6. **Explorador de Tablas Oficiales SIC / Fasecolda:** Catálogo calibrado de 51 vehículos representativos del mercado nacional con retenciones históricas a 10 años.
7. **Generador de Dictámenes Periciales Imprimibles y Exportación CSV:** Emisión de dictámenes formales de valuación con validez administrativa y exportación de matrices numéricas sanitizadas contra ataques de inyección de fórmulas (RFC 4180).

---

## 2. ESTRUCTURA Y NAVEGACIÓN DE LA INTERFAZ DE USUARIO

La interfaz de usuario ha sido concebida bajo la filosofía de diseño *Fintech Analytical Workbench* (inspirada en terminales financieras institucionales como Bloomberg y sistemas de alta densidad de información como Linear y Supabase), con paleta oscura *Slate/Canvas* (`#090D16`), acentos semánticos de precisión (Esmeralda para retención y valor positivo, Ámbar para advertencias de mantenimiento y Terborgh, Rosa para pérdida neta de capital y Cian para curvas matemáticas) y cifras numéricas con tipografía monoespaciada tabular (`tabular-nums`) para evitar oscilaciones visuales.

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
|                                              AUTOVALUA PRO — PANEL SUPERIOR INSTITUCIONAL                                              |
|  [Logo AutoValua Pro v2.5]  [Moneda: COP / USD]  [📥 Exportar CSV]  [🖨️ Dictamen Pericial]  [🔄 Restablecer]                               |
+---------------------------------------------------------------------------------------------------------------------------------------+
|  BARRA DE NAVEGACIÓN PRINCIPAL:                                                                                                       |
|  [🎯 Asesor por Presupuesto]  [🧮 Valuador & Proyección]  [📊 Comparador Multi-Vehículo]  [🗄️ Tablas Oficiales]  [📘 Fundamentos y Teoría] |
+---------------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                       |
|  ZONA PRINCIPAL DE TRABAJO (PANEL DINÁMICO SEGÚN PESTAÑA ACTIVA):                                                                     |
|                                                                                                                                       |
|  +-------------------------------------------------------------+-------------------------------------------------------------------+  |
|  |  PANEL DE ENTRADA Y PARÁMETROS                              |  DASHBOARD DE RESULTADOS Y PROYECCIÓN                             |  |
|  |  - Presupuesto / Precio Adquisición (V0)                    |  - Tarjeta de Honor / Recomendación Comercial Destacada           |  |
|  |  - Parámetros de Devaluación (d1, d, λ, Salvamento)         |  - Gráfico de Curva de Decaimiento / Terborgh (Chart.js)          |  |
|  |  - Desgaste (Km/año, Siniestros, Mantenimiento, Uso)        |  - KPIs Actuariales: Nominal, Deflactado, Costo/km, Pérdida/mes   |  |
|  |  - Costos OpEx y TCO (Seguros, Impuestos, Manto, Nafta)     |  - Matriz Anual Tabular Año a Año (1 a 10 años)                   |  |
|  +-------------------------------------------------------------+-------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. GUÍA DE OPERACIÓN PASO A PASO POR MÓDULOS

### 3.1 Módulo 1: Asesor Inteligente por Presupuesto (`🎯 Asesor por Presupuesto`)

Este módulo opera como la **función inicial de asesoría de compra**. Permite a cualquier usuario ingresar el monto total de dinero que desea invertir y obtener al instante la mejor recomendación vehicular del mercado colombiano, evaluando liquidez de reventa y devaluación estimada.

#### Procedimiento de Operación:
1. **Ingreso del Presupuesto:** En el campo principal, digite el presupuesto disponible en moneda local (ej. `$120.000.000 COP`) o seleccione la moneda en USD desde la cabecera. El sistema aplica separador de miles dinámico en tiempo real.
2. **Uso de Presets Comerciales:** Puede hacer clic sobre cualquiera de los 8 botones de presupuestos estándar del mercado colombiano:
   - `$55M`: Vehículos económicos y urbanos de entrada.
   - `$75M`: Sedanes familiares y crossovers compactos.
   - `$95M`: SUVs de entrada y compactos modernos.
   - `$120M`: SUVs líderes en ventas nacionales (Mazda CX-30, Renault Duster, Chevrolet Tracker).
   - `$140M`: Híbridos líderes (Toyota Corolla Cross HEV, Kia Niro HEV).
   - `$175M`: SUVs medianas familiares y vehículos híbridos enchufables (PHEV).
   - `$240M`: Pick-ups 4x4 diésel de trabajo pesado (Toyota Hilux, Nissan Frontier, Ford Ranger).
   - `$380M+`: Vehículos de alta retención, gama alta y blindaje (Toyota Land Cruiser Prado TX-L, LC300).
3. **Ajuste de Tolerancia:** Seleccione la ventana de tolerancia de búsqueda ($\pm 10\%$, $\pm 15\%$, $\pm 20\%$, $\pm 25\%$). La interfaz indicará en tiempo real el rango exacto en millones de pesos evaluado.
4. **Filtros por Segmento y Combustible:** Si tiene un requerimiento específico, filtre por carrocería (Hatchback, Sedán, SUV Compacta, SUV Mediana, Pick-Up 4x4, Eléctrico/Híbrido, Premium) o tipo de combustible (Gasolina, Diésel, Híbrido, Eléctrico).
5. **Criterio de Priorización:**
   - **Más Comercial (Reventa Rápida):** Pondera al máximo el volumen de ventas en Colombia, el puesto de rotación comercial y los días promedio de reventa (10 a 22 días).
   - **Menor Devaluación:** Pondera la menor tasa de decaimiento anual $d$ y la mayor retención de capital a 3 y 5 años.
   - **Menor TCO & Ahorro:** Favorece tecnologías híbridas y eléctricas con exención de Pico y Placa y menor costo por km.
6. **Lectura de la Recomendación Principal:**
   - **Tarjeta de Honor:** Exhibe marca, línea, año modelo (2025 ref.), categoría, motorización y diferencial de precio frente al presupuesto ingresado.
   - **¿Por qué se recomienda este vehículo?:** Cuatro pilares explicativos que justifican la recomendación técnica y financiera:
     * *Demanda Comercial:* Puesto de ventas y velocidad de venta en vitrina.
     * *Menor Devaluación:* Comparativa de tasa de decaimiento vs promedio del segmento con estimación del ahorro anual en pesos.
     * *Economía y Repuestos:* Costo por kilómetro en combustible y facilidad de consecución de autopartes en Colombia.
     * *Fiabilidad Mecánica:* Calificación de confiabilidad sobre 10 según registros de taller.
   - **Análisis de Devaluación:** Tablero interactivo con valor nominal al año objetivo, pérdida neta de capital, costo por km, costo mensual, TCO acumulado y año óptimo de venta (Terborgh), acompañado de la tira de retención oficial del año 1 al 10.
7. **Acciones Directas:**
   - **Botón `⚡ Cargar en el Valuador Actuarial Completo`:** Transfiere el vehículo recomendado con todos sus parámetros operativos a la calculadora temporal para ajustar kilometraje, seguros y visualizar gráficos detallados.
   - **Botón `➕ Añadir al Comparador Multi-Vehículo`:** Añade la unidad al comparador de flotas.
   - **Alternativas Destacadas:** El sistema muestra en la parte inferior las 2 o 3 mejores alternativas en ese mismo rango de precio.

---

### 3.2 Módulo 2: Valuador Actuarial & Proyección Temporal (`🧮 Valuador`)

Permite modelar de forma exhaustiva la devaluación técnica y contable de un vehículo específico a lo largo de un horizonte de 10 a 20 años.

#### Panel de Parámetros (Columna Izquierda):
1. **Especificaciones del Automotor:**
   - Marca, Línea/Versión, Año Modelo y Tipo de Motorización (Gasolina, Diésel, Híbrido, Eléctrico).
   - Precio de Adquisición o 0 km ($V_0$). Incluye botón directo *"Ver autos más comerciales recomendados para este precio"* para abrir el asesor en cualquier momento.
2. **Parámetros de Devaluación Teórica:**
   - *Devaluación 1er Año (Shock de Concesionario):* Deslizador de 5% a 35% que modela la pérdida inmediata al salir de vitrina e inscribirse en el RUNT.
   - *Tasa Anual de Decaimiento Post-Año 1 ($d$):* Tasa de amortización anual estándar de 4% a 25%.
   - *Valor de Salvamento Residual (Scrap Value):* Porcentaje de rescate final del activo (5% a 30%).
   - *Selector de los 5 Modelos Teóricos:*
     * **Decaimiento Continuo ($e^{-\lambda t}$):** Modela la pérdida continua de valor mediante ecuaciones diferenciales instantáneas con $\lambda = -\ln(1 - d)$.
     * **Discreto Compuesto ($(1 - d)^t$):** Modelo de interés compuesto inverso año a año.
     * **Tabla Fasecolda:** Indexa las curvas empíricas del baremo oficial colombiano.
     * **Línea Recta NIC 16:** Depreciación contable fiscal uniforme a 10 años.
     * **Doble Saldo Decreciente DDB:** Depreciación acelerada para fines tributarios.
3. **Factores de Desgaste y Condición Operativa:**
   - *Kilometraje Anual Promedio:* Deslizador de 3.000 a 45.000 km/año. El sistema penaliza progresivamente el valor comercial si supera la media colombiana de 15.000 km/año (+8% si está guardado, hasta -28% por uso intensivo).
   - *Mantenimiento:* Excelente (concesionario oficial), Bueno (preventivo), Regular (reactivo) o Deficiente.
   - *Tipo de Operación:* Particular/Familiar, Corporativo/Flota, Carga Liviana o Transporte/Plataformas.
   - *Historial de Siniestralidad:* Sin siniestros (pintura original), Golpe menor reparado, Siniestro medio con cambio de piezas o Daño estructural severo.
4. **Costos Administrativos & Operación (TCO):**
   - Seguro todo riesgo anual, Impuesto vehicular anual (MinHacienda), Costo de mantenimiento base, Inflación anual de mantenimiento por envejecimiento mecánico, Costo de combustible por km, Tasa de inflación esperada y Escudo fiscal deducible de renta.

#### Dashboard de Resultados y Visualización (Columna Derecha):
1. **Horizonte de Evaluación:** Deslizador temporal para evaluar el vehículo exactamente a los 0 km (nuevo), 1, 2, 3... hasta 20 años.
2. **Métricas Clave (KPIs):**
   - *Precio Proyectado Nominal:* Valor comercial de reventa en plaza.
   - *Precio Real Deflactado:* Valor en moneda constante ajustado por inflación.
   - *Pérdida Neta de Capital:* Depreciación acumulada en pesos y porcentaje.
   - *Costo de Devaluación por Km:* Impacto de pérdida de valor por cada kilómetro recorrido.
   - *Costo Mensual de Pérdida:* Gasto oculto mensual por depreciación.
   - *Año Óptimo de Reemplazo:* Punto de equilibrio de la Curva de Terborgh.
3. **Vistas Analíticas:**
   - **Curva de Decaimiento:** Gráfica interactiva de 4 líneas (Comercial Nominal, Real Deflactado, Libros NIC 16 y Valor de Salvamento).
   - **Curva de Terborgh & TCO:** Visualización del Costo Total de Propiedad y el Costo Medio Anual Acumulado ($AAC$). Permite identificar con precisión el año donde el costo creciente de taller supera la amortización de una unidad nueva.
   - **Matriz Anual Tabular:** Tabla auditable con desglose año a año de precios, retenciones, costos por km, gastos operativos acumulados y valor contable.

---

### 3.3 Módulo 3: Comparador Multi-Vehículo (`📊 Comparador Multi-Vehículo`)

Diseñado para decisiones de compra comparativa y gerencia de flotas:
- Permite comparar hasta **4 vehículos simultáneamente**.
- **Tres Modos de Métrica:**
  1. *% Retención de Capital:* Compara qué vehículo retiene mejor su valor porcentual en el tiempo.
  2. *Precio Comercial Nominal:* Evolución del precio de reventa en dinero real.
  3. *Costo Total de Propiedad (TCO):* Compara el impacto financiero global (pérdida de capital + combustible + seguros + impuestos + mantenimientos).
- **Control de Horizonte:** Ajustable a 3, 5, 7 o 10 años con sincronización inmediata de trazas y leyendas.
- **Botón `+ Cargar Preajuste Oficial`:** Permite incorporar directamente cualquier modelo de la base Fasecolda.

---

### 3.4 Módulo 4: Tablas Oficiales SIC / Fasecolda (`🗄️ Tablas Oficiales`)

Constituye el repositorio de referencia actuarial de la aplicación:
- Contiene **51 vehículos oficiales** representativos de todas las marcas y gamas de Colombia.
- **Buscador en Tiempo Real:** Filtra por marca, línea o código oficial Fasecolda.
- **Filtros Combinados:** Por categoría y tipo de combustible.
- **Tabla Comparativa de Retención:** Muestra las tasas de retención a 1, 2, 3, 5 y 10 años, tasa de decaimiento anual promedio y calificación de liquidez de mercado (`Alta`, `Media`, `Baja`).
- **Botón `Valuar`:** Transfiere el registro seleccionado directamente al Valuador Actuarial con todos sus parámetros operativos precalculados.

---

### 3.5 Módulo 5: Fundamentos Económicos & Fórmulas (`📘 Fundamentos y Teoría`)

Manual conceptual integrado en la plataforma que detalla las ecuaciones matemáticas, leyes de decaimiento continuo, formulación de Terborgh, normas tributarias del Estatuto Tributario y diferencias entre valor comercial de mercado y valor contable en libros bajo NIIF NIC 16.

---

### 3.6 Funcionalidades Globales: Exportación y Dictamen Pericial

1. **Exportación a CSV / Excel (`📥 Exportar Excel/CSV`):**
   - Genera un archivo CSV con codificación UTF-8 y marca BOM (`\uFEFF`) para apertura nativa e inmediata en Microsoft Excel sin problemas de tildes o caracteres especiales.
   - **Sanitización Estricta Anti-Inyección:** Todo valor que comience por caracteres de fórmula (`=`, `+`, `-`, `@`) es prefijado con un apóstrofe para neutralizar vulnerabilidades de ejecución arbitraria en hojas de cálculo.
2. **Dictamen Pericial de Avalúo (`🖨️ Dictamen Pericial`):**
   - Abre un informe formal de avalúo con membrete pericial, código de radicación único, parámetros técnicos de inspección, justificación actuarial y tabla de amortización.
   - Compatible con impresión física y exportación a PDF vectorial mediante el comando de impresión del navegador.
3. **Selector de Moneda (COP / USD):**
   - Alterna instantáneamente toda la aplicación entre Pesos Colombianos (COP) y Dólares Americanos (USD), adaptando los formatos numéricos y símbolos de divisa.

---

## 4. RESOLUCIÓN DE DUDAS Y RECOMENDACIONES DE OPERACIÓN

| Pregunta / Escenario | Causa Técnica | Solución / Recomendación |
| :--- | :--- | :--- |
| **¿Por qué la tabla Fasecolda no coincide exactamente con mi vehículo?** | Ha seleccionado el modelo *Tabla Fasecolda* pero ingresó un vehículo particular no indexado. | La plataforma activa automáticamente el decaimiento compuesto como fallback no destructivo. Se recomienda seleccionar un vehículo del catálogo oficial en el menú desplegable. |
| **¿Por qué el modelo de Línea Recta NIC 16 no cambia con el kilometraje?** | Cumplimiento del principio contable NIIF NIC 16. | Los modelos contables y fiscales son determinísticos y por norma no dependen del desgaste comercial del mercado automotor. |
| **¿Cómo sé cuándo debo vender o cambiar el carro?** | Análisis de ciclo de vida del activo. | Consulte el **Año Óptimo de Reemplazo (Terborgh)** en el Valuador o en el Asesor por Presupuesto. En ese año el costo medio anual acumulado alcanza su punto mínimo. |
| **¿Cómo puedo simular un vehículo nuevo de vitrina?** | Evaluación a 0 km. | Desplace el deslizador de edad a la posición `0 km`. El sistema mostrará el 100% del valor de factura con $0 de pérdida de capital. |
