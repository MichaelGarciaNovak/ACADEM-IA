'use client'

import { useState } from 'react'

export interface CurriculumLesson {
  id: string
  title: string
  description: string | null
  sort_order: number
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

  return (
    <section style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* Header — left-aligned, same scale as other sections */}
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
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.02em',
              color: textColor,
            }}
          >
            {title}
          </h2>
          <span
            className="text-xs font-mono flex-shrink-0"
            style={{ color: textColor + '55' }}
          >
            {chapters.length} módulos · {totalLessons} lecciones
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
                <div
                  key={chapter.id}
                  style={{ borderBottom: `1px solid ${textColor}18` }}
                >
                  {/* Chapter row */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : chapter.id)}
                    className="w-full flex items-start justify-between py-6 text-left gap-6 group"
                  >
                    <div className="flex gap-6 items-start flex-1 min-w-0">
                      {/* Number */}
                      <span
                        className="text-xs font-mono mt-1 flex-shrink-0 w-6 text-right"
                        style={{ color: accentColor }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Title + lesson count */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <span
                          className="font-mono uppercase text-base font-normal leading-snug group-hover:opacity-70 transition-opacity"
                          style={{ color: textColor }}
                        >
                          {chapter.title}
                        </span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: textColor + '50' }}
                        >
                          {lessonCount} {lessonCount === 1 ? 'lección' : 'lecciones'}
                        </span>
                      </div>
                    </div>

                    {/* Toggle icon */}
                    <span
                      className="flex-shrink-0 text-xl font-mono leading-none mt-1 transition-transform duration-200"
                      style={{
                        color: textColor + '40',
                        display: 'inline-block',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>

                  {/* Lesson list */}
                  {isOpen && lessonCount > 0 && (
                    <div className="pb-8 flex flex-col gap-4" style={{ paddingLeft: '3.5rem' }}>
                      {chapter.course_lessons
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((lesson) => (
                          <div key={lesson.id} className="flex items-start gap-3">
                            <span
                              className="text-xs font-mono mt-0.5 flex-shrink-0"
                              style={{ color: accentColor }}
                            >
                              —
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <p
                                className="text-sm font-mono"
                                style={{ color: textColor }}
                              >
                                {lesson.title}
                              </p>
                              {lesson.description && (
                                <p
                                  className="text-xs font-mono"
                                  style={{ color: textColor + '55' }}
                                >
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
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
            no hay módulos disponibles aún
          </p>
        )}
      </div>
    </section>
  )
}
