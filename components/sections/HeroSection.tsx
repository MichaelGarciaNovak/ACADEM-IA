import AnimatedTitle from './AnimatedTitle'

interface HeroSectionProps {
  title: string
  titleVariants?: string[]  // if provided with 2+, animates between them
  label?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  bgColor?: string
  accentColor?: string
  textColor?: string
  bgImageUrl?: string
  bgImageOverlay?: number
}

export default function HeroSection({
  title = 'ΛCΛDEM*IΛ',
  titleVariants,
  label = 'plataforma educativa',
  subtitle = 'Aprende con propósito.',
  ctaText = 'Empezar gratis',
  ctaLink = '/registro',
  bgColor = '#171a21',
  accentColor = '#ef476f',
  textColor = '#dddfdf',
  bgImageUrl,
  bgImageOverlay = 50,
}: HeroSectionProps) {
  const mutedColor = textColor + 'aa'
  const animatedTitles = titleVariants && titleVariants.length > 1 ? titleVariants : null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: bgColor, minHeight: '92vh' }}
    >
      {/* Background image */}
      {bgImageUrl && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundColor: bgColor, opacity: (bgImageOverlay ?? 50) / 100 }}
          />
        </>
      )}

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
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {animatedTitles ? (
              <AnimatedTitle
                titles={animatedTitles}
                accentColor={accentColor}
                textColor={textColor}
              />
            ) : (
              <span style={{ color: textColor }}>
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
              </span>
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
