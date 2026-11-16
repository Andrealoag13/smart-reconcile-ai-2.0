import { Icon } from "../icons";
import type { Theme } from "../themes";

export type TabId = "monitor" | "comprobantes" | "excepciones" | "cartera" | "pagos" | "extractos";

export type TabDef = { id: TabId; label: string; count?: number };

export function Appbar({ theme }: { theme: Theme }) {
  return (
    <header className="appbar">
      {theme.id === "baufest" ? (
        <div className="brand">
          <span className="brand__name">{theme.marca}</span>
          {theme.lema && <span className="brand__tagline">{theme.lema}</span>}
        </div>
      ) : theme.logoSrc ? (
        <div className="brand brand--logo">
          <img src={theme.logoSrc} alt={theme.marca} />
        </div>
      ) : (
        <div className="brand-slot">
          <span className="brand-slot__box">Logo del cliente</span>
          <span className="brand-slot__name">{theme.marca}</span>
        </div>
      )}
      <div className="appbar__divider" />
      <div className="product">
        <span className="product__name">Smart Reconcile AI</span>
        <span className="product__sub">{theme.subtitulo}</span>
      </div>
      <div className="spacer" />
      <button className="appbar__btn" aria-label="Actualizar">
        <Icon name="refresh" size={18} />
      </button>
      <div className="avatar" aria-label="Usuario: Andrea">A</div>
    </header>
  );
}

export function Navbar({ tabs, active, onChange }: { tabs: TabDef[]; active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="navbar" role="tablist" aria-label="Secciones">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === active} className="tab" onClick={() => onChange(t.id)}>
          <span className="tab__content">
            <span className="tab__label">{t.label}</span>
            {t.count !== undefined && <span className="tab__count">{t.count}</span>}
          </span>
          <span className="tab__indicator" />
        </button>
      ))}
      <div className="spacer" />
      <button className="nav-reports">
        <Icon name="chart" size={16} />
        Reportes y dashboard
        <Icon name="chevron" size={14} />
      </button>
    </nav>
  );
}

export function PageHeader({ title, subtitle, onRefresh }: { title: string; subtitle: string; onRefresh: () => void }) {
  return (
    <div className="page-header">
      <div className="page-header__title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="updated">Actualizado 20/10/2026 · 11:16</span>
      <button className="btn" onClick={onRefresh}>
        <Icon name="refresh" size={16} />
        Actualizar
      </button>
      <button className="btn">
        <Icon name="download" size={16} />
        Exportar
      </button>
    </div>
  );
}
