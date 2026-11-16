import { useEffect, useRef, useState } from "react";
import { Icon } from "../icons";
import { ANALISTAS } from "../data";

export type FilterState = {
  busqueda: string;
  periodo: boolean; // el período 01/10 – 20/10/2026 está aplicado
  analista: string;
  banco: string;
  estadoConciliacion: string;
  estadoRecibo: string;
};

export const FILTROS_INICIALES: FilterState = {
  busqueda: "",
  periodo: true,
  analista: "Todos",
  banco: "Todos",
  estadoConciliacion: "Todos",
  estadoRecibo: "Todos",
};

const PERIODO = "01/10 – 20/10/2026";

/** Cierra un desplegable al hacer clic afuera o al presionar Escape. */
export function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function Dropdown({
  etiqueta,
  valor,
  opciones,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  opciones: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div className={`filter ${valor !== "Todos" ? "filter--active" : ""}`} ref={ref}>
      <button className="filter__btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{etiqueta}</span>
        <strong>{valor}</strong>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div className="popover" role="listbox" aria-label={etiqueta}>
          {["Todos", ...opciones].map((o) => (
            <button
              key={o}
              role="option"
              aria-selected={o === valor}
              aria-checked={o === valor}
              className="popover__item"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  value,
  onChange,
  bancos,
}: {
  value: FilterState;
  onChange: (f: FilterState) => void;
  bancos: string[];
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  const activos: { texto: string; quitar: () => void }[] = [];
  if (value.periodo) activos.push({ texto: `Período: ${PERIODO}`, quitar: () => set({ periodo: false }) });
  if (value.analista !== "Todos") activos.push({ texto: `Analista: ${value.analista}`, quitar: () => set({ analista: "Todos" }) });
  if (value.banco !== "Todos") activos.push({ texto: `Banco: ${value.banco}`, quitar: () => set({ banco: "Todos" }) });
  if (value.estadoConciliacion !== "Todos")
    activos.push({ texto: `Conciliación: ${value.estadoConciliacion}`, quitar: () => set({ estadoConciliacion: "Todos" }) });
  if (value.estadoRecibo !== "Todos")
    activos.push({ texto: `Recibo: ${value.estadoRecibo}`, quitar: () => set({ estadoRecibo: "Todos" }) });

  return (
    <section className="filters" aria-label="Filtros">
      <div className="filters__bar">
        <label className="search">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Buscar por razón social, CUIT o N° de recibo…"
            aria-label="Buscar por razón social, CUIT o N° de recibo"
            value={value.busqueda}
            onChange={(e) => set({ busqueda: e.target.value })}
          />
        </label>
        <div className={`filter ${value.periodo ? "filter--active" : ""}`}>
          <button className="filter__btn" onClick={() => set({ periodo: true })}>
            <span>Período</span>
            <strong>{value.periodo ? PERIODO : "Todos"}</strong>
            <Icon name="calendar" size={14} />
          </button>
        </div>
        <Dropdown etiqueta="Analista" valor={value.analista} opciones={ANALISTAS} onChange={(v) => set({ analista: v })} />
        <Dropdown etiqueta="Banco" valor={value.banco} opciones={bancos} onChange={(v) => set({ banco: v })} />
        <Dropdown
          etiqueta="Estado conciliación"
          valor={value.estadoConciliacion}
          opciones={["Conciliado", "Pendiente", "Excepción", "Duplicado"]}
          onChange={(v) => set({ estadoConciliacion: v })}
        />
        <Dropdown
          etiqueta="Estado recibo"
          valor={value.estadoRecibo}
          opciones={["Aplicado", "Solicitado", "Error", "Sin recibo"]}
          onChange={(v) => set({ estadoRecibo: v })}
        />
        <button className="filter__btn filter__btn--more">
          <Icon name="sliders" size={15} />
          Más filtros
        </button>
      </div>
      {activos.length > 0 && (
        <div className="filters__active">
          <span>Filtros activos:</span>
          {activos.map((a) => (
            <span className="active-chip" key={a.texto}>
              {a.texto}
              <button aria-label={`Quitar filtro ${a.texto}`} onClick={a.quitar}>
                <Icon name="x" size={14} />
              </button>
            </span>
          ))}
          <button className="link-btn" onClick={() => onChange({ ...FILTROS_INICIALES, periodo: false, busqueda: value.busqueda })}>
            Limpiar todo
          </button>
        </div>
      )}
    </section>
  );
}
