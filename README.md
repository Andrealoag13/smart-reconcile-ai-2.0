# Smart Reconcile AI — prototipo navegable

Prototipo en código de las pantallas de "Lo que proponemos" del Figma
(`Smart-Reconcile-AI`, página **Comparativa · Tenemos / OXXO / Proponemos**).

## Qué incluye

| Pantalla | Frame de Figma |
| --- | --- |
| Monitor de conciliación | `453:289` |
| Gestión de excepciones | `637:4225` |
| Detalle del movimiento con pestañas (con y sin error de recibo) | `627:3135`, `451:1633`, `627:3245`, `451:1892`, `627:3213` |
| Aplicar conciliación | `693:1835` |

Interacciones: pestañas, búsqueda y filtros con chips, menú de tres puntos por fila,
tooltip de "Conciliar manualmente", detalle al hacer clic en una fila, reintento del
recibo rechazado por el ERP y conciliación manual. Los datos son de ejemplo (`src/data.ts`).

Fuera de esta entrega: Comprobantes, Cartera de clientes, Pagos esperados, Extractos
bancarios, Reportes, "Más filtros", edición/eliminación y vista del adjunto.

## Cómo correrlo

```bash
npm install
npm run dev            # servidor local
npm run build          # build de producción en /dist
npm run build:preview  # un único HTML autocontenido en /dist-preview (con selector de vista)
npm run build:cliente  # versión solo para el cliente, sin selector, en /dist-cliente
npm run build:docs     # regenera /docs (lo que publica GitHub Pages)
```

## Temas

Hay dos temas, que se cambian con el selector "Vista" (abajo a la izquierda) o con
`?tema=cliente` en la URL:

- **Diseño Figma** (`baufest`): los tokens de la colección "Baufest Tokens".
- **Propuesta cliente** (`cliente`): paleta de partida para el cliente. Los colores están
  en `src/styles.css` bajo `[data-theme="cliente"]` y hay que ajustarlos con su manual de marca.

El logo del cliente está en `src/assets/logo-cliente.svg` (versión blanca, para la barra oscura).
Para cambiarlo, reemplazar ese archivo.

## Estructura

```
src/
  App.tsx              estado, pestañas y páginas
  data.ts              tipos y datos de ejemplo
  themes.ts            textos y logo por tema
  styles.css           tokens y estilos
  icons.tsx            íconos de línea
  components/
    Shell.tsx          appbar, pestañas, encabezado de página
    Filters.tsx        barra de filtros y chips
    Table.tsx          tabla, fila, chips de estado, menú
    Detalle.tsx        Detalle del movimiento (pestañas y franja de error)
    Modals.tsx         Aplicar conciliación
```

Nota: los íconos son equivalentes de línea dibujados en código, no los SVG exportados del Figma.

## Publicación (GitHub Pages)

La carpeta `docs/` tiene las dos versiones ya compiladas:

- `docs/index.html` → versión original, con selector de vista
- `docs/cliente/index.html` → versión del cliente, sin selector

GitHub Pages las publica desde la rama `main`, carpeta `/docs`. Después de cambiar el código,
correr `npm run build:docs` y subir los cambios.
