import type { ReactNode, SVGProps } from "react";

// Íconos de línea (24x24, trazo 2). Sustituyen a los SVG del Figma con equivalentes del mismo estilo.

const PATHS: Record<string, ReactNode> = {
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M9 16v-5" />
      <path d="M13 16V8" />
      <path d="M17 16v-3" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  left: <path d="m15 6-6 6 6 6" />,
  right: <path d="m9 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  sliders: (
    <>
      <path d="M6 4v6M6 14v6M12 4v2M12 10v10M18 4v9M18 17v3" />
      <path d="M4 12h4M10 8h4M16 15h4" />
    </>
  ),
  sort: (
    <>
      <path d="m8 9 4-4 4 4" />
      <path d="m8 15 4 4 4-4" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  paperclip: <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.4 3.4 0 0 1 4.8 4.8l-8.3 8.3a1.8 1.8 0 0 1-2.5-2.5L14.5 7" />,
  pencil: (
    <>
      <path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m14 6 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 3.5h4M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  file: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5 12 4l9 5.5M4 20h16M6 10v7M10 10v7M14 10v7M18 10v7" />
    </>
  ),
  minus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
