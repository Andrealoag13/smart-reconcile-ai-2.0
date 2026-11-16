import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "./icons";
import { KPIS, MOVIMIENTOS, TOTAL_MOVIMIENTOS, esExcepcion, type Movimiento } from "./data";
import { THEMES, type ThemeId } from "./themes";
import { Appbar, Navbar, PageHeader, type TabDef, type TabId } from "./components/Shell";
import { FILTROS_INICIALES, FilterBar, type FilterState } from "./components/Filters";
import { MovimientosTable } from "./components/Table";
import { ConciliarModal } from "./components/Modals";
import { DetalleModal } from "./components/Detalle";

/** Si se compila con VITE_TEMA=cliente (o baufest), el tema queda fijo y no se muestra el selector "Vista". */
const TEMA_FIJO = import.meta.env.VITE_TEMA as ThemeId | undefined;

function temaInicial(): ThemeId {
  if (TEMA_FIJO === "cliente" || TEMA_FIJO === "baufest") return TEMA_FIJO;
  const t = new URLSearchParams(window.location.search).get("tema");
  return t === "cliente" ? "cliente" : "baufest";
}

function filtrar(filas: Movimiento[], f: FilterState) {
  const q = f.busqueda.trim().toLowerCase();
  return filas.filter(
    (m) =>
      (!q || [m.razonSocial, m.cuit, m.numeroRecibo].some((v) => v.toLowerCase().includes(q))) &&
      (f.analista === "Todos" || m.analista === f.analista) &&
      (f.banco === "Todos" || m.bancoDestino === f.banco || m.bancoOrigen === f.banco) &&
      (f.estadoConciliacion === "Todos" || m.estadoConciliacion === f.estadoConciliacion) &&
      (f.estadoRecibo === "Todos" || m.estadoRecibo === f.estadoRecibo),
  );
}

