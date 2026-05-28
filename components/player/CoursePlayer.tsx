'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lesson {
  id: string
  chapter_id: string
  title: string
  description: string | null
  video_url: string | null
  presentation_url: string | null
  pdf_url: string | null
  worksheet_url: string | null
  tool_url: string | null
  sort_order: number
}

interface Chapter {
  id: string
  title: string
  sort_order: number
  course_lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string | null
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
}

interface Props {
  course: Course
  chapters: Chapter[]
  completedLessonIds: Set<string>
  userId: string
}

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoEmbed({ url }: { url: string }) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com')) {
      const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
      return id ? `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0` : null
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.match(/[?&]v=([^&]+)/)?.[1]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    return null
  }

  const embedUrl = getEmbedUrl(url)
  if (!embedUrl) return (
    <div className="aspect-video bg-ink/10 flex items-center justify-center">
      <p className="text-xs text-ink/30 font-mono uppercase tracking-widest">formato de video no soportado</p>
    </div>
  )

  return (
    <div className="aspect-video w-full bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

// ─── Comment Section ──────────────────────────────────────────────────────────

function CommentSection({ lessonId, userId }: { lessonId: string; userId: string }) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true })
      setComments(data ?? [])
    }
    load()
  }, [lessonId])

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    const { data } = await supabase.from('lesson_comments').insert({
      lesson_id: lessonId,
      user_id: userId,
      content: text.trim(),
    }).select('*').single()
    if (data) {
      setComments(prev => [...prev, data])
      setText('')
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-10 pt-8 border-t border-ink/10">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-ink/30">◯</span>
        <h3 className="text-xs uppercase tracking-widest text-ink/50">comentarios</h3>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        maxLength={2000}
        className="w-full border border-ink/15 bg-white text-ink font-mono text-sm px-4 py-3 outline-none focus:border-ink/30 resize-none placeholder:text-ink/20"
        placeholder="Comparte tu opinión sobre esta lección..."
      />
      <div className="flex items-center justify-between mt-2 mb-6">
        <span className="text-xs text-ink/25">{text.length}/2000</span>
        <button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="btn-primary text-xs disabled:opacity-40"
        >
          {submitting ? 'publicando...' : 'publicar'}
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-xs text-ink/25 font-mono">aún no hay comentarios. sé el primero.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map(c => (
            <div key={c.id} className="border-b border-ink/5 pb-4">
              <p className="text-xs text-ink/30 mb-2">
                {new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-sm text-ink/70 font-mono leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Player ──────────────────────────────────────────────────────────────

export default function CoursePlayer({ course, chapters, completedLessonIds: initialCompleted, userId }: Props) {
  const supabase = createClient()
  const allLessons = chapters.flatMap(c => c.course_lessons ?? [])
  const firstLesson = allLessons[0] ?? null

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(firstLesson)
  const [completed, setCompleted] = useState<Set<string>>(initialCompleted)
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set())
  const [markingDone, setMarkingDone] = useState(false)

  const totalLessons = allLessons.length
  const completedCount = allLessons.filter(l => completed.has(l.id)).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const chapterProgress = (chapter: Chapter) => {
    const lessons = chapter.course_lessons ?? []
    if (lessons.length === 0) return 0
    return Math.round((lessons.filter(l => completed.has(l.id)).length / lessons.length) * 100)
  }

  const toggleChapter = (id: string) => {
    setCollapsedChapters(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const markComplete = async () => {
    if (!activeLesson || completed.has(activeLesson.id)) return
    setMarkingDone(true)
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: activeLesson.id,
    })
    setCompleted(prev => new Set(Array.from(prev).concat(activeLesson.id)))
    setMarkingDone(false)
    if (nextLesson) setActiveLesson(nextLesson)
  }

  return (
    <div className="min-h-screen bg-white font-mono flex flex-col">
      {/* Top nav */}
      <header className="border-b border-ink/10 px-6 py-3 flex items-center gap-4">
        <a href="/dashboard/cursos" className="text-xs text-ink/30 hover:text-ink transition-colors uppercase tracking-widest">
          ←
        </a>
        <div className="flex items-center gap-3">
          <Logo variant="light" size="sm" accentColor="#ef476f" />
          <span className="text-ink/20">·</span>
          <p className="text-xs uppercase tracking-widest text-ink/50">{course.title}</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ─────────────────────────────────── */}
        <aside className="w-64 border-r border-ink/10 flex flex-col overflow-y-auto flex-shrink-0">
          {/* Progress header */}
          <div className="px-5 py-4 border-b border-ink/10">
            <p className="text-xs uppercase tracking-widest text-ink/30 mb-2">progreso del curso</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-ink/10 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-pink transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-ink/40">{progressPct}%</span>
            </div>
          </div>

          {/* Chapters + Lessons */}
          <nav className="flex-1 py-2">
            {chapters.map((chapter, ci) => {
              const pct = chapterProgress(chapter)
              const isCollapsed = collapsedChapters.has(chapter.id)
              return (
                <div key={chapter.id}>
                  {/* Chapter row */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-start gap-2 px-5 py-3 hover:bg-ink/[0.02] transition-colors text-left"
                  >
                    <span className="text-ink/20 mt-0.5 text-xs">{isCollapsed ? '▶' : '▼'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-widest text-ink/60 leading-tight">
                        {String(ci + 1).padStart(2, '0')}. {chapter.title}
                      </p>
                      <p className="text-xs text-ink/25 mt-1">{pct}%</p>
                    </div>
                  </button>

                  {/* Lessons */}
                  {!isCollapsed && (chapter.course_lessons ?? []).map((lesson, li) => {
                    const isActive = activeLesson?.id === lesson.id
                    const isDone = completed.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-start gap-2 pl-9 pr-4 py-2.5 text-left transition-colors border-l-2 ${
                          isActive
                            ? 'border-pink bg-pink/5'
                            : 'border-transparent hover:bg-ink/[0.02]'
                        }`}
                      >
                        <span className={`text-xs mt-0.5 flex-shrink-0 ${isDone ? 'text-green-500' : 'text-ink/20'}`}>
                          {isDone ? '✓' : '○'}
                        </span>
                        <span className={`text-xs leading-snug line-clamp-2 ${isActive ? 'text-ink' : 'text-ink/50'}`}>
                          Lec. {li + 1}. {lesson.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div>
              {/* Video */}
              {activeLesson.video_url ? (
                <VideoEmbed url={activeLesson.video_url} />
              ) : (
                <div className="aspect-video bg-ink flex items-center justify-center">
                  <p className="text-xs text-white/20 font-mono uppercase tracking-widest">sin video</p>
                </div>
              )}

              {/* Content */}
              <div className="px-8 py-10">
                {/* Title */}
                <h1 className="text-lg uppercase font-normal text-ink mb-4 tracking-tight">
                  lec. {allLessons.findIndex(l => l.id === activeLesson.id) + 1}: {activeLesson.title}
                </h1>

                {/* Description */}
                {activeLesson.description && (
                  <p className="text-sm text-ink/60 leading-relaxed mb-6">{activeLesson.description}</p>
                )}

                {/* Resources */}
                {(activeLesson.worksheet_url || activeLesson.pdf_url || activeLesson.tool_url || activeLesson.presentation_url) && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {activeLesson.worksheet_url && (
                      <a
                        href={activeLesson.worksheet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs uppercase tracking-widest text-ink/60 hover:border-pink hover:text-pink transition-colors"
                      >
                        ↗ hoja de trabajo
                      </a>
                    )}
                    {activeLesson.pdf_url && (
                      <a
                        href={activeLesson.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs uppercase tracking-widest text-ink/60 hover:border-pink hover:text-pink transition-colors"
                      >
                        ↗ pdf
                      </a>
                    )}
                    {activeLesson.presentation_url && (
                      <a
                        href={activeLesson.presentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs uppercase tracking-widest text-ink/60 hover:border-pink hover:text-pink transition-colors"
                      >
                        ↗ presentación
                      </a>
                    )}
                    {activeLesson.tool_url && (
                      <a
                        href={activeLesson.tool_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs uppercase tracking-widest text-ink/60 hover:border-pink hover:text-pink transition-colors"
                      >
                        ↗ herramienta
                      </a>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between py-6 border-t border-b border-ink/10 mb-8">
                  <div>
                    {prevLesson ? (
                      <button
                        onClick={() => setActiveLesson(prevLesson)}
                        className="text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                      >
                        ← anterior
                      </button>
                    ) : <span />}
                  </div>

                  <button
                    onClick={markComplete}
                    disabled={markingDone || completed.has(activeLesson.id)}
                    className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                      completed.has(activeLesson.id)
                        ? 'border-green-300 text-green-600 bg-green-50 cursor-default'
                        : 'border-pink text-pink hover:bg-pink hover:text-white'
                    }`}
                  >
                    {completed.has(activeLesson.id) ? '✓ completada' : markingDone ? 'guardando...' : 'marcar como completada'}
                  </button>

                  <div>
                    {nextLesson ? (
                      <button
                        onClick={() => setActiveLesson(nextLesson)}
                        className="text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                      >
                        siguiente →
                      </button>
                    ) : <span />}
                  </div>
                </div>

                {/* Comments */}
                <CommentSection lessonId={activeLesson.id} userId={userId} />

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-ink/10 flex items-center justify-between">
                  <Logo variant="light" size="sm" accentColor="#ef476f" />
                  <p className="text-xs text-ink/20">© {new Date().getFullYear()} ΛCΛDEM*IΛ</p>
                </footer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <p className="text-xs text-ink/30 uppercase tracking-widest">selecciona una lección</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
