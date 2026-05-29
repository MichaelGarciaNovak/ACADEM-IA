'use client'

import { useState } from 'react'

export interface CurriculumLesson {
  id: string
  title: string
  description: string | null
  sort_order: number
  duration_minutes: number | null
  video_url: string | null
  presentation_url: string | null
  pdf_url: string | null
  worksheet_url: string | null
  tool_url: string | null
}

export interface CurriculumChapter {
  id: string
  title: string
  sort_order: number
  course_lessons: CurriculumLesson[]
}

interface Props {
  title?: string
  label?: string
  bgColor?: string
  textColor?: string
  accentColor?: string
  chapters: CurriculumChapter[]
}

// ─── Content-type badge icons ─────────────────────────────────────────────────

function IconVideo({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 1.5L10.5 6L3 10.5V1.5Z" fill={color} />
    </svg>
  )
}

function IconSlides({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <rect x="1" y="2" width="10" height="7" rx="0.8" />
      <line x1="3" y1="11" x2="9" y2="11" />
      <line x1="6" y1="9" x2="6" y2="11" />
    </svg>
  )
}

function IconPDF({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <path d="M2 1H8L11 4V11H2V1Z" />
      <path d="M8 1V4H11" />
      <line x1="4" y1="7" x2="8.5" y2="7" />
      <line x1="4" y1="9" x2="7" y2="9" />
    </svg>
  )
}

function IconWorksheet({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <rect x="1.5" y="1.5" width="9" height="9" rx="0.8" />
      <line x1="3.5" y1="4.5" x2="8.5" y2="4.5" />
      <line x1="3.5" y1="6.5" x2="8.5" y2="6.5" />
      <line x1="3.5" y1="8.5" x2="6" y2="8.5" />
    </svg>
  )
}

function IconTool({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <path d="M4.5 7.5L2 10" />
      <path d="M7.5 1C5.6 1 4 2.6 4 4.5C4 4.9 4.1 5.3 4.2 5.6L1.5 8.3C1.2 8.6 1.2 9.1 1.5 9.4L2.6 10.5C2.9 10.8 3.4 10.8 3.7 10.5L6.4 7.8C6.7 7.9 7.1 8 7.5 8C9.4 8 11 6.4 11 4.5C11 3.9 10.8 3.3 10.5 2.8L8.5 4.8L7.2 3.5L9.2 1.5C8.7 1.2 8.1 1 7.5 1Z" />
    </svg>
  )
}

type ContentBadge = { key: string; label: string; icon: JSX.Element }

function getContentBadges(lesson: CurriculumLesson, color: string): ContentBadge[] {
  const badges: ContentBadge[] = []
  if (lesson.video_url)        badges.push({ key: 'video',    label: 'video',       icon: <IconVideo color={color} /> })
  if (lesson.presentation_url) badges.push({ key: 'slides',   label: 'slides',      icon: <IconSlides color={color} /> })
  if (lesson.pdf_url)          badges.push({ key: 'pdf',      label: 'pdf',         icon: <IconPDF color={color} /> })
  if (lesson.worksheet_url)    badges.push({ key: 'tarea',    label: 'tarea',       icon: <IconWorksheet color={color} /> })
  if (lesson.tool_url)         badges.push({ key: 'tool',     label: 'herramienta', icon: <IconTool color={color} /> })
  return badges
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CurriculumSection({
  title = 'contenido del curso',
  label,
  bgColor = '#ffffff',
  textColor = '#171a21',
  accentColor = '#ef476f',
  chapters,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.course_lessons?.length ?? 0), 0)
  const badgeColor = textColor + '80'

  return (
    <section style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* Header — left-aligned */}
        {label && (
          <p
            className="text-xs uppercase tracking-widest font-mono font-normal mb-4"
            style={{ color: accentColor }}
          >
            {label}
          </p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-12">
          <h2
            className="font-mono font-normal uppercase leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', color: textColor }}
          >
            {title}
          </h2>
          <span className="text-xs font-mono flex-shrink-0" style={{ color: textColor + '55' }}>
            {chapters.length} capítulos · {totalLessons} lecciones
          </span>
        </div>

        {/* Accordion */}
        <div style={{ borderTop: `1px solid ${textColor}18` }}>
          {chapters
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((chapter, idx) => {
              const isOpen = openId === chapter.id
              const lessonCount = chapter.course_lessons?.length ?? 0

              return (
                <div key={chapter.id} style={{ borderBottom: `1px solid ${textColor}18` }}>

                  {/* Chapter row */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : chapter.id)}
                    className="w-full flex items-start justify-between py-6 text-left gap-6 group"
                  >
                    <div className="flex gap-6 items-start flex-1 min-w-0">
                      <span
                        className="text-xs font-mono mt-1 flex-shrink-0 w-6 text-right"
                        style={{ color: accentColor }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span
                          className="font-mono uppercase text-base font-normal leading-snug group-hover:opacity-70 transition-opacity"
                          style={{ color: textColor }}
                        >
                          {chapter.title}
                        </span>
                        <span className="text-xs font-mono" style={{ color: textColor + '50' }}>
                          {lessonCount} {lessonCount === 1 ? 'lección' : 'lecciones'}
                        </span>
                      </div>
                    </div>
                    <span
                      className="flex-shrink-0 text-xl font-mono leading-none mt-1 transition-transform duration-200"
                      style={{ color: textColor + '40', display: 'inline-block', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </button>

                  {/* Lesson list */}
                  {isOpen && lessonCount > 0 && (
                    <div className="pb-8 flex flex-col" style={{ paddingLeft: '3.5rem' }}>
                      {chapter.course_lessons
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((lesson, li) => {
                          const badges = getContentBadges(lesson, badgeColor)
                          const isLast = li === chapter.course_lessons.length - 1

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-start gap-4 py-3.5"
                              style={{ borderBottom: isLast ? 'none' : `1px solid ${textColor}0d` }}
                            >
                              {/* Dash */}
                              <span
                                className="text-xs font-mono mt-0.5 flex-shrink-0"
                                style={{ color: accentColor }}
                              >
                                —
                              </span>

                              {/* Title + meta row */}
                              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <p className="text-sm font-mono" style={{ color: textColor }}>
                                  {lesson.title}
                                </p>

                                {/* Badges row */}
                                {(badges.length > 0 || lesson.duration_minutes) && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {badges.map(b => (
                                      <span
                                        key={b.key}
                                        className="inline-flex items-center gap-1 font-mono"
                                        style={{
                                          fontSize: '10px',
                                          color: badgeColor,
                                          border: `1px solid ${textColor}18`,
                                          padding: '1px 6px',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        {b.icon}
                                        {b.label}
                                      </span>
                                    ))}
                                    {lesson.duration_minutes && lesson.duration_minutes > 0 && (
                                      <span
                                        className="font-mono"
                                        style={{ fontSize: '10px', color: textColor + '45' }}
                                      >
                                        {lesson.duration_minutes} min
                                      </span>
                                    )}
                                  </div>
                                )}

                                {lesson.description && (
                                  <p className="text-xs font-mono" style={{ color: textColor + '50' }}>
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}

                  {isOpen && lessonCount === 0 && (
                    <div className="pb-6" style={{ paddingLeft: '3.5rem' }}>
                      <p className="text-xs font-mono" style={{ color: textColor + '35' }}>
                        sin lecciones aún
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
        </div>

        {chapters.length === 0 && (
          <p className="text-sm font-mono" style={{ color: textColor + '40' }}>
            no hay capítulos disponibles aún
          </p>
        )}
      </div>
    </section>
  )
}