export default function App() {
  const [themeId, setThemeId] = useState<ThemeId>(temaInicial);
  const [tab, setTab] = useState<TabId>("monitor");
  const [movs, setMovs] = useState(MOVIMIENTOS);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [detalle, setDetalle] = useState<string | null>(null);
  const [conciliar, setConciliar] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3200);
    return () => clearTimeout(t);
  }, [aviso]);

  const excepciones = useMemo(() => movs.filter(esExcepcion), [movs]);
  const bancos = useMemo(() => [...new Set(movs.flatMap((m) => [m.bancoOrigen, m.bancoDestino]))].sort(), [movs]);
  const porId = (id: string | null) => movs.find((m) => m.id === id);

  const tabs: TabDef[] = [
    { id: "monitor", label: "Monitor", count: TOTAL_MOVIMIENTOS },
    { id: "comprobantes", label: "Comprobantes", count: 4 },
    { id: "excepciones", label: "Gestión de excepciones", count: excepciones.length },
    { id: "cartera", label: "Cartera de clientes" },
    { id: "pagos", label: "Pagos esperados", count: 4 },
    { id: "extractos", label: "Extractos bancarios" },
  ];

  const actualizar = (id: string, patch: Partial<Movimiento>) =>
    setMovs((lista) => lista.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  // El ERP recibe de nuevo la solicitud: el recibo vuelve a "Solicitado".
  const reintentar = (m: Movimiento) => {
    actualizar(m.id, { estadoRecibo: "Solicitado", fechaRecibo: "20/10", horaRecibo: "11:16" });
    setAviso(`Recibo de ${m.razonSocial} reenviado al ERP`);
  };

  // Conciliación manual: queda conciliado y se solicita el recibo.
  const aplicar = (m: Movimiento, analista: string) => {
    actualizar(m.id, {
      analista,
      estadoConciliacion: "Conciliado",
      fechaConciliacion: "20/10",
      horaConciliacion: "11:16",
      estadoRecibo: "Solicitado",
      fechaRecibo: "20/10",
      horaRecibo: "11:16",
    });
    setConciliar(null);
    setAviso(`Conciliación aplicada · recibo solicitado al ERP`);
  };

  const cerrarDetalle = useCallback(() => setDetalle(null), []);
  const cerrarConciliar = useCallback(() => setConciliar(null), []);

  const handlers = {
    onOpen: (m: Movimiento) => setDetalle(m.id),
    onConciliar: (m: Movimiento) => setConciliar(m.id),
    onMenu: (accion: "adjunto" | "editar" | "eliminar", m: Movimiento) => {
      const textos = { adjunto: "Ver adjunto", editar: "Editar comprobante", eliminar: "Eliminar" };
      setAviso(`${textos[accion]} (${m.razonSocial}): pantalla fuera de esta entrega`);
    },
  };

  const filasMonitor = filtrar(movs.filter((m) => m.enMonitor), filtros);
  const filasExcepciones = filtrar(excepciones, filtros);
  const sinFiltros = filasMonitor.length === movs.filter((m) => m.enMonitor).length;
  const mDetalle = porId(detalle);
  const mConciliar = porId(conciliar);
  const theme = THEMES[themeId];

  return (
    <div className="app">
      <Appbar theme={theme} />
      <Navbar tabs={tabs} active={tab} onChange={setTab} />

      <main className="content">
        {tab === "monitor" && (
          <>
            <PageHeader
              title="Monitor de conciliación"
              subtitle="Movimientos bancarios, su conciliación y el recibo de pago generado"
              onRefresh={() => setAviso("Datos actualizados")}
            />
            <div className="kpis">
              {KPIS.map((k) => (
                <article className={`kpi kpi--${k.tono}`} key={k.id}>
                  <div className="kpi__head">
                    <span className="kpi__label">{k.etiqueta}</span>
                    <span className="kpi__icon">
                      <Icon name={k.icono as IconName} size={18} />
                    </span>
                  </div>
                  <span className="kpi__value">{k.valor}</span>
                  <span className="kpi__detail">{k.detalle}</span>
                </article>
              ))}
            </div>
            <FilterBar value={filtros} onChange={setFiltros} bancos={bancos} />
            <div className="results">
              <span className="results__count">
                Mostrando {filasMonitor.length}
                {sinFiltros ? ` de ${TOTAL_MOVIMIENTOS}` : ""} movimientos
              </span>
              <div className="spacer" />
              <span className="results__label">Filas por página</span>
              <button className="page-size">
                15 <Icon name="chevron" size={12} />
              </button>
            </div>
            <MovimientosTable
              filas={filasMonitor}
              pie={sinFiltros ? `Página 1 de 3 · ${TOTAL_MOVIMIENTOS} movimientos` : `Página 1 de 1 · ${filasMonitor.length} movimientos`}
              paginas={sinFiltros ? 3 : 1}
              {...handlers}
            />
          </>
        )}

        {tab === "excepciones" && (
          <>
            <PageHeader
              title="Gestión de excepciones"
              subtitle="Casos que no pueden avanzar sin intervención: excepción en la conciliación o error en el recibo"
              onRefresh={() => setAviso("Datos actualizados")}
            />
            <FilterBar value={filtros} onChange={setFiltros} bancos={bancos} />
            <div className="results">
              <span className="results__count">Mostrando {filasExcepciones.length} casos · ordenados por antigüedad</span>
              <div className="spacer" />
              <span className="results__label">Filas por página</span>
              <button className="page-size">
                15 <Icon name="chevron" size={12} />
              </button>
            </div>
            <MovimientosTable
              filas={filasExcepciones}
              mostrarMotivo
              siempreConciliar
              pie={`Página 1 de 1 · ${filasExcepciones.length} casos`}
              paginas={1}
              {...handlers}
            />
          </>
        )}

        {tab !== "monitor" && tab !== "excepciones" && (
          <div className="placeholder">
            <strong>{tabs.find((t) => t.id === tab)?.label}</strong>
            Esta pantalla todavía no está en esta entrega.
          </div>
        )}
      </main>

      {mDetalle && !mConciliar && (
        <DetalleModal
          m={mDetalle}
          onClose={cerrarDetalle}
          onReintentar={reintentar}
          onConciliar={(m) => setConciliar(m.id)}
          onAnalista={(m, analista) => actualizar(m.id, { analista })}
          onComentar={(m, texto) =>
            actualizar(m.id, { comentarios: [...(m.comentarios ?? []), { autor: "Andrea López", fecha: "20/10 · 11:16", texto }] })
          }
          onAccion={setAviso}
        />
      )}
      {mConciliar && <ConciliarModal m={mConciliar} onClose={cerrarConciliar} onAplicar={aplicar} />}
      {aviso && (
        <div className="toast" role="status">
          {aviso}
        </div>
      )}

      {!TEMA_FIJO && (
        <div className="theme-switch" role="group" aria-label="Vista de la demo">
        <span>Vista</span>
        {(Object.keys(THEMES) as ThemeId[]).map((id) => (
          <button key={id} aria-pressed={id === themeId} onClick={() => setThemeId(id)}>
            {THEMES[id].nombre}
          </button>
        ))}
        </div>
      )}
    </div>
  );
}
