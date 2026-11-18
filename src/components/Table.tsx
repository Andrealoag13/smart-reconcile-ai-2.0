import { useState } from "react";
import { Icon } from "../icons";
import { necesitaConciliar, type Movimiento } from "../data";
import { useDismiss } from "./Filters";

const TONO: Record<string, string> = {
  Conciliado: "success",
  Aplicado: "success",
  Pendiente: "warning",
  Solicitado: "warning",
  Excepción: "flag",
  Duplicado: "flag",
  Error: "danger",
  "Sin recibo": "neutral",
  Verificado: "success",
  "Al día": "success",
  "Con vencidos": "danger",
  "Sin saldo pendiente": "neutral",
  "Con pendientes": "warning",
  "Sin identificar": "danger",
};

export function Chip({ estado }: { estado: string }) {
  return <span className={`chip chip--${TONO[estado] ?? "neutral"}`}>{estado}</span>;
}

const COLUMNAS: { clase: string; titulo: string; orden?: boolean }[] = [
  { clase: "c-flujo", titulo: "Flujo bancario", orden: true },
  { clase: "c-fecha", titulo: "Depósito", orden: true },
  { clase: "c-razon", titulo: "Razón social", orden: true },
  { clase: "c-monto end", titulo: "Monto", orden: true },
  { clase: "c-analista sep", titulo: "Analista", orden: true },
  { clase: "c-estado", titulo: "Estado", orden: true },
  { clase: "c-fconc", titulo: "Conciliado", orden: true },
  { clase: "c-comp end", titulo: "Comprobante", orden: true },
  { clase: "c-pend end", titulo: "Pend. cartera", orden: true },
  { clase: "c-erec sep", titulo: "Estado", orden: true },
  { clase: "c-frec", titulo: "Emitido", orden: true },
  { clase: "c-nrec", titulo: "N° recibo", orden: true },
  { clase: "c-mrec end", titulo: "Monto recibo", orden: true },
  { clase: "c-acc sep end", titulo: "Acciones" },
];

export type RowHandlers = {
  onOpen: (m: Movimiento) => void;
  onConciliar: (m: Movimiento) => void;
  onMenu: (accion: "adjunto" | "editar" | "eliminar", m: Movimiento) => void;
};

