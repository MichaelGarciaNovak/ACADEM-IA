import localFont from 'next/font/local'

// Nimbus Sans D OT — tipografía de marca (Orange Academy)
export const nimbus = localFont({
  src: [
    { path: './fonts/NimbusSansDOT-Ligh.otf', weight: '300', style: 'normal' },
    { path: './fonts/NimbusSansDOT-LighItal.otf', weight: '300', style: 'italic' },
    { path: './fonts/NimbusSansDOT-Regu.otf', weight: '400', style: 'normal' },
    { path: './fonts/NimbusSansDOT-ReguItal.otf', weight: '400', style: 'italic' },
    { path: './fonts/NimbusSansDOT-Bold.otf', weight: '700', style: 'normal' },
    { path: './fonts/NimbusSansDOT-BoldItal.otf', weight: '700', style: 'italic' },
    { path: './fonts/NimbusSansDOT-Blac.otf', weight: '900', style: 'normal' },
    { path: './fonts/NimbusSansDOT-BlacItal.otf', weight: '900', style: 'italic' },
  ],
  variable: '--font-nimbus',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
})

// Versión condensada — para titulares y etiquetas
export const nimbusCond = localFont({
  src: [
    { path: './fonts/NimbusSansDOT-LighCond.otf', weight: '300', style: 'normal' },
    { path: './fonts/NimbusSansDOT-ReguCond.otf', weight: '400', style: 'normal' },
    { path: './fonts/NimbusSansDOT-ReguCondItal.otf', weight: '400', style: 'italic' },
    { path: './fonts/NimbusSansDOT-BoldCond.otf', weight: '700', style: 'normal' },
    { path: './fonts/NimbusSansDOT-BoldCondItal.otf', weight: '700', style: 'italic' },
    { path: './fonts/NimbusSansDOT-BlacCond.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-nimbus-cond',
  display: 'swap',
  fallback: ['Helvetica Neue Condensed', 'Arial Narrow', 'sans-serif'],
})

// Plantin Std — serif de marca (la palabra "Academy" del logo y acentos editoriales)
export const plantin = localFont({
  src: [
    { path: './fonts/PlantinStd-Light.otf', weight: '300', style: 'normal' },
    { path: './fonts/PlantinStd-LightItalic.otf', weight: '300', style: 'italic' },
    { path: './fonts/PlantinStd-Regular.otf', weight: '400', style: 'normal' },
    { path: './fonts/PlantinStd-Italic.otf', weight: '400', style: 'italic' },
    { path: './fonts/PlantinStd-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-plantin',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
