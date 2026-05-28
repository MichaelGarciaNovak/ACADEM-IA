'use client'

import { useRef } from 'react'

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
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="flex-shrink-0">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
      <path d="M5.5 3V5.5L7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function Card({ card, accentColor, textColor }: { card: CarouselCard; accentColor: string; textColor: string }) {
  return (
    <a
      href={card.ctaLink || '#'}
      className="group flex-shrink-0 snap-start flex flex-col hover:-translate-y-1.5 transition-transform duration-500 ease-out"
      style={{ width: 'clamp(220px, 24vw, 280px)' }}
    >
      {/* Image — 4:5 */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/5', backgroundColor: textColor + '0a' }}
      >
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full" />
        )}

        {card.badge && (
          <span
            className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.90)', color: textColor }}
          >
            {card.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col pt-5" style={{ color: textColor }}>
        {card.category && (
          <p className="text-[10px] font-mono uppercase tracking-widest mb-2.5" style={{ color: accentColor }}>
            {card.category}
          </p>
        )}

        <h3
          className="font-mono font-normal uppercase leading-snug mb-1.5"
          style={{ fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)', letterSpacing: '-0.01em' }}
        >
          {card.title}
        </h3>

        {card.subtitle && (
          <p className="text-xs font-mono mb-2 leading-snug" style={{ color: textColor + '55' }}>
            {card.subtitle}
          </p>
        )}

        {card.description && (
          <p className="text-xs leading-relaxed mb-4" style={{ color: textColor + '45', fontSize: '0.7rem' }}>
            {card.description}
          </p>
        )}

        <div
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: `1px solid ${textColor}12` }}
        >
          {card.duration ? (
            <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: textColor + '40' }}>
              <ClockIcon />
              {card.duration}
            </span>
          ) : <span />}

          <span
            className="text-[10px] font-mono uppercase tracking-wider transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: accentColor }}
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
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const firstCard = scrollRef.current.querySelector('a') as HTMLElement | null
    const step = firstCard ? firstCard.offsetWidth + 24 : 304
    scrollRef.current.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' })
  }

  if (!cards.length) return null

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24 overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            {label && (
              <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: accentColor }}>
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
              <p className="text-sm font-mono mt-3" style={{ color: textColor + '55' }}>
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
                  className="w-9 h-9 border flex items-center justify-center transition-all duration-200"
                  style={{ borderColor: textColor + '18', color: textColor + '50' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.color = accentColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = textColor + '18'
                    e.currentTarget.style.color = textColor + '50'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d={dir === 'left' ? 'M9 2.5L4.5 7L9 11.5' : 'M5 2.5L9.5 7L5 11.5'}
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
        className="max-w-6xl mx-auto flex gap-6 overflow-x-auto snap-x snap-mandatory px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          <Card key={i} card={card} accentColor={accentColor} textColor={textColor} />
        ))}
        <div className="flex-shrink-0 w-1" aria-hidden />
      </div>
    </section>
  )
}
