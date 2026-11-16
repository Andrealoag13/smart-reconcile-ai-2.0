import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "../icons";
import { ANALISTAS, type Movimiento } from "../data";

function Modal({
  icono,
  titulo,
  subtitulo,
  clase,
  onClose,
  children,
  pie,
}: {
  icono: IconName;
  titulo: string;
  subtitulo: string;
  clase: string;
  onClose: () => void;
  children: ReactNode;
  pie: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${clase}`} role="dialog" aria-modal="true" aria-label={titulo} tabIndex={-1} ref={ref}>
        <div className="modal__head">
          <div className="modal__icon">
            <Icon name={icono} size={20} />
          </div>
          <div className="modal__titles">
            <h2>{titulo}</h2>
            <p>{subtitulo}</p>
          </div>
          <button className="modal__close" aria-label="Cerrar" onClick={onClose}>
            <Icon name="x" size={15} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__foot">{pie}</div>
      </div>
    </div>
  );
}

/** Aplicar conciliación — se abre con el botón Conciliar de la fila. */
export function ConciliarModal({
  m,
  onClose,
  onAplicar,
}: {
  m: Movimiento;
  onClose: () => void;
  onAplicar: (m: Movimiento, analista: string) => void;
}) {
  const [analista, setAnalista] = useState(ANALISTAS.includes(m.analista) ? m.analista : "");
  const [marcadas, setMarcadas] = useState<Record<string, boolean>>(
    Object.fromEntries((m.facturas ?? []).map((f) => [f.folio, true])),
  );
  const coincide = m.montoComprobante === m.monto && m.pendienteCartera === m.monto;

  return (
    <Modal
      icono="link"
      titulo="Aplicar conciliación"
      subtitulo="Relaciona este comprobante con un pago esperado"
      clase="modal--conciliar"
      onClose={onClose}
      pie={
        <>
          <button className="m-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="m-btn m-btn--primary" disabled={!analista} onClick={() => onAplicar(m, analista)}>
            Aplicar conciliación
          </button>
        </>
      }
    >
      <div className="summary">
        <span className="label label--plain">MOVIMIENTO BANCARIO</span>
        <div className="summary__row">
          <span>
            {m.bancoDestinoNombre.replace("Banco ", "")} · {m.fechaLarga} {m.hora}
          </span>
          <div className="spacer" />
          <span className="summary__amount">{m.monto}</span>
        </div>
      </div>

      <div className="summary summary--bordered">
        <span className="label">COMPROBANTE RECIBIDO</span>
        {m.comprobanteId && <span className="summary__id">{m.comprobanteId}</span>}
        <div className="summary__row">
          <strong style={{ fontWeight: 600 }}>{m.razonSocial}</strong>
          <span className="summary__amount summary__amount--lg">{m.montoComprobante}</span>
        </div>
        {m.procesado && <span className="hint">Procesado el {m.procesado}</span>}
      </div>

      <div className="block">
        <label className="label" htmlFor="pago-esperado">
          PAGO ESPERADO A CONCILIAR
        </label>
        <select id="pago-esperado" className="select" defaultValue="0">
          <option value="0">
            {m.razonSocial} — {m.pendienteCartera} · {m.fechaLarga}
          </option>
        </select>
      </div>

      {m.facturas && (
        <div className="block" style={{ gap: 6 }}>
          <span className="label label--plain">FACTURAS DE CARTERA A CANCELAR</span>
          {m.facturas.map((f) => (
            <label className="check-row" key={f.folio}>
              <input
                type="checkbox"
                checked={marcadas[f.folio] ?? false}
                onChange={(e) => setMarcadas((s) => ({ ...s, [f.folio]: e.target.checked }))}
              />
              <span className="check-row__box">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
              <span className="check-row__folio">{f.folio}</span>
              <span className="check-row__amount">{f.pendiente}</span>
            </label>
          ))}
        </div>
      )}

      {coincide ? (
        <div className="banner banner--success banner--lg">
          <Icon name="check" size={17} />
          Coincidencia perfecta: CUIT y monto iguales en banco, comprobante y cartera
        </div>
      ) : (
        m.motivo && (
          <div className="banner banner--flag banner--lg">
            <Icon name="alert" size={17} />
            {m.motivo.texto}
          </div>
        )
      )}

      <div className="analyst-row">
        <label htmlFor="analista">Analista</label>
        <div className="spacer" />
        <select id="analista" className="select select--inline" value={analista} onChange={(e) => setAnalista(e.target.value)}>
          {!analista && <option value="">Sin asignar</option>}
          {ANALISTAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
