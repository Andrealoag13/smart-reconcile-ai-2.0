// Datos de ejemplo, tomados del diseño en Figma (página "Comparativa", bloque "Lo que proponemos").

export type EstadoConciliacion = "Conciliado" | "Pendiente" | "Excepción" | "Duplicado";
export type EstadoRecibo = "Aplicado" | "Solicitado" | "Error" | "Sin recibo";

export type Factura = {
  folio: string;
  vence: string;
  pendiente: string;
  trans?: string;
  cartera?: string;
  analista?: string;
  emision?: string;
};

export type Comentario = { autor: string; fecha: string; texto: string };

/** Contenido de las pestañas del detalle del movimiento que no sale de la fila. */
export type DetalleExtra = {
  notaConciliacion?: string;
  notaRecibo?: string;
  notaComprobantes?: string;
  notaCartera?: string;
  notas?: string[];
  estadoCuenta?: {
    sucursal: string;
    descripcion: string;
    referencia: string;
    concepto: string;
    cuentaOrigen: string;
    cuentaDestino: string;
    extracto: string;
  };
  comprobantes?: { registro: string; fechaPago: string; monto: string; factura: string; confianza: string }[];
  archivo?: { nombre: string; origen: string };
  fotoCartera?: string;
  recibo?: { numeroCliente: string; metodo: string; validaciones: string[] };
};

export type Motivo = {
  tipo: "Error ERP" | "Excepción" | "Duplicado";
  texto: string;
};

export type Movimiento = {
  id: string;
  bancoOrigen: string;
  bancoDestino: string;
  /** Nombres completos de los bancos, para el detalle. */
  bancoOrigenNombre: string;
  bancoDestinoNombre: string;
  fecha: string;
  fechaLarga: string;
  hora: string;
  razonSocial: string;
  cuit: string;
  monto: string;
  analista: string;
  estadoConciliacion: EstadoConciliacion;
  fechaConciliacion: string;
  horaConciliacion: string;
  montoComprobante: string;
  pendienteCartera: string;
  estadoRecibo: EstadoRecibo;
  fechaRecibo: string;
  horaRecibo: string;
  numeroRecibo: string;
  montoRecibo: string;
  /** En qué pantallas aparece. */
  enMonitor: boolean;
  motivo?: Motivo;
  /** Datos extra del detalle (solo donde el diseño los define). */
  comprobanteId?: string;
  procesado?: string;
  facturas?: Factura[];
  errorRecibo?: { titulo: string; texto: string; /** Texto de la franja de error del detalle. */ aviso?: string };
  comentarios?: Comentario[];
  detalle?: DetalleExtra;
};

export const ANALISTAS = [
  "Lucía Fernández",
  "Martín Rossi",
  "Valentina Gómez",
  "Diego Herrera",
  "Camila Ruiz",
];

const SIN = "—";

