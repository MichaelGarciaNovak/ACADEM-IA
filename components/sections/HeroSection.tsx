import AnimatedTitle from './AnimatedTitle'

interface HeroSectionProps {
  title: string
  titleVariants?: string[]
  label?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  bgColor?: string
  accentColor?: string
  textColor?: string
  bgImageUrl?: string
  bgImageOverlay?: number
  phoneImageUrl?: string   // if set, shows phone mockup on the right
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
  phoneImageUrl,
}: HeroSectionProps) {
  const mutedColor = textColor + 'aa'
  const animatedTitles = titleVariants && titleVariants.length > 1 ? titleVariants : null
  const hasPhone = Boolean(phoneImageUrl)

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: bgColor, minHeight: '50vh' }}
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
        className={`relative z-10 max-w-6xl mx-auto px-6 flex items-center ${hasPhone ? 'gap-12' : 'flex-col justify-center'}`}
        style={{ minHeight: '50vh' }}
      >
        {/* ── Text side ── */}
        <div className={`${hasPhone ? 'flex-1 min-w-0' : 'max-w-3xl w-full'} pt-24 pb-10`}>
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
              fontSize: hasPhone ? 'clamp(2rem, 4.5vw, 4.5rem)' : 'clamp(2.8rem, 7vw, 6rem)',
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

        {/* ── Phone mockup ── */}
        {hasPhone && (
          <div
            className="hidden md:block flex-shrink-0"
            style={{ alignSelf: 'stretch', position: 'relative', width: '300px' }}
          >
            {/* Phone sits flush at bottom, taller than hero so it crops naturally */}
            <div
              style={{
                position: 'absolute',
                top: '96px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '620px',
                borderRadius: '46px',
                border: `7px solid ${textColor}28`,
                backgroundColor: `${textColor}08`,
                overflow: 'hidden',
                boxShadow: `0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px ${textColor}12`,
              }}
            >
              {/* Notch */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '84px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: bgColor,
                  zIndex: 10,
                  border: `2px solid ${textColor}15`,
                }}
              />
              {/* Screen image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={phoneImageUrl}
                alt="vista previa del curso"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
