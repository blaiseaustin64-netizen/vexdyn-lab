import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function Home({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function Code2({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function BarChart3({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

export function User({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function ArrowRight({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function Play({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

export function Search({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function Filter({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function RotateCcw({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function ChevronRight({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Lightbulb({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

export function CheckCircle2({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function XCircle({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

export function Loader2({ size = 16, className = '', ...p }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...p}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function BookOpen({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function Wrench({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
