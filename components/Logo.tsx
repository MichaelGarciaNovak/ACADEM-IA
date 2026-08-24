import Logomark from './brand/Logomark'

interface LogoProps {
  /** Describe el fondo: 'dark' = fondo oscuro, 'light' = fondo claro. */
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  /** Color del isotipo y de la palabra "Orange". */
  accentColor?: string
  /** Antepone el isotipo al wordmark (por defecto va solo el texto). */
  showMark?: boolean
  /** Solo el isotipo, sin texto. */
  markOnly?: boolean
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
}

/** Gris cálido de marca para la palabra "Academy" sobre fondo claro. */
const ACADEMY_INK = '#3b3e38'

export default function Logo({
  variant = 'dark',
  size = 'md',
  accentColor = '#FF6900',
  showMark = false,
  markOnly = false,
}: LogoProps) {
  const academyColor = variant === 'dark' ? '#ffffff' : ACADEMY_INK

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${sizes[size]}`}>
      {/* El isotipo se apoya en la línea base y la hoja sobresale sobre las
          mayúsculas. Medidas: la caja alta de Nimbus es 0.68em y el anillo ocupa
          2902 de las 4000 unidades del viewBox, así que 0.956em de alto deja el
          anillo un 2% por encima de la caja alta — el desborde óptico que lleva
          cualquier letra redonda. El translate reparte ese 2% entre arriba y abajo. */}
      {(showMark || markOnly) && (
        <Logomark
          color={accentColor}
          className={`h-[0.956em] w-auto shrink-0 translate-y-[0.007em] self-baseline ${
            markOnly ? '' : 'mr-[0.22em]'
          }`}
        />
      )}
      {!markOnly && (
        <>
          <span
            className="font-sans font-normal tracking-[-0.01em]"
            style={{ color: accentColor }}
          >
            Orange
          </span>
          <span
            className="ml-[0.18em] font-serif font-light"
            style={{ color: academyColor }}
          >
            Academy
          </span>
        </>
      )}
    </span>
  )
}
