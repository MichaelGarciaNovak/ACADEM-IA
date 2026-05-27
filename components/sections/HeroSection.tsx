interface HeroSectionProps {
  title: string
  label?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  bgColor?: string
  accentColor?: string
  textColor?: string
  textureSymbol?: string
  textureOpacity?: number  // 1–20
  textureColor?: string
}

const DEFAULT_TEXTURE = 'system.online // adaptive_learning.active // cognitive_layer.initialized // reduce_friction(); // increase_clarity(); // AI_WORKFLOW.CONNECTED // human_input + ai_reasoning // operating_at_machine_speed // creative_engine.active // visibility.optimized // future.loading // '

function buildTextureRows(text: string, charsPerRow = 160, rowCount = 100): string[] {
  // Repeat text until we have enough characters for all rows
  let long = ''
  while (long.length < charsPerRow * rowCount) long += text
  // Slice into rows — each row continues where the previous left off
  const rows: string[] = []
  for (let i = 0; i < rowCount; i++) {
    rows.push(long.slice(i * charsPerRow, (i + 1) * charsPerRow))
  }
  return rows
}

export default function HeroSection({
  title = 'ΛCΛDEM*IΛ',
  label = 'plataforma educativa',
  subtitle = 'Aprende con propósito.',
  ctaText = 'Empezar gratis',
  ctaLink = '/registro',
  bgColor = '#171a21',
  accentColor = '#ef476f',
  textColor = '#dddfdf',
  textureSymbol = DEFAULT_TEXTURE,
  textureOpacity = 5,
  textureColor = '#dddfdf',
}: HeroSectionProps) {
  const mutedColor = textColor + 'aa'  // ~67% opacity version of textColor

  const rows = buildTextureRows(DEFAULT_TEXTURE)

  const opacity = (textureOpacity ?? 5) / 100

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: bgColor, minHeight: '92vh' }}
    >
      {/* Texture — fills the full background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 select-none pointer-events-none overflow-hidden"
      >
        {rows.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.95rem',
              fontWeight: 400,
              lineHeight: 1.25,
              letterSpacing: '0.01em',
              whiteSpace: 'pre',
              color: textureColor,
              opacity: opacity,
            }}
          >
            {line || ' '}
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col justify-center"
        style={{ minHeight: '92vh' }}
      >
        <div className="max-w-3xl pt-32 pb-24">
          {label && (
            <p
              className="text-xs uppercase tracking-widest font-mono font-normal mb-6"
              style={{ color: accentColor }}
            >
              {label}
            </p>
          )}

          <h1
            className="font-mono font-normal uppercase leading-none mb-8"
            style={{
              color: textColor,
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {title.split('*').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span style={{ color: accentColor }}>*</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h1>

          {subtitle && (
            <p
              className="font-mono font-normal uppercase text-base mb-12 max-w-xl"
              style={{ color: mutedColor }}
            >
              {subtitle}
            </p>
          )}

          {ctaText && (
            <a
              href={ctaLink}
              className="inline-block font-mono font-normal uppercase text-sm px-8 py-4 transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
