'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo' // used in footer

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <header className="border-b border-ink/10 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 bg-white z-20">
        <a href="/dashboard/cursos" className="text-xs text-ink/30 hover:text-ink transition-colors uppercase tracking-widest flex-shrink-0">
          ←
        </a>
        <h1 className="text-xs md:text-sm uppercase tracking-widest text-ink font-normal truncate flex-1">{course.title}</h1>
        {/* Mobile chapters toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden flex-shrink-0 text-xs uppercase tracking-widest text-ink/40 hover:text-ink border border-ink/20 px-3 py-1.5 transition-colors"
        >
          lecciones
        </button>
      </header>

      <div className="flex flex-1">
        {/* ── MOBILE BACKDROP ─────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-ink/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ─────────────────────────────────── */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 bg-white flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out
          md:relative md:z-auto md:translate-x-0 md:flex-shrink-0
          w-72 border-r border-ink/10
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <div className="md:hidden flex items-center justify-between px-5 py-3 border-b border-ink/10">
            <span className="text-xs uppercase tracking-widest text-ink/40">lecciones</span>
            <button onClick={() => setSidebarOpen(false)} className="text-ink/30 hover:text-ink text-lg leading-none">×</button>
          </div>

          {/* Progress header */}
          <div className="px-5 py-3 border-b border-ink/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-ink/30">progreso</p>
              <span className="text-xs text-ink/40">{completedCount}/{totalLessons} lecciones</span>
            </div>
            <div className="h-1 bg-ink/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Chapters + Lessons */}
          <nav className="flex-1 py-1">
            {chapters.map((chapter, ci) => {
              const lessons = chapter.course_lessons ?? []
              const doneCount = lessons.filter(l => completed.has(l.id)).length
              const isCollapsed = collapsedChapters.has(chapter.id)
              return (
                <div key={chapter.id} className="border-b border-ink/5">
                  {/* Chapter row */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-ink/[0.02] transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-medium text-ink/80 leading-snug uppercase tracking-wide">
                        {chapter.title}
                      </p>
                      <p className="text-xs text-ink/30 mt-0.5">
                        {doneCount}/{lessons.length} · Cap. {ci + 1}
                      </p>
                    </div>
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className={`flex-shrink-0 text-ink/30 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
                    >
                      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Lessons */}
                  {!isCollapsed && lessons.map((lesson, li) => {
                    const isActive = activeLesson?.id === lesson.id
                    const isDone = completed.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { setActiveLesson(lesson); setSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-5 py-2 text-left transition-colors ${
                          isActive ? 'bg-pink/8' : 'hover:bg-ink/[0.02]'
                        }`}
                      >
                        {/* Status icon */}
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isDone
                            ? 'border-pink bg-pink'
                            : isActive
                            ? 'border-pink'
                            : 'border-ink/20'
                        }`}>
                          {isDone ? (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : isActive ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-pink" />
                          ) : null}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug line-clamp-2 ${isActive ? 'text-ink font-medium' : isDone ? 'text-ink/50' : 'text-ink/60'}`}>
                            {String(li + 1).padStart(2, '0')}. {lesson.title}
                          </p>
                          {isDone && (
                            <p className="text-xs text-pink/60 mt-0.5">Completada</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto min-w-0">
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
              <div className="px-4 md:px-8 py-5 md:py-6">
                {/* Title */}
                <h1 className="text-base md:text-lg uppercase font-normal text-ink mb-3 md:mb-4 tracking-tight">
                  lec. {allLessons.findIndex(l => l.id === activeLesson.id) + 1}: {activeLesson.title}
                </h1>

                {/* Description */}
                {activeLesson.description && (
                  <p className="text-sm text-ink/60 leading-relaxed mb-4">{activeLesson.description}</p>
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
                <div className="flex items-center justify-between py-4 border-t border-ink/10 mb-6">
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

                  <div>
                    {nextLesson ? (
                      <button
                        onClick={() => setActiveLesson(nextLesson)}
                        className="text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                      >
                        siguiente →
                      </button>
                    ) : (
                      <button
                        onClick={markComplete}
                        disabled={markingDone || completed.has(activeLesson.id)}
                        className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                          completed.has(activeLesson.id)
                            ? 'border-green-300 text-green-600 bg-green-50 cursor-default'
                            : 'border-pink text-pink hover:bg-pink hover:text-white'
                        }`}
                      >
                        {completed.has(activeLesson.id) ? '✓ completado' : markingDone ? 'guardando...' : 'marcar como completado'}
                      </button>
                    )}
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
