/**
 * Isotipo Orange — naranja + hoja.
 *
 * Redibujado como vectores a partir de ®ORANGE_LOGOMARK_OG.png midiendo la
 * geometría original pixel a pixel:
 *   · anillo — centro (1459.5, 2564.5), radio exterior 1450.75, interior 775
 *   · hoja   — lente de dos arcos de radio 677 entre las puntas opuestas
 *
 * El viewBox está ajustado a la tinta (sin margen), así que la base del SVG
 * coincide con la base del anillo: alineado a la línea base del texto, la
 * "o" se apoya en ella y la hoja sobresale por encima de las mayúsculas.
 */
export default function Logomark({
  className = '',
  color = 'currentColor',
  style,
}: {
  className?: string
  color?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="9 16 2902 4000"
      fill={color}
      className={className}
      style={style}
      role="img"
      aria-label="Orange"
      focusable="false"
    >
      {/* Anillo — evenodd recorta el hueco central */}
      <path
        fillRule="evenodd"
        d="M1459.5,1113.75 a1450.75,1450.75 0 1,1 0,2901.5 a1450.75,1450.75 0 1,1 0,-2901.5 Z
           M1459.5,1789.5 a775,775 0 1,0 0,1550 a775,775 0 1,0 0,-1550 Z"
      />
      {/* Hoja */}
      <path d="M1461.19,744.81 A677,677 0 0,1 2188.81,17.19 A677,677 0 0,1 1461.19,744.81 Z" />
    </svg>
  )
}
