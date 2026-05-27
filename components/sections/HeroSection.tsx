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

// Short code-like lines that get tiled horizontally to fill the full width
const CODE_TEMPLATES = (s: string) => [
  `import { ${s} } from '@academ.ia/core'`,
  ``,
  `const section = { render: () => ${s}.init(), theme: '${s}', version: '1.0.0' }`,
  ``,
  `export default function Page() {`,
  `  const data = use${s.replace(/[^\w]/g, '')}()`,
  `  return <${s} {...data} />`,
  `}`,
  ``,
  `type ${s.replace(/[^\w]/g, '')}Props = { id: string; title: string; published: boolean }`,
  ``,
  `async function fetch(id: string) {`,
  `  const res = await db.from('sections').select('*').eq('type', '${s}').single()`,
  `  return res.data`,
  `}`,
  ``,
  `/* ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} ${s} */`,
  ``,
  `const config: Config = { symbol: '${s}', opacity: 0.05, repeat: true }`,
  ``,
]

function buildTextureLine(template: string, targetLen = 320): string {
  if (!template.trim()) return ''
  let out = ''
  while (out.length < targetLen) out += template + '     '
  return out.slice(0, targetLen)
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
  textureSymbol = 'ΛCΛDEM*IΛ',
  textureOpacity = 5,
  textureColor = '#dddfdf',
}: HeroSectionProps) {
  const mutedColor = textColor + 'aa'  // ~67% opacity version of textColor

  const templates = CODE_TEMPLATES(textureSymbol)
  // Tile vertically until we have enough lines to fill ~120vh at 0.7rem/1.7lh ≈ 80 lines
  const rows: string[] = []
  while (rows.length < 90) {
    templates.forEach((t) => rows.push(buildTextureLine(t)))
  }

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
              fontSize: '0.85rem',
              fontWeight: 400,
              lineHeight: 1.72,
              letterSpacing: '0.01em',
              whiteSpace: 'pre',
              color: textureColor,
              opacity: line.trim() === '' ? 0 : opacity,
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