function Row({
  m,
  mostrarMotivo,
  siempreConciliar,
  onOpen,
  onConciliar,
  onMenu,
}: { m: Movimiento; mostrarMotivo: boolean; siempreConciliar: boolean } & RowHandlers) {
  const [menu, setMenu] = useState(false);
  const ref = useDismiss(menu, () => setMenu(false));
  const conciliar = siempreConciliar || necesitaConciliar(m);

  return (
    <div className="t-item">
      <div
        className="t-row"
        role="row"
        tabIndex={0}
        aria-label={`Ver detalle de ${m.razonSocial}`}
        onClick={() => onOpen(m)}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpen(m);
          }
        }}
      >
        <div className="t-cell c-flujo">
          <div className="flow">
            <span className="bank">{m.bancoOrigen}</span>
            <Icon name="arrow" size={11} />
            <span className="bank bank--dest">{m.bancoDestino}</span>
          </div>
        </div>
        <div className="t-cell c-fecha">
          <span className="strong">{m.fecha}</span>
          <span className="sub">{m.hora}</span>
        </div>
        <div className="t-cell c-razon">
          <span className="strong ellipsis">{m.razonSocial}</span>
          <span className="sub">{m.cuit}</span>
        </div>
        <div className="t-cell c-monto end">
          <span className="strong">{m.monto}</span>
        </div>
        <div className="t-cell c-analista sep wrap">{m.analista}</div>
        <div className="t-cell c-estado">
          <Chip estado={m.estadoConciliacion} />
        </div>
        <div className="t-cell c-fconc">
          <span>{m.fechaConciliacion}</span>
          <span className="sub">{m.horaConciliacion}</span>
        </div>
        <div className="t-cell c-comp end">{m.montoComprobante}</div>
        <div className="t-cell c-pend end">{m.pendienteCartera}</div>
        <div className="t-cell c-erec sep">
          <Chip estado={m.estadoRecibo} />
        </div>
        <div className="t-cell c-frec">
          <span>{m.fechaRecibo}</span>
          {m.horaRecibo && <span className="sub">{m.horaRecibo}</span>}
        </div>
        <div className="t-cell c-nrec" style={{ fontWeight: 500 }}>
          {m.numeroRecibo}
        </div>
        <div className="t-cell c-mrec end">{m.montoRecibo}</div>
        <div className="t-cell t-actions c-acc sep" ref={ref} onClick={(e) => e.stopPropagation()}>
          {conciliar && (
            <button className="icon-btn icon-btn--primary" aria-label="Conciliar manualmente" onClick={() => onConciliar(m)}>
              <Icon name="link" size={15} />
              <span className="tooltip" role="tooltip">
                Conciliar manualmente
              </span>
            </button>
          )}
          <button
            className="icon-btn icon-btn--ghost"
            aria-label="Más acciones"
            aria-haspopup="menu"
            aria-expanded={menu}
            onClick={() => setMenu((o) => !o)}
          >
            <Icon name="more" size={16} />
          </button>
          {menu && (
            <div className="popover row-menu" role="menu">
              <button role="menuitem" className="popover__item" onClick={() => (setMenu(false), onOpen(m))}>
                <Icon name="eye" size={16} />
                Ver detalle
              </button>
              <button role="menuitem" className="popover__item" onClick={() => (setMenu(false), onMenu("adjunto", m))}>
                <Icon name="paperclip" size={16} />
                Ver adjunto
              </button>
              <button role="menuitem" className="popover__item" onClick={() => (setMenu(false), onMenu("editar", m))}>
                <Icon name="pencil" size={16} />
                Editar comprobante
              </button>
              <div className="popover__sep" />
              <button
                role="menuitem"
                className="popover__item popover__item--danger"
                onClick={() => (setMenu(false), onMenu("eliminar", m))}
              >
                <Icon name="trash" size={16} />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      {mostrarMotivo && m.motivo && (
        <div className="reason">
          <span className={`reason__tag reason__tag--${m.motivo.tipo === "Error ERP" ? "danger" : "flag"}`}>
            <Icon name="alert" size={12} />
            Motivo · {m.motivo.tipo}
          </span>
          <span>{m.motivo.texto}</span>
        </div>
      )}
    </div>
  );
}

export function MovimientosTable({
  filas,
  mostrarMotivo = false,
  siempreConciliar = false,
  pie,
  paginas,
  ...handlers
}: {
  filas: Movimiento[];
  mostrarMotivo?: boolean;
  siempreConciliar?: boolean;
  pie: string;
  paginas: number;
} & RowHandlers) {
  return (
    <section className="table-card">
      <div className="table-scroll">
        <div className="table" role="table">
          <div className="t-groups">
            <div className="t-group g-mov">MOVIMIENTO</div>
            <div className="t-group g-conc sep">CONCILIACIÓN</div>
            <div className="t-group g-rec sep">RECIBO DE PAGO</div>
            <div className="t-group c-acc sep" />
          </div>
          <div className="t-head" role="row">
            {COLUMNAS.map((c, i) => (
              <div key={i} role="columnheader" className={`t-th ${c.clase}`}>
                {c.titulo}
                {c.orden && <Icon name="sort" size={11} />}
              </div>
            ))}
          </div>
          {filas.length === 0 ? (
            <div className="empty">No hay movimientos que coincidan con los filtros.</div>
          ) : (
            filas.map((m) => (
              <Row key={m.id} m={m} mostrarMotivo={mostrarMotivo} siempreConciliar={siempreConciliar} {...handlers} />
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
