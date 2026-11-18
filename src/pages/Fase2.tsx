import { useMemo, useState } from "react";
import { ANALISTAS, type Movimiento } from "../data";
import {
  CLIENTES,
  COMPROBANTES,
  EXTRACTOS,
  KPIS_CARTERA,
  KPIS_EXTRACTOS,
  KPIS_PAGOS,
  KPI_COMPROBANTES_BASE,
  PAGOS,
  TOTAL_CLIENTES,
  TOTAL_COMPROBANTES,
  TOTAL_EXTRACTOS,
  TOTAL_PAGOS,
  type Comprobante,
  type EstadoComprobante,
} from "../fase2";
import { PageHeader } from "../components/Shell";
import { Chip } from "../components/Table";
import { DataTable, Doble, Flujo, Kpis, Results, ScreenFilters, filtrarFilas, unicos, type Columna } from "../components/Screen";

const PERIODO = "01/10 – 20/10/2026";
const nuevo = (r: Record<string, string>, id: string, v: string) => ({ ...r, [id]: v });

/** Paginado: la primera página muestra los datos de ejemplo; sin filtros se indica el total del período. */
function pie(n: number, total: number, sinFiltros: boolean, nombre: string) {
  // Con pocos registros, el total se reparte en páginas del tamaño de lo que se ve (como en el Figma).
  const paginas = total <= 15 ? Math.ceil(total / n) : Math.ceil(total / 15);
  return sinFiltros
    ? { texto: `Mostrando ${n} de ${total} ${nombre}`, pie: `Página 1 de ${paginas} · ${total} ${nombre}`, paginas: Math.min(3, paginas) }
    : { texto: `Mostrando ${n} ${nombre}`, pie: `Página 1 de 1 · ${n} ${nombre}`, paginas: 1 };
}

/* ───────── Comprobantes ───────── */

/** Un comprobante queda verificado cuando su movimiento se concilia en el Monitor. */
export function estadoComprobante(c: Comprobante, movs: Movimiento[]): EstadoComprobante {
  const m = movs.find((x) => x.id === c.movId);
  return c.estado !== "Verificado" && m?.estadoConciliacion === "Conciliado" ? "Verificado" : c.estado;
}

export function kpisComprobantes(movs: Movimiento[]) {
  const pasados = COMPROBANTES.filter((c) => c.estado !== "Verificado" && estadoComprobante(c, movs) === "Verificado");
  const b = KPI_COMPROBANTES_BASE;
  const verificados = b.verificados + pasados.length;
  const pendientes = b.pendientes - pasados.filter((c) => c.estado !== "Sin identificar").length;
  const noIdent = b.noIdentificados - pasados.filter((c) => c.estado === "Sin identificar").length;
  return [
    { id: "total", etiqueta: "Total", valor: String(b.total), detalle: "comprobantes recibidos en el período", tono: "neutral", icono: "paperclip" },
    { id: "verif", etiqueta: "Verificados", valor: String(verificados), detalle: `${Math.round((verificados / b.total) * 100)}% verificados automáticamente`, tono: "success", icono: "check" },
    { id: "pend", etiqueta: "Pendientes", valor: String(pendientes), detalle: "requieren acción manual", tono: "warning", icono: "minus" },
    { id: "noid", etiqueta: "No identificados", valor: String(noIdent), detalle: "sin cliente ni coincidencia posible", tono: "danger", icono: "alert" },
  ];
}

