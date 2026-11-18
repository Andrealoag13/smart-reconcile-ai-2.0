// Datos de ejemplo de las pantallas de Fase 2 (Figma: página "Fase 2 · Nuevas pantallas").
// Columnas según la PPT "Smart Reconcile AI - Visión Producto" (slides 4, 21, 22 y 23).

export type Kpi = {
  id: string;
  etiqueta: string;
  valor: string;
  detalle: string;
  tono: "neutral" | "success" | "warning" | "flag" | "danger";
  icono: "bank" | "check" | "minus" | "clock" | "alert" | "paperclip" | "arrow";
};

/* ───────── Comprobantes ───────── */

export type EstadoComprobante = "Verificado" | "Pendiente" | "Duplicado" | "Sin identificar";

export type Comprobante = {
  id: string;
  fecha: string;
  hora: string;
  beneficiario: string;
  cuit: string;
  bancoOrigen: string;
  bancoDestino: string;
  monto: string;
  estado: EstadoComprobante;
  /** Movimiento del Monitor al que corresponde (para abrir su detalle o conciliarlo). */
  movId: string;
};

export const COMPROBANTES: Comprobante[] = [
  { id: "32234", fecha: "14/10", hora: "17:20", beneficiario: "Agroinsumos Pampa SA", cuit: "30-65432198-7", bancoOrigen: "Macro", bancoDestino: "BBVA", monto: "$2.104.900,00", estado: "Verificado", movId: "m3" },
  { id: "32241", fecha: "15/10", hora: "09:12", beneficiario: "Distribuidora Andina SA", cuit: "30-71234567-9", bancoOrigen: "Nación", bancoDestino: "Galicia", monto: "$1.250.000,00", estado: "Verificado", movId: "m1" },
  { id: "32258", fecha: "15/10", hora: "10:40", beneficiario: "Logística del Sur SRL", cuit: "30-70998877-1", bancoOrigen: "Galicia", bancoDestino: "Santander", monto: "$486.320,50", estado: "Verificado", movId: "m2" },
  { id: "32266", fecha: "15/10", hora: "18:05", beneficiario: "Ferretería Industrial Norte", cuit: "30-71122334-5", bancoOrigen: "Galicia", bancoDestino: "Galicia", monto: "$98.450,00", estado: "Pendiente", movId: "m5" },
  { id: "32270", fecha: "16/10", hora: "08:31", beneficiario: "Textil Mendoza SRL", cuit: "30-71555666-3", bancoOrigen: "Galicia", bancoDestino: "BBVA", monto: "$64.210,75", estado: "Duplicado", movId: "m7" },
  { id: "32281", fecha: "16/10", hora: "11:02", beneficiario: "Sin identificar", cuit: "Comprobante sin CUIT", bancoOrigen: "Santander", bancoDestino: "Santander", monto: "$730.000,00", estado: "Sin identificar", movId: "m4" },
  { id: "32295", fecha: "16/10", hora: "14:47", beneficiario: "Grupo Cuyo SRL", cuit: "30-71888999-0", bancoOrigen: "Supervielle", bancoDestino: "Galicia", monto: "$120.000,00", estado: "Pendiente", movId: "m9" },
  { id: "32302", fecha: "17/10", hora: "09:15", beneficiario: "Constructora Patagonia SA", cuit: "30-70011223-4", bancoOrigen: "BBVA", bancoDestino: "Galicia", monto: "$1.875.300,00", estado: "Verificado", movId: "m8" },
];

export const TOTAL_COMPROBANTES = 48;
/** Valores base de los indicadores (los cambios de la demo se suman o restan sobre estos). */
export const KPI_COMPROBANTES_BASE = { total: 48, verificados: 41, pendientes: 4, noIdentificados: 3 };

/* ───────── Cartera de clientes ───────── */

export type EstadoCuenta = "Al día" | "Con vencidos" | "Sin saldo pendiente";

export type Cliente = {
  razonSocial: string;
  codigo: string;
  cuit: string;
  analista: string;
  importePendiente: string;
  estado: EstadoCuenta;
};

