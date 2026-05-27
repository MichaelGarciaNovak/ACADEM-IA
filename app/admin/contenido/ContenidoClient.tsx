'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import HeroSection from '@/components/sections/HeroSection'

type Section = {
  id: string
  type: string
  label: string | null
  title: string
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  bg_color: string
  accent_color: string
  text_color: string
  texture_color: string
  texture_symbol: string
  texture_opacity: number
  published: boolean
  sort_order: number
}

const TEXTURE_OPTIONS = [
  { label: 'ΛCΛDEM*IΛ', value: 'ΛCΛDEM*IΛ' },
  { label: '◯ cursos', value: '◯' },
  { label: '▦ features', value: '▦' },
  { label: '* CTA', value: '*' },
  { label: '◇ pagos', value: '◇' },
]

const COLOR_PRESETS = [
  { label: 'ink', value: '#171a21' },
  { label: 'slate', value: '#735cdd' },
  { label: 'pink', value: '#ef476f' },
  { label: 'ocean', value: '#3c91e6' },
  { label: 'alabaster', value: '#dddfdf' },
  { label: 'white', value: '#ffffff' },
]

const TEXT_COLOR_PRESETS = [
  { label: 'alabaster', value: '#dddfdf' },
  { label: 'white', value: '#ffffff' },
  { label: 'ink', value: '#171a21' },
  { label: 'pink', value: '#ef476f' },
  { label: 'slate', value: '#735cdd' },
]

const ACCENT_PRESETS = [
  { label: 'pink', value: '#ef476f' },
  { label: 'slate', value: '#735cdd' },
  { label: 'ocean', value: '#3c91e6' },
  { label: 'alabaster', value: '#dddfdf' },
  { label: 'white', value: '#ffffff' },
]

const emptyForm = (): Omit<Section, 'id'> => ({
  type: 'hero',
  label: 'plataforma educativa',
  title: '',
  subtitle: '',
  cta_text: 'Empezar gratis',
  cta_link: '/registro',
  bg_color: '#171a21',
  accent_color: '#ef476f',
  text_color: '#dddfdf',
  texture_color: '#dddfdf',
  texture_symbol: 'ΛCΛDEM*IΛ',
  texture_opacity: 5,
  published: false,
  sort_order: 0,
})

function ColorPicker({
  label,
  value,
  onChange,
  presets,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  presets: { label: string; value: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase text-ink/40 font-mono">{label}</span>
      <div className="flex gap-2 flex-wrap items-center">
        {presets.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.label}
            className="w-7 h-7 border-2 transition-all"
            style={{
              backgroundColor: c.value,
              borderColor: value === c.value ? '#735cdd' : 'rgba(23,26,33,0.15)',
            }}
          />
        ))}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-ink/15 px-2 py-1 text-xs font-mono w-24 bg-transparent text-ink focus:outline-none focus:border-slate"
          placeholder="#ffffff"
        />
      </div>
    </div>
  )
}

