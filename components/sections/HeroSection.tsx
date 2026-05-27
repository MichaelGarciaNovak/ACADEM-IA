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

function buildTextureLine(template: string, targetLen = 360): string {
  if (!template.trim()) return ''
  let out = ''
  while (out.length < targetLen) out += template + '  '
  return out.slice(0, targetLen)
}

const DEFAULT_TEXTURE = 'system.online // adaptive_learning.active // cognitive_layer.initialized // reduce_friction(); // increase_clarity(); // AI_WORKFLOW.CONNECTED // human_input + ai_reasoning // operating_at_machine_speed // creative_engine.active // visibility.optimized // future.loading // system.online // adaptive_learning.active // cognitive_layer.initialized // reduce_friction(); // increase_clarity(); // AI_WORKFLOW.CONNECTED // system.online // adaptive_learning.active // cognitive_layer.initialized // reduce_friction(); // increase_clarity(); // AI_WORKFLOW.CONNECTED // '

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

  const line = buildTextureLine(DEFAULT_TEXTURE)
  const rows: string[] = []
  while (rows.length < 100) rows.push(line)

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