export const CLIENTES: Cliente[] = [
  { razonSocial: "Distribuidora Andina SA", codigo: "10312", cuit: "30-71234567-9", analista: "Lucía Fernández", importePendiente: "$3.480.000,00", estado: "Al día" },
  { razonSocial: "Logística del Sur SRL", codigo: "10377", cuit: "30-70998877-1", analista: "Martín Rossi", importePendiente: "$972.640,00", estado: "Al día" },
  { razonSocial: "Agroinsumos Pampa SA", codigo: "10458", cuit: "30-65432198-7", analista: "Lucía Fernández", importePendiente: "$2.104.900,00", estado: "Al día" },
  { razonSocial: "Ferretería Industrial Norte", codigo: "10503", cuit: "30-71122334-5", analista: "Valentina Gómez", importePendiente: "$98.450,00", estado: "Con vencidos" },
  { razonSocial: "Supermercados El Faro SA", codigo: "10521", cuit: "30-50001234-2", analista: "Diego Herrera", importePendiente: "$5.210.000,00", estado: "Al día" },
  { razonSocial: "Grupo Cuyo SRL", codigo: "10566", cuit: "30-71888999-0", analista: "Valentina Gómez", importePendiente: "$185.400,00", estado: "Con vencidos" },
  { razonSocial: "Frigorífico Litoral SA", codigo: "10602", cuit: "30-60123456-8", analista: "Diego Herrera", importePendiente: "$842.150,00", estado: "Con vencidos" },
  { razonSocial: "Textil Mendoza SRL", codigo: "10614", cuit: "30-71555666-3", analista: "Martín Rossi", importePendiente: "$0,00", estado: "Sin saldo pendiente" },
];

export const TOTAL_CLIENTES = 52;

export const KPIS_CARTERA: Kpi[] = [
  { id: "saldo", etiqueta: "Clientes con saldo pendiente", valor: "37", detalle: "de 52 clientes en cartera", tono: "neutral", icono: "bank" },
  { id: "importe", etiqueta: "Importe pendiente de cartera", valor: "$18.642.310,00", detalle: "suma de facturas abiertas", tono: "warning", icono: "minus" },
  { id: "vencidos", etiqueta: "Clientes con vencidos", valor: "6", detalle: "$2.315.400,00 con vencimiento superado", tono: "danger", icono: "alert" },
];

/* ───────── Pagos esperados ───────── */

export type PagoEsperado = {
  id: string;
  razonSocial: string;
  cuit: string;
  analista: string;
  fecha: string;
  importe: string;
  estado: "Pendiente" | "Aplicado";
  fechaAplicacion: string;
};

export const PAGOS: PagoEsperado[] = [
  { id: "PE-2026-0412", razonSocial: "Distribuidora Andina SA", cuit: "30-71234567-9", analista: "Lucía Fernández", fecha: "15/10/2026", importe: "$1.250.000,00", estado: "Aplicado", fechaAplicacion: "16/10/2026" },
  { id: "PE-2026-0415", razonSocial: "Logística del Sur SRL", cuit: "30-70998877-1", analista: "Martín Rossi", fecha: "15/10/2026", importe: "$486.320,50", estado: "Pendiente", fechaAplicacion: "—" },
  { id: "PE-2026-0418", razonSocial: "Agroinsumos Pampa SA", cuit: "30-65432198-7", analista: "Lucía Fernández", fecha: "14/10/2026", importe: "$1.402.600,00", estado: "Pendiente", fechaAplicacion: "—" },
  { id: "PE-2026-0419", razonSocial: "Agroinsumos Pampa SA", cuit: "30-65432198-7", analista: "Lucía Fernández", fecha: "14/10/2026", importe: "$702.300,00", estado: "Pendiente", fechaAplicacion: "—" },
  { id: "PE-2026-0421", razonSocial: "Supermercados El Faro SA", cuit: "30-50001234-2", analista: "Diego Herrera", fecha: "13/10/2026", importe: "$3.520.000,00", estado: "Aplicado", fechaAplicacion: "14/10/2026" },
  { id: "PE-2026-0424", razonSocial: "Ferretería Industrial Norte", cuit: "30-71122334-5", analista: "Valentina Gómez", fecha: "13/10/2026", importe: "$98.450,00", estado: "Pendiente", fechaAplicacion: "—" },
  { id: "PE-2026-0427", razonSocial: "Constructora Patagonia SA", cuit: "30-70011223-4", analista: "Camila Ruiz", fecha: "12/10/2026", importe: "$1.875.300,00", estado: "Aplicado", fechaAplicacion: "13/10/2026" },
  { id: "PE-2026-0430", razonSocial: "Grupo Cuyo SRL", cuit: "30-71888999-0", analista: "Valentina Gómez", fecha: "11/10/2026", importe: "$185.400,00", estado: "Pendiente", fechaAplicacion: "—" },
];

