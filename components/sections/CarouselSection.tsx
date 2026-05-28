'use client'

import { useRef } from 'react'

// Golden ratio
const φ = 1.618033988749895

export interface CarouselCard {
  badge?: string
  image?: string
  category?: string
  title: string
  subtitle?: string
  description?: string
  duration?: string
  ctaText?: string
  ctaLink?: string
}

interface Props {
  label?: string
  title?: string
  subtitle?: string
  cards: CarouselCard[]
  bgColor?: string
  textColor?: string
  accentColor?: string
  cardBgColor?: string
}

function ClockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
      <path d="M5 3V5L6.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function Card({
  card,
  accentColor,
  textColor,
  cardBgColor,
}: {
  card: CarouselCard
  accentColor: string
  textColor: string
  cardBgColor: string
}) {
  return (
    <a
      href={card.ctaLink || '#'}
      className="group flex-shrink-0 snap-start flex flex-col"
      style={{
        width: 'clamp(240px, 24vw, 295px)',
        backgroundColor: cardBgColor,
        transition: `transform ${Math.round(φ * 276)}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.018)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* ── IMAGE — aspect-ratio φ:1 (golden landscape) ── */}
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
          <div className="w-full h-full" style={{ backgroundColor: textColor + '08' }} />
        )}

        {card.badge && (
          <span
            className="absolute top-[13px] left-[13px] font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              padding: '5px 8px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: textColor,
            }}
          >
            {card.badge}
          </span>
        )}
      </div>

      {/* ── CONTENT — height = imageHeight/φ (golden proportion of image) ── */}
      {/* Fibonacci padding: 13px top, 21px sides, 13px bottom */}
      <div
        className="flex flex-col"
        style={{ padding: '13px 21px 13px', color: textColor }}
      >
        {card.category && (
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: accentColor,
              marginBottom: '8px',
            }}
          >
            {card.category}
          </p>
        )}

        <h3
          className="font-mono font-normal uppercase leading-tight"
          style={{
            fontSize: `${(9 * φ).toFixed(1)}px`,
            letterSpacing: '-0.02em',
            color: textColor,
            marginBottom: '5px',
          }}
        >
          {card.title}
        </h3>

        {card.subtitle && (
          <p
            className="font-mono leading-snug"
            style={{
              fontSize: '9px',
              color: textColor + '60',
              marginBottom: '8px',
            }}
          >
            {card.subtitle}
          </p>
        )}

        {card.description && (
          <p
            className="leading-relaxed"
            style={{
              fontSize: '9px',
              color: textColor + '50',
              marginBottom: '13px',
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
            paddingTop: '8px',
            borderTop: `1px solid ${textColor}10`,
            marginTop: card.description ? '0' : 'auto',
          }}
        >
          {card.duration ? (
            <span
              className="flex items-center font-mono"
              style={{ fontSize: '9px', color: textColor + '40', gap: '5px' }}
            >
              <ClockIcon />
              {card.duration}
            </span>
          ) : <span />}

          <span
            className="font-mono uppercase transition-transform duration-300 group-hover:translate-x-[3px]"
            style={{
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: accentColor,
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
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const firstCard = scrollRef.current.querySelector('a') as HTMLElement | null
    const step = firstCard ? firstCard.offsetWidth + 24 : 319
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
                  marginBottom: '13px',  // Fibonacci F7
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
                    width: `${Math.round(21 * φ)}px`,   // 21 × φ = 34px (Fibonacci!)
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

      {/* Scroll track — gap = 21px (Fibonacci F8) */}
      <div
        ref={scrollRef}
        className="max-w-6xl mx-auto flex overflow-x-auto snap-x snap-mandatory px-6"
        style={{
          gap: '21px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          <Card key={i} card={card} accentColor={accentColor} textColor={textColor} cardBgColor={cardBgColor} />
        ))}
        <div className="flex-shrink-0 w-px" aria-hidden />
      </div>
    </section>
  )
}
