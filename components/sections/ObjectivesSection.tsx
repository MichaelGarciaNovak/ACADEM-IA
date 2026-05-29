interface Props {
  label?: string
  valueProposition: string
  objectives: string[]   // up to 4, one per chapter
  bgColor?: string
  textColor?: string
  accentColor?: string
}

export default function ObjectivesSection({
  label,
  valueProposition,
  objectives,
  bgColor = '#ffffff',
  textColor = '#171a21',
  accentColor = '#ef476f',
}: Props) {
  // Filter out empty objectives
  const items = objectives.filter(Boolean)

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Label above both columns */}
        {label && (
          <p
            className="text-xs font-mono uppercase tracking-widest mb-8"
            style={{ color: accentColor }}
          >
            {label}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: propuesta de valor ─────────────────── */}
          <div className="md:sticky md:top-24">
            <p
              className="font-mono font-normal uppercase leading-tight"
              style={{
                color: textColor,
                fontSize: 'clamp(1.875rem, 3.2vw, 2.25rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {valueProposition}
            </p>
          </div>

          {/* ── RIGHT: objetivos por capítulo ────────────── */}
          <div className="flex flex-col" style={{ borderTop: `1px solid ${textColor}15` }}>
            {items.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-6"
                style={{ borderBottom: `1px solid ${textColor}15` }}
              >
                {/* Chapter number */}
                <span
                  className="text-xs font-mono flex-shrink-0 mt-0.5 w-10"
                  style={{ color: accentColor }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Objective text */}
                <p
                  className="font-mono font-normal leading-snug"
                  style={{
                    color: textColor,
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {obj}
                </p>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-xs font-mono py-6" style={{ color: textColor + '35' }}>
                sin objetivos configurados
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