export function ComprobantesPage({
  movs,
  onDetalle,
  onConciliar,
  onAviso,
}: {
  movs: Movimiento[];
  onDetalle: (movId: string) => void;
  onConciliar: (movId: string) => void;
  onAviso: (t: string) => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({ estado: "Todos", banco: "Todos", analista: "Todos" });
  const [periodo, setPeriodo] = useState(true);
  const filas = useMemo(() => COMPROBANTES.map((c) => ({ ...c, estado: estadoComprobante(c, movs), analista: movs.find((m) => m.id === c.movId)?.analista ?? "Sin asignar" })), [movs]);
  type F = (typeof filas)[number];
  const visibles = filtrarFilas(filas, busqueda, (f) => [f.id, f.beneficiario, f.cuit], valores, (f, id) =>
    id === "banco" ? f.bancoDestino : id === "estado" ? f.estado : f.analista,
  );
  const sinFiltros = visibles.length === filas.length;
  const p = pie(visibles.length, TOTAL_COMPROBANTES, sinFiltros, "comprobantes");

  const columnas: Columna<F>[] = [
    { titulo: "ID comprobante", ancho: 130, render: (f) => <span style={{ fontWeight: 500 }}>{f.id}</span> },
    { titulo: "Recibido", ancho: 96, render: (f) => <Doble principal={f.fecha} secundario={f.hora} /> },
    { titulo: "Beneficiario", ancho: "fill", render: (f) => <Doble principal={f.beneficiario} secundario={f.cuit} /> },
    { titulo: "Flujo bancario", ancho: 210, render: (f) => <Flujo origen={f.bancoOrigen} destino={f.bancoDestino} /> },
    { titulo: "Monto", ancho: 150, derecha: true, render: (f) => <span className="strong">{f.monto}</span> },
    { titulo: "Estado", ancho: 170, separador: true, render: (f) => <Chip estado={f.estado} /> },
  ];

  return (
    <>
      <PageHeader title="Comprobantes recibidos" subtitle="Comprobantes y avisos de pago leídos por IA, con su estado de verificación" onRefresh={() => onAviso("Datos actualizados")} />
      <Kpis items={kpisComprobantes(movs)} />
      <ScreenFilters
        placeholder="Buscar por ID de comprobante, beneficiario o CUIT…"
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        defs={[
          { id: "estado", etiqueta: "Estado", opciones: ["Verificado", "Pendiente", "Duplicado", "Sin identificar"] },
          { id: "banco", etiqueta: "Banco", opciones: unicos(filas.map((f) => f.bancoDestino)) },
          { id: "analista", etiqueta: "Analista", opciones: ANALISTAS },
        ]}
        valores={valores}
        onValor={(id, v) => setValores((r) => nuevo(r, id, v))}
        periodo={{ etiqueta: "Período", valor: PERIODO, posicion: 0, activo: periodo, onToggle: setPeriodo }}
      />
      <Results texto={p.texto} />
      <DataTable
        columnas={columnas}
        filas={visibles}
        clave={(f) => f.id}
        onFila={(f) => onDetalle(f.movId)}
        etiquetaFila={(f) => `Ver detalle del comprobante ${f.id}`}
        conciliar={(f) => (f.estado !== "Verificado" ? () => onConciliar(f.movId) : undefined)}
        menu={(f) => [
          { label: "Ver detalle", icono: "eye", onClick: () => onDetalle(f.movId) },
          { label: "Ver adjunto", icono: "paperclip", onClick: () => onAviso(`Ver adjunto (${f.id}): pantalla fuera de esta entrega`) },
          { label: "Editar comprobante", icono: "pencil", onClick: () => onAviso(`Editar comprobante (${f.id}): pantalla fuera de esta entrega`) },
          { label: "Eliminar", icono: "trash", peligro: true, separadorAntes: true, onClick: () => onAviso(`Eliminar (${f.id}): no disponible en la demo`) },
        ]}
        pie={p.pie}
        paginas={p.paginas}
      />
    </>
  );
}

/* ───────── Cartera de clientes ───────── */

const RANGOS = ["Sin saldo", "Hasta $500.000", "$500.000 a $2.000.000", "Más de $2.000.000"];
const importeNum = (s: string) => Number(s.replace(/[$.]/g, "").replace(",", "."));
const rango = (s: string) => {
  const n = importeNum(s);
  return n === 0 ? RANGOS[0] : n <= 500000 ? RANGOS[1] : n <= 2000000 ? RANGOS[2] : RANGOS[3];
};

export function CarteraPage({ onVerPagos, onAviso }: { onVerPagos: (cliente: string) => void; onAviso: (t: string) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({ analista: "Todos", importe: "Todos", estado: "Todos" });
  type F = (typeof CLIENTES)[number];
  const visibles = filtrarFilas(CLIENTES, busqueda, (f) => [f.razonSocial, f.codigo, f.cuit], valores, (f, id) =>
    id === "analista" ? f.analista : id === "importe" ? rango(f.importePendiente) : f.estado,
  );
  const p = pie(visibles.length, TOTAL_CLIENTES, visibles.length === CLIENTES.length, "clientes");

  const columnas: Columna<F>[] = [
    { titulo: "Razón social", ancho: "fill", render: (f) => <Doble principal={f.razonSocial} secundario={`Cód. ${f.codigo}`} /> },
    { titulo: "CUIT", ancho: 170, render: (f) => f.cuit },
    { titulo: "Analista asignado", ancho: 200, render: (f) => f.analista },
    { titulo: "Importe pendiente de cartera", ancho: 240, derecha: true, render: (f) => <span className="strong">{f.importePendiente}</span> },
    { titulo: "Estado de cuenta", ancho: 220, separador: true, render: (f) => <Chip estado={f.estado} /> },
  ];

  return (
    <>
      <PageHeader title="Cartera de clientes" subtitle="Saldo pendiente de cada cliente según la última carga de cartera" onRefresh={() => onAviso("Datos actualizados")} />
      <Kpis items={KPIS_CARTERA} />
      <ScreenFilters
        placeholder="Buscar por razón social, código de cliente o CUIT…"
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        defs={[
          { id: "analista", etiqueta: "Analista", opciones: ANALISTAS },
          { id: "importe", etiqueta: "Importe pendiente", opciones: RANGOS },
          { id: "estado", etiqueta: "Estado de cartera", opciones: ["Al día", "Con vencidos", "Sin saldo pendiente"] },
        ]}
        valores={valores}
        onValor={(id, v) => setValores((r) => nuevo(r, id, v))}
      />
      <Results texto={p.texto} />
      <DataTable
        columnas={columnas}
        filas={visibles}
        clave={(f) => f.codigo}
        onFila={(f) => onVerPagos(f.razonSocial)}
        etiquetaFila={(f) => `Ver pagos esperados de ${f.razonSocial}`}
        menu={(f) => [{ label: "Ver pagos esperados", icono: "eye", onClick: () => onVerPagos(f.razonSocial) }]}
        pie={p.pie}
        paginas={p.paginas}
      />
    </>
  );
}

/* ───────── Pagos esperados ───────── */

export function PagosPage({ cliente, onCliente, onAviso }: { cliente: string; onCliente: (c: string) => void; onAviso: (t: string) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({ analista: "Todos", estado: "Todos", importe: "Todos" });
  const [periodo, setPeriodo] = useState(true);
  type F = (typeof PAGOS)[number];
  const todos = { ...valores, cliente };
  const visibles = filtrarFilas(PAGOS, busqueda, (f) => [f.id, f.razonSocial, f.cuit], todos, (f, id) =>
    id === "cliente" ? f.razonSocial : id === "analista" ? f.analista : id === "estado" ? f.estado : rango(f.importe),
  );
  const p = pie(visibles.length, TOTAL_PAGOS, visibles.length === PAGOS.length, "pagos esperados");

  const columnas: Columna<F>[] = [
    { titulo: "ID - Referencia", ancho: 160, render: (f) => <span style={{ fontWeight: 500 }}>{f.id}</span> },
    { titulo: "Razón social", ancho: "fill", render: (f) => <Doble principal={f.razonSocial} /> },
    { titulo: "CUIT", ancho: 150, render: (f) => f.cuit },
    { titulo: "Analista asignado", ancho: 170, render: (f) => f.analista },
    { titulo: "Fecha", ancho: 120, render: (f) => f.fecha },
    { titulo: "Importe", ancho: 170, derecha: true, render: (f) => <span className="strong">{f.importe}</span> },
    { titulo: "Estado de aplicación", ancho: 180, separador: true, render: (f) => <Chip estado={f.estado} /> },
    { titulo: "Fecha de aplicación", ancho: 160, render: (f) => f.fechaAplicacion },
  ];

  return (
    <>
      <PageHeader title="Pagos esperados" subtitle="Un registro por cada pago que se espera recibir, con su estado de aplicación" onRefresh={() => onAviso("Datos actualizados")} />
      <Kpis items={KPIS_PAGOS} />
      <ScreenFilters
        placeholder="Buscar por referencia de pago, razón social o CUIT…"
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        defs={[
          { id: "cliente", etiqueta: "Cliente", opciones: unicos(CLIENTES.map((c) => c.razonSocial)) },
          { id: "analista", etiqueta: "Analista", opciones: ANALISTAS },
          { id: "estado", etiqueta: "Estado de aplicación", opciones: ["Pendiente", "Aplicado"] },
          { id: "importe", etiqueta: "Importe", opciones: RANGOS.slice(1) },
        ]}
        valores={todos}
        onValor={(id, v) => (id === "cliente" ? onCliente(v) : setValores((r) => nuevo(r, id, v)))}
        periodo={{ etiqueta: "Fecha", valor: PERIODO, posicion: 3, activo: periodo, onToggle: setPeriodo }}
      />
      <Results texto={p.texto} />
      <DataTable
        columnas={columnas}
        filas={visibles}
        clave={(f) => f.id}
        menu={(f) => [{ label: "Editar pago esperado", icono: "pencil", onClick: () => onAviso(`Editar ${f.id}: pantalla fuera de esta entrega`) }]}
        pie={p.pie}
        paginas={p.paginas}
        vacio="Este cliente no tiene pagos esperados en el período."
      />
    </>
  );
}

/* ───────── Extractos bancarios ───────── */

export function ExtractosPage({ onAviso }: { onAviso: (t: string) => void }) {
  const [busqueda, setBusqueda] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({ banco: "Todos", cuenta: "Todos", estado: "Todos", moneda: "Todos" });
  const [periodo, setPeriodo] = useState(true);
  type F = (typeof EXTRACTOS)[number];
  const visibles = filtrarFilas(EXTRACTOS, busqueda, (f) => [f.nombre, f.cuenta], valores, (f, id) =>
    id === "banco" ? f.banco : id === "cuenta" ? f.cuenta : id === "estado" ? f.estado : f.moneda,
  );
  const p = pie(visibles.length, TOTAL_EXTRACTOS, visibles.length === EXTRACTOS.length, "extractos");

  const columnas: Columna<F>[] = [
    { titulo: "Extracto", ancho: "fill", render: (f) => <Doble principal={f.nombre} secundario={`Cargado el ${f.cargado}`} /> },
    { titulo: "Banco", ancho: 110, render: (f) => f.banco },
    { titulo: "Cuenta bancaria", ancho: 150, render: (f) => f.cuenta },
    { titulo: "Período", ancho: 160, render: (f) => f.periodo },
    { titulo: "Moneda", ancho: 86, render: (f) => f.moneda },
    { titulo: "Mov. ingreso", ancho: 116, derecha: true, render: (f) => f.movimientos },
    { titulo: "Importe ingresos", ancho: 160, derecha: true, render: (f) => <span className="strong">{f.importe}</span> },
    { titulo: "Pendiente conciliar", ancho: 160, derecha: true, render: (f) => f.pendiente },
    { titulo: "Estado", ancho: 170, separador: true, render: (f) => <Chip estado={f.estado} /> },
  ];

  return (
    <>
      <PageHeader title="Extractos bancarios" subtitle="Extractos contra los que se validan los comprobantes y avisos de pago" onRefresh={() => onAviso("Datos actualizados")} />
      <Kpis items={KPIS_EXTRACTOS} />
      <ScreenFilters
        placeholder="Buscar por nombre o referencia del extracto…"
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        defs={[
          { id: "banco", etiqueta: "Banco", opciones: unicos(EXTRACTOS.map((e) => e.banco)) },
          { id: "cuenta", etiqueta: "Cuenta", opciones: unicos(EXTRACTOS.map((e) => e.cuenta)) },
          { id: "estado", etiqueta: "Estado", opciones: ["Conciliado", "Con pendientes"] },
          { id: "moneda", etiqueta: "Moneda", opciones: ["ARS"] },
        ]}
        valores={valores}
        onValor={(id, v) => setValores((r) => nuevo(r, id, v))}
        periodo={{ etiqueta: "Período", valor: PERIODO, posicion: 2, activo: periodo, onToggle: setPeriodo }}
      />
      <Results texto={p.texto} />
      <DataTable
        columnas={columnas}
        filas={visibles}
        clave={(f) => f.nombre}
        menu={(f) => [
          { label: "Ver movimientos", icono: "eye", onClick: () => onAviso(`Movimientos de ${f.nombre}: pantalla fuera de esta entrega`) },
          { label: "Descargar archivo original", icono: "download", onClick: () => onAviso(`Descarga de ${f.nombre}: no disponible en la demo`) },
        ]}
        pie={p.pie}
        paginas={p.paginas}
      />
    </>
  );
}
