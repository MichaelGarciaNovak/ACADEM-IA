'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  duration_minutes: number | null
  sort_order: number
}

interface Chapter {
  id: string
  course_id: string
  title: string
  sort_order: number
  course_lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string | null
  image_url: string | null
  category_id: string | null
  theory_hours: number
  theory_price_per_hour: number
  practice_hours: number
  practice_price_per_hour: number
  published: boolean
  course_categories?: { id: string; name: string } | null
}

interface Props {
  course: Course
  categories: { id: string; name: string; slug: string }[]
  initialChapters: Chapter[]
}

// ─── Lesson Item ─────────────────────────────────────────────────────────────

function LessonItem({
  lesson,
  onUpdate,
  onDelete,
}: {
  lesson: Lesson
  onUpdate: (id: string, data: Partial<Lesson>) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [data, setData] = useState(lesson)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleChange = (field: keyof Lesson, value: string) => {
    const updated = { ...data, [field]: value }
    setData(updated)
    onUpdate(lesson.id, { [field]: value })
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      await supabase.from('course_lessons').update({ [field]: value }).eq('id', lesson.id)
    }, 800)
  }

  return (
    <div ref={setNodeRef} style={style} className="border-t border-ink/5">
      {/* Lesson header row */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-ink/[0.015] transition-colors">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-ink/20 hover:text-ink/50 cursor-grab active:cursor-grabbing text-xs select-none"
        >
          ⋮⋮
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left text-sm text-ink/70 hover:text-ink transition-colors uppercase"
        >
          {data.title || 'sin título'}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(!expanded)}>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className={`text-ink/30 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            >
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(lesson.id)}
            className="text-xs text-ink/20 hover:text-pink transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 bg-ink/[0.015] border-t border-ink/5">
          <div className="grid gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/30">título</label>
              <input
                value={data.title}
                onChange={e => handleChange('title', e.target.value)}
                className="border border-ink/15 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/30"
                placeholder="Título de la lección"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/30">descripción</label>
              <textarea
                value={data.description ?? ''}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
                className="border border-ink/15 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/30 resize-none"
                placeholder="Descripción breve de la lección"
              />
            </div>

            {/* URLs — 2 cols */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-ink/30">liga de video</label>
                <input
                  value={data.video_url ?? ''}
                  onChange={e => handleChange('video_url', e.target.value)}
                  className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30"
                  placeholder="https://vimeo.com/..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-ink/30">liga de presentación</label>
                <input
                  value={data.presentation_url ?? ''}
                  onChange={e => handleChange('presentation_url', e.target.value)}
                  className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30"
                  placeholder="https://www.canva.com/design/..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-ink/30">liga de PDF</label>
                <input
                  value={data.pdf_url ?? ''}
                  onChange={e => handleChange('pdf_url', e.target.value)}
                  className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30"
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-ink/30">hoja de trabajo</label>
                <input
                  value={data.worksheet_url ?? ''}
                  onChange={e => handleChange('worksheet_url', e.target.value)}
                  className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/30">liga de la herramienta</label>
              <input
                value={data.tool_url ?? ''}
                onChange={e => handleChange('tool_url', e.target.value)}
                className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30"
                placeholder="https://..."
              />
              <p className="text-xs text-ink/25 mt-1">si agregas una liga, la herramienta aparecerá con tarjeta de acceso en la lección del portal.</p>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/30">duración (minutos)</label>
              <input
                type="number"
                min={0}
                value={data.duration_minutes ?? ''}
                onChange={e => {
                  const val = e.target.value === '' ? null : parseInt(e.target.value)
                  const updated = { ...data, duration_minutes: val }
                  setData(updated)
                  onUpdate(lesson.id, { duration_minutes: val })
                  if (saveTimeout.current) clearTimeout(saveTimeout.current)
                  saveTimeout.current = setTimeout(async () => {
                    await supabase.from('course_lessons').update({ duration_minutes: val }).eq('id', lesson.id)
                  }, 800)
                }}
                className="border border-ink/15 bg-white text-ink font-mono text-xs px-3 py-2 outline-none focus:border-ink/30 w-28"
                placeholder="ej. 25"
              />
              <p className="text-xs text-ink/25 mt-1">aparece en el temario de la landing del curso</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Chapter Item ─────────────────────────────────────────────────────────────

function ChapterItem({
  chapter,
  onUpdateChapter,
  onDeleteChapter,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReorderLessons,
}: {
  chapter: Chapter
  onUpdateChapter: (id: string, title: string) => void
  onDeleteChapter: (id: string) => void
  onAddLesson: (chapterId: string) => void
  onUpdateLesson: (id: string, data: Partial<Lesson>) => void
  onDeleteLesson: (chapterId: string, lessonId: string) => void
  onReorderLessons: (chapterId: string, lessons: Lesson[]) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [title, setTitle] = useState(chapter.title)
  const [lessons, setLessons] = useState<Lesson[]>(chapter.course_lessons ?? [])
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleTitleChange = (v: string) => {
    setTitle(v)
    onUpdateChapter(chapter.id, v)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      await supabase.from('course_chapters').update({ title: v }).eq('id', chapter.id)
    }, 800)
  }

  const handleLessonDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = lessons.findIndex(l => l.id === active.id)
    const newIndex = lessons.findIndex(l => l.id === over.id)
    const reordered = arrayMove(lessons, oldIndex, newIndex).map((l, i) => ({ ...l, sort_order: i }))
    setLessons(reordered)
    onReorderLessons(chapter.id, reordered)
    await Promise.all(
      reordered.map(l => supabase.from('course_lessons').update({ sort_order: l.sort_order }).eq('id', l.id))
    )
  }

  const handleUpdateLesson = (id: string, data: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
    onUpdateLesson(id, data)
  }

  const handleDeleteLesson = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id))
    onDeleteLesson(chapter.id, id)
  }

  const handleAddLesson = () => {
    onAddLesson(chapter.id)
  }

  // Sync when parent adds a lesson
  const currentIds = new Set(lessons.map(l => l.id))
  const newLessons = (chapter.course_lessons ?? []).filter(l => !currentIds.has(l.id))
  if (newLessons.length > 0) {
    setLessons(prev => [...prev, ...newLessons])
  }

  return (
    <div ref={setNodeRef} style={style} className="border border-ink/10 mb-3">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ink/[0.02]">
        <button
          {...attributes}
          {...listeners}
          className="text-ink/20 hover:text-ink/50 cursor-grab active:cursor-grabbing text-xs select-none"
        >
          ⠿
        </button>

        <button onClick={() => setCollapsed(!collapsed)}>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={`text-ink/30 transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
          >
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <input
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          className="flex-1 bg-transparent text-sm font-mono text-ink uppercase outline-none border-b border-transparent focus:border-ink/20 py-0.5"
          placeholder="Título del capítulo"
        />

        <button
          onClick={() => onDeleteChapter(chapter.id)}
          className="text-xs text-ink/20 hover:text-pink transition-colors ml-2"
        >
          ✕
        </button>
      </div>

      {/* Lessons */}
      {!collapsed && (
        <div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
            <SortableContext items={lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
              {lessons.map(lesson => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  onUpdate={handleUpdateLesson}
                  onDelete={handleDeleteLesson}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="px-4 py-3">
            <button
              onClick={handleAddLesson}
              className="text-xs text-slate hover:text-slate/70 transition-colors uppercase tracking-widest"
            >
              + agregar lección
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main CourseEditor ────────────────────────────────────────────────────────

export default function CourseEditor({ course, categories, initialChapters }: Props) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    title: course.title,
    description: course.description ?? '',
    category_id: course.category_id ?? '',
    image_url: course.image_url ?? '',
    theory_hours: course.theory_hours,
    theory_price_per_hour: course.theory_price_per_hour,
    practice_hours: course.practice_hours,
    practice_price_per_hour: course.practice_price_per_hour,
    published: course.published,
  })
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  const theoryCost = form.theory_hours * form.theory_price_per_hour
  const practiceCost = form.practice_hours * form.practice_price_per_hour
  const total = theoryCost + practiceCost

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Autosave course metadata
  const handleFormChange = (field: string, value: any) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      setSaveError('')
      const { error } = await supabase.from('courses').update({ [field]: value }).eq('id', course.id)
      setSaving(false)
      if (error) {
        setSaveError(error.message)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    }, 800)
  }

  // Save all metadata immediately
  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    const { error } = await supabase.from('courses').update({
      title: form.title,
      description: form.description || null,
      category_id: form.category_id || null,
      theory_hours: form.theory_hours,
      theory_price_per_hour: form.theory_price_per_hour,
      practice_hours: form.practice_hours,
      practice_price_per_hour: form.practice_price_per_hour,
      published: form.published,
      image_url: form.image_url || null,
    }).eq('id', course.id)
    setSaving(false)
    if (error) {
      setSaveError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  // Chapters DnD
  const handleChapterDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = chapters.findIndex(c => c.id === active.id)
    const newIndex = chapters.findIndex(c => c.id === over.id)
    const reordered = arrayMove(chapters, oldIndex, newIndex).map((c, i) => ({ ...c, sort_order: i }))
    setChapters(reordered)
    await Promise.all(
      reordered.map(c => supabase.from('course_chapters').update({ sort_order: c.sort_order }).eq('id', c.id))
    )
  }

  const handleAddChapter = async () => {
    const { data } = await supabase.from('course_chapters').insert({
      course_id: course.id,
      title: `Capítulo ${chapters.length + 1}`,
      sort_order: chapters.length,
    }).select('*').single()
    if (data) setChapters(prev => [...prev, { ...data, course_lessons: [] }])
  }

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('¿Eliminar este capítulo y todas sus lecciones?')) return
    await supabase.from('course_chapters').delete().eq('id', id)
    setChapters(prev => prev.filter(c => c.id !== id))
  }

  const handleUpdateChapter = (id: string, title: string) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }

  const handleAddLesson = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId)
    const { data } = await supabase.from('course_lessons').insert({
      chapter_id: chapterId,
      title: `Lección ${(chapter?.course_lessons?.length ?? 0) + 1}`,
      sort_order: chapter?.course_lessons?.length ?? 0,
    }).select('*').single()
    if (data) {
      setChapters(prev => prev.map(c =>
        c.id === chapterId
          ? { ...c, course_lessons: [...(c.course_lessons ?? []), data] }
          : c
      ))
    }
  }

  const handleDeleteLesson = async (chapterId: string, lessonId: string) => {
    await supabase.from('course_lessons').delete().eq('id', lessonId)
    setChapters(prev => prev.map(c =>
      c.id === chapterId
        ? { ...c, course_lessons: c.course_lessons.filter(l => l.id !== lessonId) }
        : c
    ))
  }

  const handleUpdateLesson = (id: string, data: Partial<Lesson>) => {
    setChapters(prev => prev.map(c => ({
      ...c,
      course_lessons: c.course_lessons.map(l => l.id === id ? { ...l, ...data } : l),
    })))
  }

  const handleReorderLessons = (chapterId: string, lessons: Lesson[]) => {
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, course_lessons: lessons } : c))
  }

  return (
    <div className="font-mono">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <a href="/admin/cursos" className="text-xs text-ink/30 hover:text-ink transition-colors uppercase tracking-widest">
            ← cursos
          </a>
          <h1 className="text-2xl font-normal uppercase text-ink mt-1">editar curso</h1>
          <p className="text-xs text-ink/30 mt-1">modifica los datos del curso</p>
        </div>
        <div className="flex items-center gap-4">
          {saving && <span className="text-xs text-ink/30 uppercase tracking-widest">guardando...</span>}
          {saved && <span className="text-xs text-green-600 uppercase tracking-widest">guardado ✓</span>}
          {saveError && <span className="text-xs text-pink font-mono max-w-xs truncate" title={saveError}>error: {saveError}</span>}
          <button onClick={handleSave} className="btn-admin text-sm">
            guardar cambios
          </button>
          <button
            onClick={() => handleFormChange('published', !form.published)}
            className={`text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
              form.published
                ? 'border-green-600 text-green-700 hover:bg-green-50'
                : 'border-ink/20 text-ink/40 hover:border-ink/40'
            }`}
          >
            {form.published ? '● publicado' : '○ borrador'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-12">
        {/* LEFT — metadata */}
        <div className="flex flex-col gap-6">

          {/* Category + Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/40">categoría *</label>
              <select
                value={form.category_id}
                onChange={e => handleFormChange('category_id', e.target.value)}
                className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40"
              >
                <option value="">— sin categoría —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-ink/40">título *</label>
              <input
                value={form.title}
                onChange={e => handleFormChange('title', e.target.value)}
                className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40"
                placeholder="Título del curso"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-ink/40">
              descripción <span className="text-ink/25">(máx 50 palabras)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => handleFormChange('description', e.target.value)}
              rows={3}
              className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40 resize-none"
              placeholder="Descripción breve del curso"
            />
            <p className="text-xs text-ink/25">
              {form.description.split(/\s+/).filter(Boolean).length}/50 palabras
            </p>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-ink/40">imagen del curso (4:3)</label>
            <input
              value={form.image_url}
              onChange={e => handleFormChange('image_url', e.target.value)}
              className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40"
              placeholder="https://... (URL de imagen)"
            />
            {form.image_url && (
              <div className="mt-2 aspect-[4/3] w-48 overflow-hidden border border-ink/10">
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Hours + Pricing */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'hrs. teóricas', field: 'theory_hours', value: form.theory_hours },
              { label: 'precio/hr teórica', field: 'theory_price_per_hour', value: form.theory_price_per_hour },
              { label: 'hrs. prácticas', field: 'practice_hours', value: form.practice_hours },
              { label: 'precio/hr práctica', field: 'practice_price_per_hour', value: form.practice_price_per_hour },
            ].map(({ label, field, value }) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-ink/40">{label}</label>
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={e => handleFormChange(field, parseFloat(e.target.value) || 0)}
                  className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40"
                />
              </div>
            ))}
          </div>

          {/* Cost summary */}
          <div className="border border-ink/10 p-5 bg-ink/[0.015]">
            <p className="text-xs uppercase tracking-widest text-ink/40 mb-4">resumen de costos</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'costo teórico', value: theoryCost },
                { label: 'costo práctico', value: practiceCost },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-ink/50 capitalize">{row.label}</span>
                  <span className="text-ink">${row.value.toLocaleString('es-MX')}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-ink/10 pt-2 mt-1">
                <span className="text-ink uppercase tracking-widest text-xs">Total</span>
                <span className="text-ink font-medium">${total.toLocaleString('es-MX')}</span>
              </div>
            </div>
          </div>

          {/* ─── CHAPTERS ─────────────────────────────────── */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-ink/40">contenido del curso</p>
              <p className="text-xs text-ink/25">capítulos y lecciones (solo visible en el portal del cliente, no en la propuesta PDF)</p>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleChapterDragEnd}>
              <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {chapters.map((chapter, idx) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    onUpdateChapter={handleUpdateChapter}
                    onDeleteChapter={handleDeleteChapter}
                    onAddLesson={handleAddLesson}
                    onUpdateLesson={handleUpdateLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onReorderLessons={handleReorderLessons}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <button
              onClick={handleAddChapter}
              className="w-full border border-dashed border-ink/20 py-3 text-xs uppercase tracking-widest text-ink/40 hover:border-slate hover:text-slate transition-colors mt-2"
            >
              + agregar capítulo
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-ink/10">
            <a href="/admin/cursos" className="btn-outline text-sm">cancelar</a>
            <button onClick={handleSave} className="btn-admin text-sm">
              {saving ? 'guardando...' : 'guardar cambios'}
            </button>
          </div>
        </div>

        {/* RIGHT — quick info panel */}
        <div className="flex flex-col gap-6 pt-8">
          <div className="border border-ink/10 p-5">
            <p className="text-xs uppercase tracking-widest text-ink/30 mb-4">resumen</p>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-ink/40">capítulos</span>
                <span className="text-ink">{chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/40">lecciones</span>
                <span className="text-ink">{chapters.reduce((acc, c) => acc + (c.course_lessons?.length ?? 0), 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/40">horas totales</span>
                <span className="text-ink">{form.theory_hours + form.practice_hours}h</span>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 mt-1">
                <span className="text-ink/40">costo total</span>
                <span className="text-ink font-medium">${total.toLocaleString('es-MX')}</span>
              </div>
            </div>
          </div>

          <div className="border border-ink/10 p-5">
            <p className="text-xs uppercase tracking-widest text-ink/30 mb-4">estado</p>
            <button
              onClick={() => handleFormChange('published', !form.published)}
              className={`w-full text-xs uppercase tracking-widest py-2 border transition-colors ${
                form.published
                  ? 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100'
                  : 'border-ink/20 text-ink/50 hover:border-slate hover:text-slate'
              }`}
            >
              {form.published ? '● publicado' : '○ publicar curso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