export default function ContenidoClient({ initialSections }: { initialSections: Section[] }) {
  const supabase = createClient()
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditingId(null)
    setForm(emptyForm())
    setPreview(false)
    setModalOpen(true)
  }

  function openEdit(s: Section) {
    setEditingId(s.id)
    setForm({
      type: s.type,
      title: s.title,
      subtitle: s.subtitle ?? '',
      cta_text: s.cta_text ?? '',
      cta_link: s.cta_link ?? '',
      label: s.label ?? 'plataforma educativa',
      bg_color: s.bg_color,
      accent_color: s.accent_color,
      text_color: s.text_color ?? '#dddfdf',
      texture_color: s.texture_color ?? '#dddfdf',
      texture_symbol: s.texture_symbol,
      texture_opacity: s.texture_opacity ?? 5,
      published: s.published,
      sort_order: s.sort_order,
    })
    setPreview(false)
    setModalOpen(true)
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    setSaving(true)
    if (editingId) {
      const { data } = await supabase
        .from('sections')
        .update(form)
        .eq('id', editingId)
        .select()
        .single()
      if (data) setSections((prev) => prev.map((s) => (s.id === editingId ? data : s)))
    } else {
      const { data } = await supabase.from('sections').insert(form).select().single()
      if (data) setSections((prev) => [...prev, data])
    }
    setSaving(false)
    setModalOpen(false)
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta sección?')) return
    await supabase.from('sections').delete().eq('id', id)
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  async function togglePublished(s: Section) {
    const next = !s.published
    await supabase.from('sections').update({ published: next }).eq('id', s.id)
    setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, published: next } : x)))
  }

  return (
    <>
      <div>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase text-slate mb-1">gestor</p>
            <h1 className="text-3xl font-normal uppercase text-ink">contenido</h1>
          </div>
          <button onClick={openNew} className="btn-admin text-sm py-2 px-4">
            + nueva sección
          </button>
        </div>

        <div className="border border-ink/10">
          <div className="grid grid-cols-5 px-6 py-3 border-b border-ink/10 bg-ink/[0.02]">
            {['tipo', 'título', 'colores', 'estado', 'acciones'].map((h) => (
              <span key={h} className="text-xs uppercase text-ink/40">{h}</span>
            ))}
          </div>

          {sections.length === 0 ? (
            <div className="px-6 py-10 text-center text-ink/30 text-sm">
              no hay secciones creadas aún
            </div>
          ) : (
            sections.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-5 px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] items-center"
              >
                <span className="text-xs uppercase text-ink/50 font-mono">{s.type}</span>
                <span className="text-sm text-ink font-normal uppercase truncate pr-4">{s.title}</span>
                <div className="flex gap-1.5 items-center">
                  <span className="w-4 h-4 border border-ink/10" style={{ backgroundColor: s.bg_color }} title="fondo" />
                  <span className="w-4 h-4 border border-ink/10" style={{ backgroundColor: s.text_color ?? '#dddfdf' }} title="texto" />
                  <span className="w-4 h-4 border border-ink/10" style={{ backgroundColor: s.accent_color }} title="acento" />
                  <span className="w-4 h-4 border border-ink/10" style={{ backgroundColor: s.texture_color ?? '#dddfdf' }} title="textura" />
                </div>
                <button
                  onClick={() => togglePublished(s)}
                  className={`text-xs uppercase w-fit px-2 py-0.5 transition-colors cursor-pointer ${
                    s.published
                      ? 'bg-ocean/10 text-ocean hover:bg-ocean/20'
                      : 'bg-ink/5 text-ink/40 hover:bg-ink/10'
                  }`}
                >
                  {s.published ? 'publicado' : 'borrador'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(s)} className="text-xs uppercase text-ink/40 hover:text-ink transition-colors">editar</button>
                  <button onClick={() => remove(s.id)} className="text-xs uppercase text-ink/40 hover:text-pink transition-colors">eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/60 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-white w-full max-w-2xl mx-4 border border-ink/10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
              <h2 className="text-sm uppercase font-mono font-normal text-ink">
                {editingId ? 'editar sección' : 'nueva sección'}
              </h2>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setPreview(!preview)}
                  className="text-xs uppercase font-mono text-ink/40 hover:text-ink transition-colors"
                >
                  {preview ? '← editor' : 'preview →'}
                </button>
                <button onClick={() => setModalOpen(false)} className="text-xl text-ink/30 hover:text-ink transition-colors leading-none">×</button>
              </div>
            </div>

            {preview ? (
              <div style={{ maxHeight: '70vh', overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '181%', pointerEvents: 'none' }}>
                  <HeroSection
                    title={form.title || 'Título de ejemplo'}
                    label={form.label || undefined}
                    subtitle={form.subtitle || undefined}
                    ctaText={form.cta_text || undefined}
                    ctaLink={form.cta_link || undefined}
                    bgColor={form.bg_color}
                    accentColor={form.accent_color}
                    textColor={form.text_color}
                    textureColor={form.texture_color}
                    textureSymbol={form.texture_symbol}
                    textureOpacity={form.texture_opacity}
                  />
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 flex flex-col gap-5">

                {/* Etiqueta pequeña */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">etiqueta pequeña</span>
                  <input
                    value={form.label ?? ''}
                    onChange={(e) => set('label', e.target.value)}
                    placeholder="plataforma educativa"
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                  />
                </label>

                {/* Título */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">título</span>
                  <input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="ΛCΛDEM*IΛ"
                    className="border border-ink/15 px-3 py-2 text-sm font-mono uppercase bg-transparent text-ink focus:outline-none focus:border-slate"
                  />
                </label>

                {/* Subtítulo */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">subtítulo</span>
                  <input
                    value={form.subtitle ?? ''}
                    onChange={(e) => set('subtitle', e.target.value)}
                    placeholder="Aprende con propósito."
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                  />
                </label>

                {/* CTA */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">texto del botón</span>
                    <input
                      value={form.cta_text ?? ''}
                      onChange={(e) => set('cta_text', e.target.value)}
                      placeholder="Empezar gratis"
                      className="border border-ink/15 px-3 py-2 text-sm font-mono uppercase bg-transparent text-ink focus:outline-none focus:border-slate"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">link del botón</span>
                    <input
                      value={form.cta_link ?? ''}
                      onChange={(e) => set('cta_link', e.target.value)}
                      placeholder="/registro"
                      className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                    />
                  </label>
                </div>

                <div className="border-t border-ink/8 pt-5 flex flex-col gap-5">
                  {/* Color fondo */}
                  <ColorPicker
                    label="color de fondo"
                    value={form.bg_color}
                    onChange={(v) => set('bg_color', v)}
                    presets={COLOR_PRESETS}
                  />

                  {/* Color texto */}
                  <ColorPicker
                    label="color del texto"
                    value={form.text_color}
                    onChange={(v) => set('text_color', v)}
                    presets={TEXT_COLOR_PRESETS}
                  />

                  {/* Color acento */}
                  <ColorPicker
                    label="color de acento (botón)"
                    value={form.accent_color}
                    onChange={(v) => set('accent_color', v)}
                    presets={ACCENT_PRESETS}
                  />

                  {/* Color textura */}
                  <ColorPicker
                    label="color de la textura de fondo"
                    value={form.texture_color}
                    onChange={(v) => set('texture_color', v)}
                    presets={COLOR_PRESETS}
                  />
                </div>

                <div className="border-t border-ink/8 pt-5 flex flex-col gap-5">
                  {/* Textura */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">textura de fondo</span>
                    <div className="flex gap-2 flex-wrap">
                      {TEXTURE_OPTIONS.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => set('texture_symbol', t.value)}
                          className="px-3 py-1.5 text-xs font-mono uppercase border transition-colors"
                          style={{
                            borderColor: form.texture_symbol === t.value ? '#735cdd' : 'rgba(23,26,33,0.15)',
                            color: form.texture_symbol === t.value ? '#735cdd' : 'rgba(23,26,33,0.4)',
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saturación / opacidad */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase text-ink/40 font-mono">saturación de la textura</span>
                      <span className="text-xs font-mono text-slate">{form.texture_opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={form.texture_opacity}
                      onChange={(e) => set('texture_opacity', parseInt(e.target.value))}
                      className="w-full accent-slate"
                    />
                    <div className="flex justify-between text-xs font-mono text-ink/20">
                      <span>tenue</span>
                      <span>intenso</span>
                    </div>
                  </label>
                </div>

                {/* Publicar + orden */}
                <div className="grid grid-cols-2 gap-4 border-t border-ink/8 pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => set('published', e.target.checked)}
                      className="w-4 h-4 accent-slate"
                    />
                    <span className="text-xs uppercase font-mono text-ink/60">publicar</span>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">orden</span>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
                      className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate w-20"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-ink/10 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="btn-admin-outline text-xs py-2 px-4">cancelar</button>
              <button onClick={save} disabled={saving || !form.title} className="btn-admin text-xs py-2 px-4 disabled:opacity-40">
                {saving ? 'guardando...' : 'guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
