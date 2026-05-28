'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  body: string
}

interface Props {
  title: string
  content: string
  items: AccordionItem[]
  bgColor?: string
  textColor?: string
  accentColor?: string
}

export default function InfoAcordeon({
  title,
  content,
  items,
  bgColor = '#ffffff',
  textColor = '#171a21',
  accentColor = '#ef476f',
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: párrafo ─────────────────────────── */}
          <div className="md:sticky md:top-24">
            <h2
              className="font-mono font-normal uppercase leading-tight mb-6"
              style={{
                color: textColor,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {title.split('*').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}<span style={{ color: accentColor }}>*</span>
                  </span>
                ) : <span key={i}>{part}</span>
              )}
            </h2>
            <p
              className="font-mono text-sm leading-relaxed"
              style={{ color: textColor + 'aa' }}
            >
              {content}
            </p>
          </div>

          {/* ── RIGHT: acordeón ───────────────────────── */}
          <div>
            {items.map((item, i) => (
              <div
                key={i}
                className="border-t"
                style={{ borderColor: textColor + '20' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left gap-4 group"
                >
                  <span
                    className="font-mono text-sm uppercase tracking-wide transition-colors"
                    style={{ color: openIndex === i ? accentColor : textColor }}
                  >
                    {item.title}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className={`flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-90' : ''}`}
                    style={{ color: openIndex === i ? accentColor : textColor + '40' }}
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
                    style={{ color: textColor + '80' }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
            {items.length > 0 && (
              <div className="border-t" style={{ borderColor: textColor + '20' }} />
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
