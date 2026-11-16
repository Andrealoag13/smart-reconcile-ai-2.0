import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../icons";
import { ANALISTAS, necesitaConciliar, type Movimiento } from "../data";
import { Chip } from "./Table";

type Pestana = "resumen" | "cuenta" | "comprobantes" | "cartera" | "recibo";

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "cuenta", label: "Estado de cuenta" },
  { id: "comprobantes", label: "Comprobantes" },
  { id: "cartera", label: "Cartera" },
  { id: "recibo", label: "Recibo" },
];

const SIN = "—";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="dato">
      <span className="dato__label">{etiqueta}</span>
      <span className="dato__value">{valor}</span>
    </div>
  );
}

function Tarjeta({ etiqueta, valor, chip, nota }: { etiqueta: string; valor: string; chip?: string; nota?: string }) {
  return (
    <div className="d-card">
      <span className="dato__label">{etiqueta}</span>
      <div className="d-card__row">
        <span className="d-card__value">{valor}</span>
        {chip && <Chip estado={chip} />}
      </div>
      {nota && <span className="d-card__note">{nota}</span>}
    </div>
  );
}

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div className="d-block">
      <span className="d-subtitle">{titulo}</span>
      <ul className="d-checks">
        {items.map((n) => (
          <li key={n}>
            <Icon name="check" size={14} />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Contador({ titulo, n }: { titulo: string; n: number }) {
  return (
    <div className="d-count">
      <span>{titulo}</span>
      <span className="d-count__n">{n}</span>
    </div>
  );
}

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Detalle del movimiento — se abre al hacer clic en una fila. */
export function DetalleModal({
  m,
  onClose,
  onReintentar,
  onConciliar,
  onAnalista,
  onComentar,
  onAccion,
}: {
  m: Movimiento;
  onClose: () => void;
  onReintentar: (m: Movimiento) => void;
  onConciliar: (m: Movimiento) => void;
  onAnalista: (m: Movimiento, analista: string) => void;
  onComentar: (m: Movimiento, texto: string) => void;
  onAccion: (texto: string) => void;
}) {
  const [pestana, setPestana] = useState<Pestana>("resumen");
  const [comentario, setComentario] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const d = m.detalle ?? {};
  const comentarios = m.comentarios ?? [];
  const hayError = m.estadoRecibo === "Error" && m.errorRecibo;
  const hayComprobante = m.montoComprobante !== SIN;

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

  let contenido: ReactNode;
  if (pestana === "resumen") {
    contenido = (
      <>
        <div className="d-row">
          <Tarjeta
            etiqueta="PROCESO DE CONCILIACIÓN"
            valor={`${m.fechaConciliacion}/2026 · ${m.horaConciliacion}`}
            chip={m.estadoConciliacion}
            nota={d.notaConciliacion ?? m.motivo?.texto}
          />
          <Tarjeta
            etiqueta="RECIBO DE PAGO"
            valor={m.fechaRecibo === SIN ? SIN : `${m.fechaRecibo}/2026 · ${m.horaRecibo}`}
            chip={m.estadoRecibo}
            nota={hayError ? "El ERP rechazó el recibo · ver pestaña Recibo" : undefined}
          />
        </div>
        <div className="d-row d-row--top">
          <Tarjeta etiqueta="MONTO MOVIMIENTO" valor={m.monto} />
          <Tarjeta etiqueta="MONTO COMPROBANTES" valor={m.montoComprobante} nota={d.notaComprobantes} />
          <Tarjeta etiqueta="IMPORTE PENDIENTE CARTERA" valor={m.pendienteCartera} nota={d.notaCartera} />
        </div>
        {d.notas && <Lista titulo="Notas de conciliación" items={d.notas} />}
        <div className="d-comments">
          <div className="d-comments__title">
            <strong>Comentarios</strong>
            <span className="d-count__n">{comentarios.length}</span>
          </div>
          {comentarios.map((c, i) => (
            <div className="d-comment" key={i}>
              <span className={`d-comment__avatar d-comment__avatar--${i % 2 ? "b" : "a"}`}>{iniciales(c.autor)}</span>
              <div className="d-comment__body">
                <div className="d-comment__meta">
                  <strong>{c.autor}</strong>
                  <span>{c.fecha}</span>
                </div>
                <p>{c.texto}</p>
              </div>
            </div>
          ))}
          <form
            className="d-comment-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!comentario.trim()) return;
              onComentar(m, comentario.trim());
              setComentario("");
            }}
          >
            <input
              id="nuevo-comentario"
              aria-label="Escribir un comentario"
              placeholder="Escribir un comentario…"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button className="btn btn--primary" type="submit">
              Comentar
            </button>
          </form>
        </div>
      </>
    );
  } else if (pestana === "cuenta") {
    const ec = d.estadoCuenta;
    contenido = (
      <>
        <div className="d-grid">
          <Dato etiqueta="FECHA" valor={m.fechaLarga} />
          <Dato etiqueta="HORA DEPÓSITO" valor={m.hora} />
          <Dato etiqueta="SUCURSAL" valor={ec?.sucursal ?? SIN} />
          <Dato etiqueta="DESCRIPCIÓN" valor={ec?.descripcion ?? SIN} />
          <Dato etiqueta="IMPORTE" valor={m.monto} />
          <Dato etiqueta="RAZÓN SOCIAL" valor={m.razonSocial} />
          <Dato etiqueta="REFERENCIA" valor={ec?.referencia ?? SIN} />
          <Dato etiqueta="CONCEPTO" valor={ec?.concepto ?? SIN} />
          <Dato etiqueta="CUIT" valor={m.cuit} />
        </div>
        <span className="d-section">FLUJO BANCARIO</span>
        <div className="d-flow">
          <div className="dato">
            <span className="dato__label">Banco origen</span>
            <span className="dato__value">{ec?.cuentaOrigen ?? m.bancoOrigenNombre}</span>
          </div>
          <Icon name="arrow" size={16} />
          <div className="dato">
            <span className="dato__label">Banco destino</span>
            <span className="dato__value">{ec?.cuentaDestino ?? m.bancoDestinoNombre}</span>
          </div>
        </div>
        {ec && <span className="d-foot-note">{ec.extracto}</span>}
      </>
    );
  } else if (pestana === "comprobantes") {
    const filas = d.comprobantes ?? [];
    contenido = (
      <>
        <Contador titulo="PAGOS LEÍDOS POR IA ASOCIADOS AL MOVIMIENTO" n={filas.length} />
        {filas.length > 0 ? (
          <div className="d-table-wrap">
            <table className="d-table">
              <thead>
                <tr>
                  <th>N° REG.</th>
                  <th>CUIT</th>
                  <th>RAZÓN SOCIAL</th>
                  <th>FECHA PAGO</th>
                  <th className="num">MONTO PAGADO</th>
                  <th>N° FACTURA</th>
                  <th className="num">CONF.</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filas.map((c) => (
                  <tr key={c.registro}>
                    <td className="strong">{c.registro}</td>
                    <td>{m.cuit}</td>
                    <td>{m.razonSocial}</td>
                    <td>{c.fechaPago}</td>
                    <td className="num">{c.monto}</td>
                    <td>{c.factura}</td>
                    <td className="num">{c.confianza}</td>
                    <td>
                      <div className="d-table__actions">
                        <button aria-label="Ver original" onClick={() => onAccion("Ver comprobante original: pantalla fuera de esta entrega")}>
                          <Icon name="eye" size={14} />
                        </button>
                        <button aria-label="Descargar" onClick={() => onAccion("Descarga no disponible en la demo")}>
                          <Icon name="download" size={14} />
                        </button>
                        <button aria-label="Editar" onClick={() => onAccion("Editar comprobante: pantalla fuera de esta entrega")}>
                          <Icon name="pencil" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="d-empty">
            {hayComprobante
              ? "El detalle del comprobante no está cargado en los datos de ejemplo."
              : "Este movimiento todavía no tiene comprobantes asociados."}
          </div>
        )}
        {d.archivo && (
          <div className="d-file">
            <Icon name="file" size={20} />
            <div className="d-file__text">
              <strong>{d.archivo.nombre}</strong>
              <span>{d.archivo.origen}</span>
            </div>
            <button className="btn" onClick={() => onAccion("Ver comprobante original: pantalla fuera de esta entrega")}>
              <Icon name="eye" size={16} />
              Ver comprobante original
            </button>
          </div>
        )}
        <div className="d-total">
          <span>Monto comprobantes:</span>
          <strong>{m.montoComprobante}</strong>
        </div>
      </>
    );
  } else if (pestana === "cartera") {
    const filas = m.facturas ?? [];
    contenido = (
      <>
        <Contador titulo="FACTURAS DE LA CARTERA" n={filas.length} />
        {filas.length > 0 ? (
          <div className="d-table-wrap">
            <table className="d-table">
              <thead>
                <tr>
                  <th>FOLIO FACTURA</th>
                  <th>TRANS.</th>
                  <th>CARTERA</th>
                  <th>ANALISTA</th>
                  <th>EMISIÓN</th>
                  <th>VENCE</th>
                  <th className="num">IMPORTE PENDIENTE</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.folio}>
                    <td className="strong">{f.folio}</td>
                    <td>{f.trans ?? SIN}</td>
                    <td>{f.cartera ?? SIN}</td>
                    <td>{f.analista ?? SIN}</td>
                    <td>{f.emision ?? SIN}</td>
                    <td>{f.vence}</td>
                    <td className="num">{f.pendiente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="d-empty">
            {m.pendienteCartera === SIN
              ? "No hay facturas de cartera asociadas a este movimiento."
              : "El detalle de facturas no está cargado en los datos de ejemplo."}
          </div>
        )}
        <div className="d-total">
          <span>Importe pendiente cartera:</span>
          <strong>{m.pendienteCartera}</strong>
        </div>
        {d.fotoCartera && <span className="d-foot-note">{d.fotoCartera}</span>}
      </>
    );
  } else {
    const aplicado = m.estadoRecibo === "Aplicado";
    contenido = (
      <>
        <div className="d-grid">
          <Dato etiqueta="NÚMERO DE RECIBO" valor={m.numeroRecibo} />
          <Dato etiqueta="NÚMERO DE CLIENTE" valor={d.recibo?.numeroCliente ?? SIN} />
          <Dato etiqueta="CLIENTE" valor={m.razonSocial} />
          <Dato etiqueta="FECHA DE APLICACIÓN" valor={aplicado ? `${m.fechaRecibo}/2026` : SIN} />
          <Dato etiqueta="MÉTODO DE RECIBO" valor={d.recibo?.metodo ?? SIN} />
          <Dato etiqueta="IMPORTE RECIBO ASIGNADO" valor={m.montoRecibo} />
        </div>
        {d.recibo && <Lista titulo="Validaciones previas al ERP" items={d.recibo.validaciones} />}
      </>
    );
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detalle" role="dialog" aria-modal="true" aria-label={`Detalle del movimiento de ${m.razonSocial}`} tabIndex={-1} ref={ref}>
        <div className="detalle__head">
          <div className="detalle__mov">
            <div className="detalle__title">
              <h2>{m.razonSocial}</h2>
              <span>{m.cuit}</span>
            </div>
            <div className="detalle__meta">
              <span className="bank bank--strong">{m.bancoDestino}</span>
              <span>
                {m.fechaLarga} · {m.hora}
              </span>
              <span className="dot" />
              <strong>{m.monto}</strong>
            </div>
            <div className="detalle__chips">
              <Chip estado={m.estadoConciliacion} />
              <Chip estado={m.estadoRecibo} />
            </div>
          </div>
          <div className="detalle__actions">
            <div className="detalle__actions-row">
              <label className="analista-select">
                <span>Analista:</span>
                <select value={m.analista} onChange={(e) => onAnalista(m, e.target.value)}>
                  {!ANALISTAS.includes(m.analista) && <option>{m.analista}</option>}
                  {ANALISTAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <button className="detalle__close" aria-label="Cerrar" onClick={onClose}>
                <Icon name="x" size={18} />
              </button>
            </div>
            {necesitaConciliar(m) && (
              <button className="btn btn--primary" onClick={() => onConciliar(m)}>
                <Icon name="link" size={16} />
                Conciliar
              </button>
            )}
          </div>
        </div>

        <div className="detalle__tabs" role="tablist">
          {PESTANAS.map((p) => (
            <button key={p.id} role="tab" aria-selected={p.id === pestana} onClick={() => setPestana(p.id)}>
              {p.label}
            </button>
          ))}
        </div>

        {hayError && m.errorRecibo && (
          <div className="erp-alert" role="alert">
            <Icon name="alert" size={18} />
            <div className="erp-alert__text">
              <strong>El ERP rechazó el recibo de pago</strong>
              <span>{m.errorRecibo.aviso ?? m.errorRecibo.texto}</span>
            </div>
            {pestana !== "recibo" && (
              <button className="erp-alert__link" onClick={() => setPestana("recibo")}>
                Ver en Recibo
              </button>
            )}
            <button className="btn" onClick={() => onReintentar(m)}>
              <Icon name="refresh" size={16} />
              Reintentar
            </button>
          </div>
        )}

        <div className="detalle__body" role="tabpanel">
          {contenido}
        </div>

        <div className="detalle__foot">
          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
          {pestana === "comprobantes" && (
            <button className="btn btn--primary" onClick={() => onAccion("Cambios guardados")}>
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
