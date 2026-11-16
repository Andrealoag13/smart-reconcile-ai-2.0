// Temas de la aplicación. Los colores de cada tema viven en styles.css
// bajo [data-theme="..."]; acá solo va lo que no es CSS (textos y logo).

export type ThemeId = "baufest" | "cliente";

export type Theme = {
  id: ThemeId;
  nombre: string;
  /** Ruta a un archivo de logo (por ejemplo "/logo-cliente.svg" dentro de /public). */
  logoSrc?: string;
  /** Nombre que se muestra junto al logo o en su lugar. */
  marca: string;
  lema?: string;
  /** Firma que aparece debajo del nombre del producto. */
  subtitulo: string;
};

export const THEMES: Record<ThemeId, Theme> = {
  baufest: {
    id: "baufest",
    nombre: "Diseño Figma",
    marca: "baufest",
    lema: "evolving business together",
    subtitulo: "Automatización del flujo de CXC",
  },
  cliente: {
    id: "cliente",
    nombre: "Propuesta cliente",
    // Para usar el logo oficial: copiar el archivo a /public/logo-cliente.svg
    // y descomentar la línea siguiente.
    // logoSrc: "/logo-cliente.svg",
    marca: "Pernod Ricard",
    subtitulo: "Automatización del flujo de CXC · by Baufest",
  },
};
