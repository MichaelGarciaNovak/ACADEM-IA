'use client'

import { useRef } from 'react'

// Golden ratio
const φ = 1.618033988749895
// Card scale factor (+30%)
const S = 1.3
// Badge diameter = 1/4 of image height = cardWidth / (4φ)
const BADGE_D = Math.round((295 * S) / (4 * φ))  // ≈ 59px

export interface CarouselCard {
  image?: string
  category?: string
  title: string
  subtitle?: string
  description?: string
  duration?: string
  ctaText?: string
  ctaLink?: string
  // ── Circular badge ──
  badgeTopText?: string
  badgeBottomText?: string
  badgeIcon?: string
  badgeBgColor?: string
  badgeTextColor?: string
}

interface Props {
  label?: string
  title?: string
  subtitle?: string
  cards: CarouselCard[]
  // ── Section header colors ──
  bgColor?: string
  textColor?: string
  accentColor?: string
  // ── Card colors ──
  cardBgColor?: string
  cardTextColor?: string
  cardAccentColor?: string
}

function ClockIcon() {
  const sz = Math.round(10 * S)
  return (
    <svg width={sz} height={sz} viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
      <path d="M5 3V5L6.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function CircleBadge({
  uid,
  topText,
  bottomText,
  icon,
  bgColor,
  textColor,
  top,
  left,
}: {
  uid: number | string
  topText?: string
  bottomText?: string
  icon?: string
  bgColor: string
  textColor: string
  top: number
  left: number
}) {
  if (!topText && !bottomText && !icon) return null

  const arcR = 35
  const cx = 50, cy = 50
  const topId  = `ta-${uid}`
  const botId  = `ba-${uid}`

  return (
    <svg
      width={BADGE_D}
      height={BADGE_D}
      viewBox="0 0 100 100"
      className="absolute pointer-events-none"
      style={{ top, left }}
    >
      <defs>
        {/* Top arc — in SVG Y-down coords, sweep=1 goes OVER the top visually */}
        <path
          id={topId}
          d={`M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,1 ${cx + arcR},${cy}`}
          fill="none"
        />
        {/* Bottom arc — LEFT→RIGHT through BOTTOM (sweep=0, counterclockwise Y-down)  */}
        {/* side="right" on the textPath flips glyphs to face OUTWARD at the bottom   */}
        <path
          id={botId}
          d={`M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,0 ${cx + arcR},${cy}`}
          fill="none"
        />
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r="47" fill={bgColor} />

      {/* Thin inner ring for visual refinement */}
      <circle cx={cx} cy={cy} r="44" fill="none" stroke={textColor} strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Top arc text */}
      {topText && (
        <text
          fontSize="10"
          fill={textColor}
          fontFamily="'IBM Plex Mono', monospace"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          <textPath href={`#${topId}`} startOffset="50%">
            {topText.toUpperCase()}
          </textPath>
        </text>
      )}

      {/* Bottom arc text */}
      {bottomText && (
        <text
          fontSize="10"
          fill={textColor}
          fontFamily="'IBM Plex Mono', monospace"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          <textPath href={`#${botId}`} startOffset="50%" {...({ side: 'right' } as any)}>
            {bottomText.toUpperCase()}
          </textPath>
        </text>
      )}

      {/* Center icon — image URL */}
      {icon && (
        <image
          href={icon}
          x={cx - 18}
          y={cy - 18}
          width="36"
          height="36"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </svg>
  )
}

function Card({
  card,
  index,
  cardBgColor,
  cardTextColor,
  cardAccentColor,
}: {
  card: CarouselCard
  index: number
  cardBgColor: string
  cardTextColor: string
  cardAccentColor: string
}) {
  const base     = 9 * S
  const titlePx  = (9 * φ * S).toFixed(1)
  const pad      = Math.round(13 * S)
  const padSide  = Math.round(21 * S)
  const mb8      = Math.round(8  * S)
  const mb5      = Math.round(5  * S)
  const mb13     = Math.round(13 * S)
  const badgeTop = Math.round(13 * S)

  const hasBadge = !!(card.badgeTopText || card.badgeBottomText || card.badgeIcon)

  return (
    <a
      href={card.ctaLink || '#'}
      className="group flex-shrink-0 snap-start flex flex-col"
      style={{
        width: `clamp(${Math.round(240 * S)}px, ${(24 * S).toFixed(1)}vw, ${Math.round(295 * S)}px)`,
        backgroundColor: cardBgColor,
        transition: `transform ${Math.round(φ * 276)}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.018)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* ── IMAGE — aspect-ratio φ:1 ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: `${φ} / 1` }}
      >
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform ease-out group-hover:scale-[1.05]"
            style={{ transitionDuration: `${Math.round(φ * φ * 276)}ms` }}
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: cardTextColor + '08' }} />
        )}

        {/* ── Circular badge ── */}
        {hasBadge && (
          <CircleBadge
            uid={index}
            topText={card.badgeTopText}
            bottomText={card.badgeBottomText}
            icon={card.badgeIcon}
            bgColor={card.badgeBgColor ?? cardAccentColor}
            textColor={card.badgeTextColor ?? '#ffffff'}
            top={badgeTop}
            left={badgeTop}
          />
        )}
      </div>

      {/* ── CONTENT ── */}
      <div
        className="flex flex-col"
        style={{ padding: `${pad}px ${padSide}px ${pad}px`, color: cardTextColor }}
      >
        {card.category && (
          <p
            className="font-mono uppercase"
            style={{
              fontSize: `${base.toFixed(1)}px`,
              letterSpacing: '0.12em',
              color: cardAccentColor,
              marginBottom: `${mb8}px`,
            }}
          >
            {card.category}
          </p>
        )}

        <h3
          className="font-mono font-normal uppercase leading-tight"
          style={{
            fontSize: `${titlePx}px`,
            letterSpacing: '-0.02em',
            color: cardTextColor,
            marginBottom: `${mb5}px`,
          }}
        >
          {card.title}
        </h3>

        {card.subtitle && (
          <p
            className="font-mono leading-snug"
            style={{
              fontSize: `${base.toFixed(1)}px`,
              color: cardTextColor + '60',
              marginBottom: `${mb8}px`,
            }}
          >
            {card.subtitle}
          </p>
        )}

        {card.description && (
          <p
            className="leading-relaxed"
            style={{
              fontSize: `${base.toFixed(1)}px`,
              color: cardTextColor + '50',
              marginBottom: `${mb13}px`,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {card.description}
          </p>
        )}

        {/* Bottom row */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: `${mb8}px`,
            borderTop: `1px solid ${cardTextColor}10`,
            marginTop: card.description ? '0' : 'auto',
          }}
        >
          {card.duration ? (
            <span
              className="flex items-center font-mono"
              style={{ fontSize: `${base.toFixed(1)}px`, color: cardTextColor + '40', gap: `${mb5}px` }}
            >
              <ClockIcon />
              {card.duration}
            </span>
          ) : <span />}

          <span
            className="font-mono uppercase transition-transform duration-300 group-hover:translate-x-[4px]"
            style={{
              fontSize: `${base.toFixed(1)}px`,
              letterSpacing: '0.1em',
              color: cardAccentColor,
            }}
          >
            {card.ctaText || 'ver más'} →
          </span>
        </div>
      </div>
    </a>
  )
}

export default function CarouselSection({
  label,
  title,
  subtitle,
  cards,
  bgColor = '#ffffff',
  textColor = '#171a21',
  accentColor = '#ef476f',
  cardBgColor = '#ffffff',
  cardTextColor,
  cardAccentColor,
}: Props) {
  const resolvedCardText   = cardTextColor   ?? textColor
  const resolvedCardAccent = cardAccentColor ?? accentColor

  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const firstCard = scrollRef.current.querySelector('a') as HTMLElement | null
    const step = firstCard ? firstCard.offsetWidth + Math.round(21 * S) : Math.round(319 * S)
    scrollRef.current.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' })
  }

  if (!cards.length) return null

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24 overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-[21px]">
        <div className="flex items-end justify-between">
          <div>
            {label && (
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: accentColor,
                  marginBottom: '13px',
                }}
              >
                {label}
              </p>
            )}
            {title && (
              <h2
                className="font-mono font-normal uppercase"
                style={{
                  color: textColor,
                  fontSize: 'clamp(1.875rem, 3.2vw, 2.25rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: textColor + '55',
                  marginTop: '13px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {cards.length > 3 && (
            <div className="hidden md:flex gap-2 flex-shrink-0 pb-1">
              {(['left', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  className="flex items-center justify-center border transition-all duration-200"
                  style={{
                    width: `${Math.round(21 * φ)}px`,
                    height: `${Math.round(21 * φ)}px`,
                    borderColor: textColor + '18',
                    color: textColor + '50',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.color = accentColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = textColor + '18'
                    e.currentTarget.style.color = textColor + '50'
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d={dir === 'left' ? 'M8.5 2L4 6.5L8.5 11' : 'M4.5 2L9 6.5L4.5 11'}
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="max-w-6xl mx-auto flex overflow-x-auto snap-x snap-mandatory px-6"
        style={{
          gap: `${Math.round(21 * S)}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          <Card
            key={i}
            index={i}
            card={card}
            cardBgColor={cardBgColor}
            cardTextColor={resolvedCardText}
            cardAccentColor={resolvedCardAccent}
          />
        ))}
        <div className="flex-shrink-0 w-px" aria-hidden />
      </div>
    </section>
  )
}