export const TOTAL_PAGOS = 52;

export const KPIS_PAGOS: Kpi[] = [
  { id: "esperados", etiqueta: "Pagos esperados", valor: "52", detalle: "registrados para octubre", tono: "neutral", icono: "bank" },
  { id: "pendientes", etiqueta: "Pagos pendientes", valor: "11", detalle: "todavía sin aplicar", tono: "warning", icono: "minus" },
  { id: "importePend", etiqueta: "Importe pendiente de aplicación", valor: "$4.218.600,00", detalle: "de 11 pagos pendientes", tono: "flag", icono: "clock" },
  { id: "aplicado", etiqueta: "Importe aplicado", valor: "$14.423.710,00", detalle: "de 41 pagos aplicados", tono: "success", icono: "check" },
];

/* ───────── Extractos bancarios ───────── */

export type Extracto = {
  nombre: string;
  cargado: string;
  banco: string;
  cuenta: string;
  periodo: string;
  moneda: string;
  movimientos: string;
  importe: string;
  pendiente: string;
  estado: "Conciliado" | "Con pendientes";
};

export const EXTRACTOS: Extracto[] = [
  { nombre: "BBVA_cta4471_octubre.xlsx", cargado: "15/10/2026 08:12", banco: "BBVA", cuenta: "Cta. Cte. ···4471", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "64", importe: "$5.912.300,00", pendiente: "$730.000,00", estado: "Con pendientes" },
  { nombre: "Galicia_cc2210_oct_q1.pdf", cargado: "16/10/2026 07:45", banco: "Galicia", cuenta: "Cta. Cte. ···2210", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "58", importe: "$4.386.140,50", pendiente: "$1.919.230,00", estado: "Con pendientes" },
  { nombre: "Santander_cta0937_oct.csv", cargado: "16/10/2026 08:02", banco: "Santander", cuenta: "Cta. Cte. ···0937", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "41", importe: "$3.105.900,00", pendiente: "$0,00", estado: "Conciliado" },
  { nombre: "Macro_cc5518_oct.xlsx", cargado: "15/10/2026 18:30", banco: "Macro", cuenta: "Cta. Cte. ···5518", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "37", importe: "$2.640.750,00", pendiente: "$0,00", estado: "Conciliado" },
  { nombre: "Nacion_cta3302_oct.pdf", cargado: "16/10/2026 09:10", banco: "Nación", cuenta: "Cta. Cte. ···3302", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "29", importe: "$2.218.400,00", pendiente: "$0,00", estado: "Conciliado" },
  { nombre: "ICBC_cc7741_oct.xlsx", cargado: "16/10/2026 09:25", banco: "ICBC", cuenta: "Cta. Cte. ···7741", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "18", importe: "$1.412.660,00", pendiente: "$0,00", estado: "Conciliado" },
  { nombre: "Supervielle_cta1185_oct.csv", cargado: "16/10/2026 10:02", banco: "Supervielle", cuenta: "Caja Ahorro ···1185", periodo: "01/10 – 15/10/2026", moneda: "ARS", movimientos: "22", importe: "$1.064.000,00", pendiente: "$95.000,00", estado: "Con pendientes" },
  { nombre: "BBVA_cta4471_septiembre.xlsx", cargado: "01/10/2026 08:05", banco: "BBVA", cuenta: "Cta. Cte. ···4471", periodo: "16/09 – 30/09/2026", moneda: "ARS", movimientos: "49", importe: "$4.065.999,50", pendiente: "$0,00", estado: "Conciliado" },
];

export const TOTAL_EXTRACTOS = 12;

export const KPIS_EXTRACTOS: Kpi[] = [
  { id: "extractos", etiqueta: "Extractos", valor: "12", detalle: "de 7 bancos y 8 cuentas", tono: "neutral", icono: "bank" },
  { id: "movimientos", etiqueta: "Movimientos de ingreso", valor: "318", detalle: "309 ya conciliados", tono: "neutral", icono: "arrow" },
  { id: "ingresos", etiqueta: "Importe total de ingresos", valor: "$24.806.150,00", detalle: "acreditado en el período", tono: "success", icono: "check" },
  { id: "pendiente", etiqueta: "Pendiente de conciliación", valor: "$2.744.230,00", detalle: "9 movimientos sin conciliar", tono: "warning", icono: "minus" },
];