export const MOVIMIENTOS: Movimiento[] = [
  {
    id: "m1",
    bancoOrigen: "Nación", bancoDestino: "Galicia",
    bancoOrigenNombre: "Banco Nación", bancoDestinoNombre: "Banco Galicia",
    fecha: "15/10", fechaLarga: "15/10/2026", hora: "09:44",
    razonSocial: "Distribuidora Andina SA", cuit: "30-71234567-9", monto: "$1.250.000,00",
    analista: "Lucía Fernández",
    estadoConciliacion: "Conciliado", fechaConciliacion: "16/10", horaConciliacion: "11:16",
    montoComprobante: "$1.250.000,00", pendienteCartera: "$1.250.000,00",
    estadoRecibo: "Aplicado", fechaRecibo: "16/10", horaRecibo: "11:26",
    numeroRecibo: "R-104523", montoRecibo: "$1.250.000,00",
    enMonitor: true,
  },
  {
    id: "m2",
    bancoOrigen: "Galicia", bancoDestino: "Santander",
    bancoOrigenNombre: "Banco Galicia", bancoDestinoNombre: "Banco Santander",
    fecha: "15/10", fechaLarga: "15/10/2026", hora: "10:13",
    razonSocial: "Logística del Sur SRL", cuit: "30-70998877-1", monto: "$486.320,50",
    analista: "Martín Rossi",
    estadoConciliacion: "Conciliado", fechaConciliacion: "16/10", horaConciliacion: "11:16",
    montoComprobante: "$486.320,50", pendienteCartera: "$486.320,50",
    estadoRecibo: "Solicitado", fechaRecibo: "16/10", horaRecibo: "11:20",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: true,
  },
  {
    id: "m3",
    bancoOrigen: "Macro", bancoDestino: "BBVA",
    bancoOrigenNombre: "Banco Macro", bancoDestinoNombre: "BBVA",
    fecha: "14/10", fechaLarga: "14/10/2026", hora: "16:02",
    razonSocial: "Agroinsumos Pampa SA", cuit: "30-65432198-7", monto: "$2.104.900,00",
    analista: "Lucía Fernández",
    estadoConciliacion: "Conciliado", fechaConciliacion: "15/10", horaConciliacion: "09:30",
    montoComprobante: "$2.104.900,00", pendienteCartera: "$2.104.900,00",
    estadoRecibo: "Error", fechaRecibo: "15/10", horaRecibo: "09:41",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: true,
    motivo: {
      tipo: "Error ERP",
      texto: "La fecha de aplicación no es válida: el período contable de octubre está cerrado.",
    },
    comprobanteId: "32234",
    procesado: "14 octubre 2026, 17:20",
    facturas: [
      { folio: "FC A 0003-00012876", vence: "28/10/2026", pendiente: "$1.402.600,00", trans: "444749", cartera: "27038", analista: "Lucía Fernández", emision: "28/09/2026" },
      { folio: "FC A 0003-00012901", vence: "01/11/2026", pendiente: "$702.300,00", trans: "444802", cartera: "27038", analista: "Lucía Fernández", emision: "02/10/2026" },
    ],
    errorRecibo: {
      titulo: "El ERP rechazó el recibo · 15/10 09:41",
      texto: "La fecha de aplicación no es válida: el período de octubre está cerrado.",
      aviso:
        "INVALID_APPLY_DATE: la fecha de aplicación 15-OCT-2026 está fuera del período contable abierto · 15/10 09:41 · intento 1 de 3",
    },
    comentarios: [
      { autor: "Lucía Fernández", fecha: "15/10 · 10:05", texto: "Llamé al cliente, confirma el pago de ambas facturas." },
      {
        autor: "Martín Rossi",
        fecha: "15/10 · 11:20",
        texto: "El ERP rechaza por fecha de aplicación. Consulto con contabilidad si reabren el período.",
      },
    ],
    detalle: {
      notaConciliacion: "Movimiento, comprobante y cartera coinciden",
      notaRecibo: "El ERP rechazó el recibo · ver pestaña Recibo",
      notaComprobantes: "1 comprobante leído por IA",
      notaCartera: "2 facturas abiertas",
      notas: [
        "Movimiento conciliado por CUIT y monto exacto.",
        "Comprobante: aviso_agropampa.pdf (confianza 96%).",
        "Cubre 2 facturas: FC A 0003-00012876 y 00012901.",
      ],
      estadoCuenta: {
        sucursal: "0412",
        descripcion: "TRANSFERENCIA RECIBIDA",
        referencia: "000918273",
        concepto: "PAGO FC 12876 Y 12901",
        cuentaOrigen: "Banco Macro · CBU ···4410",
        cuentaDestino: "BBVA · Cta. Cte. ···4471",
        extracto: "Extracto: BBVA_cta4471_octubre.xlsx · Ingestado el 15/10/2026 08:12",
      },
      comprobantes: [
        { registro: "32234", fechaPago: "14/10/2026", monto: "$2.104.900,00", factura: "FC A 0003-00012876", confianza: "96%" },
      ],
      archivo: {
        nombre: "aviso_agropampa.pdf",
        origen: "Recibido por correo de pagos@agropampa.com.ar · 14/10/2026 17:20",
      },
      fotoCartera: "Foto de la cartera al momento de conciliar (15/10/2026 09:30). Se actualiza con cada ingesta.",
      recibo: {
        numeroCliente: "10458",
        metodo: "Transferencia bancaria",
        validaciones: ["Cliente activo en el ERP", "Facturas abiertas en cartera", "Monto igual al pendiente"],
      },
    },
  },
  {
    id: "m4",
    bancoOrigen: "Santander", bancoDestino: "Santander",
    bancoOrigenNombre: "Banco Santander", bancoDestinoNombre: "Banco Santander",
    fecha: "14/10", fechaLarga: "14/10/2026", hora: "13:12",
    razonSocial: "Sin identificar", cuit: "Movimiento sin CUIT", monto: "$730.000,00",
    analista: "Sin asignar",
    estadoConciliacion: "Excepción", fechaConciliacion: "16/10", horaConciliacion: "11:32",
    montoComprobante: SIN, pendienteCartera: SIN,
    estadoRecibo: "Sin recibo", fechaRecibo: SIN, horaRecibo: "",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: true,
    motivo: {
      tipo: "Excepción",
      texto: "Movimiento sin CUIT ni razón social. Identificar al cliente o reasignar.",
    },
  },
  {
    id: "m5",
    bancoOrigen: "Galicia", bancoDestino: "Galicia",
    bancoOrigenNombre: "Banco Galicia", bancoDestinoNombre: "Banco Galicia",
    fecha: "13/10", fechaLarga: "13/10/2026", hora: "11:05",
    razonSocial: "Ferretería Industrial Norte", cuit: "30-71122334-5", monto: "$98.450,00",
    analista: "Valentina Gómez",
    estadoConciliacion: "Pendiente", fechaConciliacion: "16/10", horaConciliacion: "11:16",
    montoComprobante: SIN, pendienteCartera: "$98.450,00",
    estadoRecibo: "Sin recibo", fechaRecibo: SIN, horaRecibo: "",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: true,
  },
  {
    id: "m6",
    bancoOrigen: "Santander", bancoDestino: "Macro",
    bancoOrigenNombre: "Banco Santander", bancoDestinoNombre: "Banco Macro",
    fecha: "13/10", fechaLarga: "13/10/2026", hora: "09:27",
    razonSocial: "Supermercados El Faro SA", cuit: "30-50001234-2", monto: "$3.520.000,00",
    analista: "Diego Herrera",
    estadoConciliacion: "Conciliado", fechaConciliacion: "14/10", horaConciliacion: "10:02",
    montoComprobante: "$3.520.000,00", pendienteCartera: "$3.520.000,00",
    estadoRecibo: "Aplicado", fechaRecibo: "14/10", horaRecibo: "10:12",
    numeroRecibo: "R-104498", montoRecibo: "$3.520.000,00",
    enMonitor: true,
  },
  {
    id: "m7",
    bancoOrigen: "Galicia", bancoDestino: "BBVA",
    bancoOrigenNombre: "Banco Galicia", bancoDestinoNombre: "BBVA",
    fecha: "12/10", fechaLarga: "12/10/2026", hora: "18:44",
    razonSocial: "Textil Mendoza SRL", cuit: "30-71555666-3", monto: "$64.210,75",
    analista: "Martín Rossi",
    estadoConciliacion: "Duplicado", fechaConciliacion: "16/10", horaConciliacion: "11:16",
    montoComprobante: "$64.210,75", pendienteCartera: SIN,
    estadoRecibo: "Sin recibo", fechaRecibo: SIN, horaRecibo: "",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: true,
    motivo: {
      tipo: "Duplicado",
      texto: "El mismo comprobante ya se concilió con el movimiento del 11/10 ($64.210,75).",
    },
  },
  {
    id: "m8",
    bancoOrigen: "BBVA", bancoDestino: "Galicia",
    bancoOrigenNombre: "BBVA", bancoDestinoNombre: "Banco Galicia",
    fecha: "12/10", fechaLarga: "12/10/2026", hora: "08:15",
    razonSocial: "Constructora Patagonia SA", cuit: "30-70011223-4", monto: "$1.875.300,00",
    analista: "Camila Ruiz",
    estadoConciliacion: "Conciliado", fechaConciliacion: "13/10", horaConciliacion: "15:40",
    montoComprobante: "$1.875.300,00", pendienteCartera: "$1.875.300,00",
    estadoRecibo: "Aplicado", fechaRecibo: "13/10", horaRecibo: "15:51",
    numeroRecibo: "R-104471", montoRecibo: "$1.875.300,00",
    enMonitor: true,
  },
  {
    id: "m9",
    bancoOrigen: "Supervielle", bancoDestino: "Galicia",
    bancoOrigenNombre: "Banco Supervielle", bancoDestinoNombre: "Banco Galicia",
    fecha: "11/10", fechaLarga: "11/10/2026", hora: "12:20",
    razonSocial: "Grupo Cuyo SRL", cuit: "30-71888999-0", monto: "$120.000,00",
    analista: "Valentina Gómez",
    estadoConciliacion: "Excepción", fechaConciliacion: "16/10", horaConciliacion: "11:16",
    montoComprobante: "$120.000,00", pendienteCartera: "$185.400,00",
    estadoRecibo: "Sin recibo", fechaRecibo: SIN, horaRecibo: "",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: false,
    motivo: {
      tipo: "Excepción",
      texto: "Pago parcial: cubre $120.000,00 de $185.400,00 pendientes en cartera.",
    },
  },
  {
    id: "m10",
    bancoOrigen: "ICBC", bancoDestino: "Santander",
    bancoOrigenNombre: "ICBC", bancoDestinoNombre: "Banco Santander",
    fecha: "10/10", fechaLarga: "10/10/2026", hora: "15:05",
    razonSocial: "Frigorífico Litoral SA", cuit: "30-60123456-8", monto: "$842.150,00",
    analista: "Diego Herrera",
    estadoConciliacion: "Conciliado", fechaConciliacion: "11/10", horaConciliacion: "09:12",
    montoComprobante: "$842.150,00", pendienteCartera: "$842.150,00",
    estadoRecibo: "Error", fechaRecibo: "11/10", horaRecibo: "09:23",
    numeroRecibo: SIN, montoRecibo: SIN,
    enMonitor: false,
    motivo: { tipo: "Error ERP", texto: "El cliente no está dado de alta en el ERP (ID 1564)." },
    errorRecibo: {
      titulo: "El ERP rechazó el recibo · 11/10 09:23",
      texto: "El cliente no está dado de alta en el ERP (ID 1564).",
    },
  },
];

