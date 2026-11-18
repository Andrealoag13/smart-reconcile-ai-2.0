import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "../icons";
import { Dropdown, useDismiss } from "./Filters";

/* ───────── Indicadores ───────── */

export type KpiView = { id: string; etiqueta: string; valor: string; detalle: string; tono: string; icono: string };

export function Kpis({ items }: { items: readonly KpiView[] }) {
  return (
    <div className="kpis">
      {items.map((k) => (
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
  );
}

/* ───────── Filtros ───────── */

export type FiltroDef = { id: string; etiqueta: string; opciones: string[] };

/** Barra de filtros genérica: búsqueda, un período fijo opcional y desplegables. */
export function ScreenFilters({
  placeholder,
  busqueda,
  onBusqueda,
  defs,
  valores,
  onValor,
  periodo,
}: {
  placeholder: string;
  busqueda: string;
  onBusqueda: (v: string) => void;
  defs: FiltroDef[];
  valores: Record<string, string>;
  onValor: (id: string, v: string) => void;
  /** Filtro de período ya aplicado (solo visual), con su posición entre los desplegables. */
  periodo?: { etiqueta: string; valor: string; posicion: number; activo: boolean; onToggle: (activo: boolean) => void };
}) {
  const activos = defs.filter((d) => (valores[d.id] ?? "Todos") !== "Todos");
  const items: ReactNode[] = defs.map((d) => (
    <Dropdown key={d.id} etiqueta={d.etiqueta} valor={valores[d.id] ?? "Todos"} opciones={d.opciones} onChange={(v) => onValor(d.id, v)} />
  ));
  if (periodo) {
    items.splice(
      periodo.posicion,
      0,
      <div key="periodo" className={`filter ${periodo.activo ? "filter--active" : ""}`}>
        <button className="filter__btn" onClick={() => periodo.onToggle(true)}>
          <span>{periodo.etiqueta}</span>
          <strong>{periodo.activo ? periodo.valor : "Todos"}</strong>
          <Icon name="calendar" size={14} />
        </button>
      </div>,
    );
  }
  const hayActivos = activos.length > 0 || (periodo && periodo.activo);

  return (
    <section className="filters" aria-label="Filtros">
      <div className="filters__bar">
        <label className="search">
          <Icon name="search" size={16} />
          <input type="search" placeholder={placeholder} aria-label={placeholder.replace("…", "")} value={busqueda} onChange={(e) => onBusqueda(e.target.value)} />
        </label>
        {items}
        <button className="filter__btn filter__btn--more">
          <Icon name="sliders" size={15} />
          Más filtros
        </button>
      </div>
      {hayActivos && (
        <div className="filters__active">
          <span>Filtros activos:</span>
          {periodo && periodo.activo && (
            <span className="active-chip">
              {periodo.etiqueta}: {periodo.valor}
              <button aria-label={`Quitar filtro ${periodo.etiqueta}`} onClick={() => periodo.onToggle(false)}>
                <Icon name="x" size={14} />
              </button>
            </span>
          )}
          {activos.map((d) => (
            <span className="active-chip" key={d.id}>
              {d.etiqueta}: {valores[d.id]}
              <button aria-label={`Quitar filtro ${d.etiqueta}`} onClick={() => onValor(d.id, "Todos")}>
                <Icon name="x" size={14} />
              </button>
            </span>
          ))}
          <button
            className="link-btn"
            onClick={() => {
              defs.forEach((d) => onValor(d.id, "Todos"));
              periodo?.onToggle(false);
            }}
          >
            Limpiar todo
          </button>
        </div>
      )}
    </section>
  );
}

export function Results({ texto }: { texto: string }) {
  return (
    <div className="results">
      <span className="results__count">{texto}</span>
      <div className="spacer" />
      <span className="results__label">Filas por página</span>
      <button className="page-size">
        15 <Icon name="chevron" size={12} />
      </button>
    </div>
  );
}

/* ───────── Tabla genérica ───────── */

export type Columna<T> = {
  titulo: string;
  /** Ancho fijo en px, o "fill" para la columna que absorbe el espacio. */
  ancho: number | "fill";
  derecha?: boolean;
  separador?: boolean;
  sinOrden?: boolean;
  render: (fila: T) => ReactNode;
};

export type AccionMenu = { label: string; icono: IconName; peligro?: boolean; separadorAntes?: boolean; onClick: () => void };

const TOTAL = 1534;

export function DataTable<T>({
  columnas,
  filas,
  clave,
  onFila,
  etiquetaFila,
  conciliar,
  menu,
  pie,
  paginas,
  vacio = "No hay registros que coincidan con los filtros.",
}: {
  columnas: Columna<T>[];
  filas: T[];
  clave: (f: T) => string;
  onFila?: (f: T) => void;
  etiquetaFila?: (f: T) => string;
  /** Si devuelve una función, muestra el botón Conciliar en esa fila. */
  conciliar?: (f: T) => (() => void) | undefined;
  menu?: (f: T) => AccionMenu[];
  pie: string;
  paginas: number;
  vacio?: string;
}) {
  const conAcciones = Boolean(conciliar || menu);
  const fijo = columnas.reduce((a, c) => a + (c.ancho === "fill" ? 0 : c.ancho), 0) + (conAcciones ? 90 : 0);
  // La columna flexible arranca en 180px: así las tablas entran en pantallas de ~1366px sin scroll.
  const fill = Math.max(180, TOTAL - fijo);
  const minimo = fijo + 180;
  const estilo = (c: Columna<T>): CSSProperties =>
    c.ancho === "fill" ? { flex: `1 1 ${fill}px`, minWidth: 180 } : { width: c.ancho, flexShrink: 0 };

  return (
    <section className="table-card">
      <div className="table-scroll">
        <div className="table" role="table" style={{ minWidth: minimo }}>
          <div className="t-head" role="row">
            {columnas.map((c) => (
              <div key={c.titulo} role="columnheader" className={`t-th ${c.derecha ? "end" : ""} ${c.separador ? "sep" : ""}`} style={estilo(c)}>
                {c.titulo}
                {!c.sinOrden && <Icon name="sort" size={11} />}
              </div>
            ))}
            {conAcciones && (
              <div role="columnheader" className="t-th end sep c-acc">
                Acciones
              </div>
            )}
          </div>
          {filas.length === 0 ? (
            <div className="empty">{vacio}</div>
          ) : (
            filas.map((f) => (
              <Fila
                key={clave(f)}
                fila={f}
                columnas={columnas}
                estilo={estilo}
                onFila={onFila}
                etiqueta={etiquetaFila?.(f)}
                conciliar={conciliar?.(f)}
                menu={menu?.(f)}
                conAcciones={conAcciones}
              />
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        <span>{pie}</span>
        <div className="spacer" />
        <button className="page-btn" aria-label="Página anterior" disabled>
          <Icon name="left" size={14} />
        </button>
        {Array.from({ length: paginas }, (_, i) => (
          <button key={i} className="page-btn" aria-current={i === 0 ? "page" : undefined}>
            {i + 1}
          </button>
        ))}
        <button className="page-btn" aria-label="Página siguiente" disabled={paginas === 1}>
          <Icon name="right" size={14} />
        </button>
      </div>
    </section>
  );
}

function Fila<T>({
  fila,
  columnas,
  estilo,
  onFila,
  etiqueta,
  conciliar,
  menu,
  conAcciones,
}: {
  fila: T;
  columnas: Columna<T>[];
  estilo: (c: Columna<T>) => CSSProperties;
  onFila?: (f: T) => void;
  etiqueta?: string;
  conciliar?: () => void;
  menu?: AccionMenu[];
  conAcciones: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useDismiss(abierto, () => setAbierto(false));
  const clic = onFila ? () => onFila(fila) : undefined;

  return (
    <div className="t-item">
      <div
        className={`t-row ${clic ? "" : "t-row--static"}`}
        role="row"
        tabIndex={clic ? 0 : undefined}
        aria-label={etiqueta}
        onClick={clic}
        onKeyDown={(e) => {
          if (clic && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            clic();
          }
        }}
      >
        {columnas.map((c) => (
          <div key={c.titulo} className={`t-cell ${c.derecha ? "end" : ""} ${c.separador ? "sep" : ""}`} style={estilo(c)}>
            {c.render(fila)}
          </div>
        ))}
        {conAcciones && (
          <div className="t-cell t-actions c-acc sep" ref={ref} onClick={(e) => e.stopPropagation()}>
            {conciliar && (
              <button className="icon-btn icon-btn--primary" aria-label="Conciliar manualmente" onClick={conciliar}>
                <Icon name="link" size={15} />
                <span className="tooltip" role="tooltip">
                  Conciliar manualmente
                </span>
              </button>
            )}
            {menu && menu.length > 0 && (
              <>
                <button
                  className="icon-btn icon-btn--ghost"
                  aria-label="Más acciones"
                  aria-haspopup="menu"
                  aria-expanded={abierto}
                  onClick={() => setAbierto((o) => !o)}
                >
                  <Icon name="more" size={16} />
                </button>
                {abierto && (
                  <div className="popover row-menu" role="menu">
                    {menu.map((a) => (
                      <div key={a.label} style={{ display: "contents" }}>
                        {a.separadorAntes && <div className="popover__sep" />}
                        <button
                          role="menuitem"
                          className={`popover__item ${a.peligro ? "popover__item--danger" : ""}`}
                          onClick={() => {
                            setAbierto(false);
                            a.onClick();
                          }}
                        >
                          <Icon name={a.icono} size={16} />
                          {a.label}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Celda de dos líneas: texto principal y secundario (por ejemplo, razón social y CUIT). */
export function Doble({ principal, secundario }: { principal: string; secundario?: string }) {
  return (
    <>
      <span className="strong ellipsis">{principal}</span>
      {secundario && <span className="sub">{secundario}</span>}
    </>
  );
}

export function Flujo({ origen, destino }: { origen: string; destino: string }) {
  return (
    <div className="flow">
      <span className="bank">{origen}</span>
      <Icon name="arrow" size={11} />
      <span className="bank bank--dest">{destino}</span>
    </div>
  );
}

/** Filtra por búsqueda de texto y por valores exactos de los desplegables. */
export function filtrarFilas<T>(
  filas: T[],
  busqueda: string,
  campos: (f: T) => string[],
  valores: Record<string, string>,
  valorDe: (f: T, id: string) => string,
) {
  const q = busqueda.trim().toLowerCase();
  return filas.filter(
    (f) =>
      (!q || campos(f).some((v) => v.toLowerCase().includes(q))) &&
      Object.entries(valores).every(([id, v]) => v === "Todos" || valorDe(f, id) === v),
  );
}

export const unicos = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "es"));
