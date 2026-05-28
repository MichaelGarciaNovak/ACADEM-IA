'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  body: string
  icon?: string
}

interface Props {
  title: string
  label?: string
  content: string
  items: AccordionItem[]
  bgColor?: string
  textColor?: string
  accentColor?: string
}

export default function InfoAcordeon({
  title,
  label,
  content,
  items,
  bgColor = '#ffffff',
  textColor = '#171a21',
  accentColor = '#ef476f',
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start pt-4">

          {/* ── LEFT: párrafo ─────────────────────────── */}
          <div className="md:sticky md:top-24 pt-5">
            {label && (
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: accentColor }}
              >
                {label}
              </p>
            )}
            <p
              className="font-mono font-normal uppercase leading-tight"
              style={{
                color: textColor,
                fontSize: 'clamp(1.875rem, 3.2vw, 2.25rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {content}
            </p>
          </div>

          {/* ── RIGHT: acordeón ───────────────────────── */}
          <div>
            {items.map((item, i) => (
              <div
                key={i}
                className="border-b"
                style={{ borderColor: textColor + '15' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4"
                >
                  <span className="flex items-center gap-3">
                    {item.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.icon}
                        alt=""
                        style={{
                          width: 'clamp(2.1rem, 3vw, 2.55rem)',
                          height: 'clamp(2.1rem, 3vw, 2.55rem)',
                          objectFit: 'contain',
                          flexShrink: 0,
                          opacity: openIndex === i ? 1 : 0.5,
                          transition: 'opacity 0.2s',
                        }}
                      />
                    )}
                    <span
                      className="font-mono font-normal uppercase transition-colors"
                      style={{
                        color: openIndex === i ? accentColor : textColor,
                        fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.title}
                    </span>
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className={`flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-90' : ''}`}
                    style={{ color: openIndex === i ? accentColor : textColor + '30' }}
                  >
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openIndex === i ? '400px' : '0' }}
                >
                  <p
                    className="font-mono text-sm leading-relaxed pb-5"
                    style={{ color: textColor + '70' }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