export const KPIS = [
  { id: "recibidos", etiqueta: "Depósitos recibidos", valor: "$12.480.350,00", detalle: "45 depósitos en octubre", tono: "neutral", icono: "bank" },
  { id: "aplicado", etiqueta: "Importe aplicado", valor: "$9.736.120,00", detalle: "78% de lo recibido · con recibo", tono: "success", icono: "check" },
  { id: "noaplicado", etiqueta: "Importe no aplicado", valor: "$2.744.230,00", detalle: "22% de lo recibido · sin recibo", tono: "warning", icono: "minus" },
  { id: "pendientes", etiqueta: "Depósitos pendientes", valor: "9", detalle: "por conciliar o aplicar", tono: "flag", icono: "clock" },
  { id: "noident", etiqueta: "Depósitos no identificados", valor: "3", detalle: "sin cliente ni coincidencia posible", tono: "danger", icono: "alert" },
] as const;

/** Total de movimientos del período (los datos de ejemplo traen solo la primera página). */
export const TOTAL_MOVIMIENTOS = 45;

/** Un movimiento necesita acción manual si no está conciliado o si el recibo falló. */
export function necesitaConciliar(m: Movimiento) {
  return m.estadoConciliacion !== "Conciliado" || m.estadoRecibo === "Error";
}

export function esExcepcion(m: Movimiento) {
  return Boolean(m.motivo) && necesitaConciliar(m);
}
