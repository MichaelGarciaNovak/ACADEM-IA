'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import HeroSection from '@/components/sections/HeroSection'
import InfoAcordeon from '@/components/sections/InfoAcordeon'
import CarouselSection, { CarouselCard } from '@/components/sections/CarouselSection'

type Section = {
  id: string
  type: string
  label: string | null
  title: string
  title_variants: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  bg_color: string
  accent_color: string
  text_color: string
  bg_image_url: string | null
  bg_image_overlay: number
  content: string | null
  items: string | null
  published: boolean
  sort_order: number
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'info-acordeon', label: 'Info Acordeón' },
  { value: 'carousel', label: 'Carousel' },
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
  title_variants: null,
  subtitle: '',
  cta_text: 'Empezar gratis',
  cta_link: '/registro',
  bg_color: '#171a21',
  accent_color: '#ef476f',
  text_color: '#dddfdf',
  bg_image_url: null,
  bg_image_overlay: 50,
  content: null,
  items: null,
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
  const [titlesText, setTitlesText] = useState('')
  const [itemsList, setItemsList] = useState<{title: string, body: string, icon?: string}[]>([])
  const [uploadingIcon, setUploadingIcon] = useState<number | null>(null)
  const [cardsList, setCardsList] = useState<CarouselCard[]>([])
  const [uploadingCardImage, setUploadingCardImage] = useState<number | null>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [cardColors, setCardColors] = useState({ bg: '#ffffff', text: '#171a21', accent: '#ef476f' })

  async function uploadCardImage(file: File, cardIndex: number) {
    setUploadingCardImage(cardIndex)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `cards/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('assets').upload(path, file, { upsert: true })
    if (error) { alert('Error al subir imagen: ' + error.message); setUploadingCardImage(null); return }
    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(path)
    setCardsList(prev => prev.map((x, j) => j === cardIndex ? { ...x, image: publicUrl } : x))
    setUploadingCardImage(null)
  }

  async function uploadIcon(file: File, itemIndex: number) {
    setUploadingIcon(itemIndex)
    const ext = file.name.split('.').pop() ?? 'png'
    const path = `icons/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('assets').upload(path, file, { upsert: true })
    if (error) { alert('Error al subir imagen: ' + error.message); setUploadingIcon(null); return }
    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(path)
    // Use functional update to always operate on latest state (avoids stale closure)
    setItemsList(prev => prev.map((x, j) => j === itemIndex ? { ...x, icon: publicUrl } : x))
    setUploadingIcon(null)
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm())
    setTitlesText('')
    setItemsList([])
    setCardsList([])
    setExpandedCard(null)
    setCardColors({ bg: '#ffffff', text: '#171a21', accent: '#ef476f' })
    setPreview(false)
    setModalOpen(true)
  }

  function openEdit(s: Section) {
    setEditingId(s.id)
    setTitlesText(s.title_variants ? JSON.parse(s.title_variants).join('\n') : '')
    setItemsList(s.type === 'info-acordeon' && s.items ? JSON.parse(s.items) : [])
    setCardsList(s.type === 'carousel' && s.items ? JSON.parse(s.items) : [])
    setExpandedCard(null)
    // Parse carousel card colors from content field (JSON or legacy hex string)
    if (s.type === 'carousel') {
      let cc: Record<string, string> = {}
      if (s.content) {
        try {
          const parsed = JSON.parse(s.content)
          if (parsed && typeof parsed === 'object') cc = parsed
        } catch {
          // Legacy: content was just a hex cardBgColor
          if (s.content.startsWith('#')) cc = { cardBgColor: s.content }
        }
      }
      setCardColors({
        bg:     cc.cardBgColor     ?? '#ffffff',
        text:   cc.cardTextColor   ?? s.text_color   ?? '#171a21',
        accent: cc.cardAccentColor ?? s.accent_color ?? '#ef476f',
      })
    } else {
      setCardColors({ bg: '#ffffff', text: '#171a21', accent: '#ef476f' })
    }
    setForm({
      type: s.type,
      title: s.title,
      subtitle: s.subtitle ?? '',
      cta_text: s.cta_text ?? '',
      cta_link: s.cta_link ?? '',
      label: s.label ?? 'plataforma educativa',
      title_variants: s.title_variants ?? null,
      content: s.content ?? null,
      items: s.items ?? null,
      bg_color: s.bg_color,
      accent_color: s.accent_color,
      text_color: s.text_color ?? '#dddfdf',
      bg_image_url: s.bg_image_url ?? null,
      bg_image_overlay: s.bg_image_overlay ?? 50,
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
    // Derive items from the correct list based on section type
    const itemsValue =
      form.type === 'carousel'
        ? (cardsList.length ? JSON.stringify(cardsList) : null)
        : form.type === 'info-acordeon'
          ? (itemsList.length ? JSON.stringify(itemsList) : null)
          : form.items
    // For carousel, serialize card colors to content field
    const contentValue =
      form.type === 'carousel'
        ? JSON.stringify({ cardBgColor: cardColors.bg, cardTextColor: cardColors.text, cardAccentColor: cardColors.accent })
        : form.content
    const formToSave = { ...form, items: itemsValue, content: contentValue }
    if (editingId) {
      const { data, error } = await supabase
        .from('sections')
        .update(formToSave)
        .eq('id', editingId)
        .select()
        .single()
      if (error) { alert('Error al guardar: ' + error.message); setSaving(false); return }
      if (data) setSections((prev) => prev.map((s) => (s.id === editingId ? data : s)))
    } else {
      const { data, error } = await supabase.from('sections').insert(formToSave).select().single()
      if (error) { alert('Error al guardar: ' + error.message); setSaving(false); return }
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
                  <span className="w-4 h-4 border border-ink/10" style={{ backgroundColor: s.bg_image_url ? '#888' : s.bg_color }} title="imagen" />
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
                  {form.type === 'hero' && (
                    <HeroSection
                      title={form.title || 'Título de ejemplo'}
                      titleVariants={form.title_variants ? JSON.parse(form.title_variants) : undefined}
                      label={form.label || undefined}
                      subtitle={form.subtitle || undefined}
                      ctaText={form.cta_text || undefined}
                      ctaLink={form.cta_link || undefined}
                      bgColor={form.bg_color}
                      accentColor={form.accent_color}
                      textColor={form.text_color}
                      bgImageUrl={form.bg_image_url || undefined}
                      bgImageOverlay={form.bg_image_overlay}
                    />
                  )}
                  {form.type === 'info-acordeon' && (
                    <InfoAcordeon
                      title={form.title || 'Título de ejemplo'}
                      content={form.content || 'Texto del párrafo izquierdo...'}
                      items={itemsList}
                      bgColor={form.bg_color}
                      textColor={form.text_color}
                      accentColor={form.accent_color}
                    />
                  )}
                  {form.type === 'carousel' && (
                    <CarouselSection
                      label={form.label ?? undefined}
                      title={form.title || 'Título del carousel'}
                      subtitle={form.subtitle ?? undefined}
                      cards={cardsList}
                      bgColor={form.bg_color}
                      textColor={form.text_color}
                      accentColor={form.accent_color}
                      cardBgColor={cardColors.bg}
                      cardTextColor={cardColors.text}
                      cardAccentColor={cardColors.accent}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 flex flex-col gap-5">

                {/* Tipo de sección */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">tipo de sección</span>
                  <div className="flex gap-2">
                    {SECTION_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => set('type', t.value)}
                        className="px-4 py-2 text-xs font-mono uppercase border transition-colors rounded-sm"
                        style={{
                          borderColor: form.type === t.value ? '#735cdd' : 'rgba(23,26,33,0.15)',
                          color: form.type === t.value ? '#735cdd' : 'rgba(23,26,33,0.4)',
                          backgroundColor: form.type === t.value ? 'rgba(115,92,221,0.06)' : 'transparent',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── HERO FIELDS ─────────────────────── */}
                {form.type === 'hero' && <>

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

                {/* Títulos animados */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">títulos animados</span>
                  <textarea
                    value={titlesText}
                    onChange={(e) => {
                      const raw = e.target.value
                      setTitlesText(raw)
                      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
                      set('title_variants', lines.length >= 2 ? JSON.stringify(lines) : null)
                    }}
                    rows={4}
                    placeholder={'Un título por línea (mínimo 2 para activar):\nAprende con IA\nAutomatiza tu trabajo\nCrece más rápido'}
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate resize-none placeholder:text-ink/20"
                  />
                  <p className="text-xs text-ink/25">
                    {form.title_variants
                      ? `✓ ${JSON.parse(form.title_variants).length} títulos activos — se ignora el título estático`
                      : 'deja vacío para usar el título estático de arriba'}
                  </p>
                </div>

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

                </div>

                <div className="border-t border-ink/8 pt-5 flex flex-col gap-5">
                  {/* Imagen de fondo */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">imagen de fondo (url)</span>
                    <input
                      value={form.bg_image_url ?? ''}
                      onChange={(e) => set('bg_image_url', e.target.value || null)}
                      placeholder="https://images.unsplash.com/..."
                      className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                    />
                    <p className="text-xs text-ink/25">deja vacío para usar solo el color de fondo</p>
                  </label>

                  {/* Preview miniatura */}
                  {form.bg_image_url && (
                    <div className="relative h-20 overflow-hidden border border-ink/10">
                      <div
                        className="absolute inset-0"
                        style={{ backgroundImage: `url(${form.bg_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      />
                      <div className="absolute inset-0" style={{ backgroundColor: form.bg_color, opacity: (form.bg_image_overlay ?? 50) / 100 }} />
                    </div>
                  )}

                  {/* Opacidad del overlay */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase text-ink/40 font-mono">oscuridad del overlay</span>
                      <span className="text-xs font-mono text-slate">{form.bg_image_overlay}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={90}
                      step={5}
                      value={form.bg_image_overlay}
                      onChange={(e) => set('bg_image_overlay', parseInt(e.target.value))}
                      className="w-full accent-slate"
                    />
                    <div className="flex justify-between text-xs font-mono text-ink/20">
                      <span>imagen limpia</span>
                      <span>muy oscuro</span>
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

                </> /* end hero fields */}

                {/* ── INFO ACORDEÓN FIELDS ─────────────── */}
                {form.type === 'info-acordeon' && <>

                {/* Nombre interno (para identificar en la lista) */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">nombre interno</span>
                  <input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="ej. FAQs, Por qué nosotros..."
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                  />
                  <p className="text-xs text-ink/25">solo visible en el admin, no aparece en la página</p>
                </label>

                {/* Etiqueta */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">etiqueta rosa (opcional)</span>
                  <input
                    value={form.label ?? ''}
                    onChange={(e) => set('label', e.target.value || null)}
                    placeholder="ej. nuestra metodología"
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                  />
                </label>

                {/* Párrafo */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">párrafo</span>
                  <textarea
                    value={form.content ?? ''}
                    onChange={(e) => set('content', e.target.value)}
                    rows={5}
                    placeholder="Texto del párrafo izquierdo..."
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate resize-none"
                  />
                </label>

                {/* Acordeones */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-ink/40 font-mono">acordeones</span>
                    <button
                      onClick={() => {
                        const next = [...itemsList, { title: '', body: '' }]
                        setItemsList(next)
                        set('items', JSON.stringify(next))
                      }}
                      className="text-xs uppercase text-slate hover:text-slate/70 font-mono transition-colors"
                    >
                      + agregar
                    </button>
                  </div>

                  {itemsList.map((item, i) => (
                    <div key={i} className="border border-ink/10 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <label className="flex items-center gap-2 cursor-pointer">
                            {item.icon
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={item.icon} alt="" className="w-8 h-8 object-contain border border-ink/10" />
                              : <div className="w-8 h-8 border border-dashed border-ink/20 flex items-center justify-center">
                                  <span className="text-ink/30 text-xs">+</span>
                                </div>
                            }
                            <span className="text-xs font-mono text-ink/40 hover:text-slate transition-colors">
                              {uploadingIcon === i ? 'subiendo...' : item.icon ? 'cambiar' : 'ícono'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingIcon !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) uploadIcon(file, i)
                                e.target.value = ''
                              }}
                            />
                          </label>
                          {item.icon && (
                            <a href={item.icon} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] font-mono text-slate/60 hover:text-slate truncate max-w-[120px]"
                            >ver url ↗</a>
                          )}
                        </div>
                        <input
                          value={item.title}
                          onChange={(e) => {
                            const next = itemsList.map((x, j) => j === i ? { ...x, title: e.target.value } : x)
                            setItemsList(next)
                            set('items', JSON.stringify(next))
                          }}
                          placeholder="Título del acordeón"
                          className="flex-1 border border-ink/15 px-3 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate"
                        />
                        <button
                          onClick={() => {
                            const next = itemsList.filter((_, j) => j !== i)
                            setItemsList(next)
                            set('items', next.length ? JSON.stringify(next) : null)
                          }}
                          className="text-ink/20 hover:text-pink transition-colors text-sm"
                        >✕</button>
                      </div>
                      <textarea
                        value={item.body}
                        onChange={(e) => {
                          const next = itemsList.map((x, j) => j === i ? { ...x, body: e.target.value } : x)
                          setItemsList(next)
                          set('items', JSON.stringify(next))
                        }}
                        rows={2}
                        placeholder="Contenido del acordeón..."
                        className="border border-ink/15 px-3 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate resize-none"
                      />
                    </div>
                  ))}

                  {itemsList.length === 0 && (
                    <p className="text-xs text-ink/25 font-mono">no hay acordeones aún — haz clic en + agregar</p>
                  )}
                </div>

                {/* Colores */}
                <div className="border-t border-ink/8 pt-5 flex flex-col gap-4">
                  <ColorPicker label="color de fondo" value={form.bg_color} onChange={(v) => set('bg_color', v)} presets={COLOR_PRESETS} />
                  <ColorPicker label="color del texto" value={form.text_color} onChange={(v) => set('text_color', v)} presets={TEXT_COLOR_PRESETS} />
                  <ColorPicker label="color de acento" value={form.accent_color} onChange={(v) => set('accent_color', v)} presets={ACCENT_PRESETS} />
                </div>

                {/* Publicar + orden */}
                <div className="grid grid-cols-2 gap-4 border-t border-ink/8 pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-slate" />
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

                </> /* end info-acordeon fields */}

                {/* ── CAROUSEL FIELDS ─────────────────── */}
                {form.type === 'carousel' && <>

                {/* Etiqueta */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">etiqueta rosa (opcional)</span>
                  <input value={form.label ?? ''} onChange={(e) => set('label', e.target.value || null)}
                    placeholder="ej. cursos destacados"
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                </label>

                {/* Título sección */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">título de sección</span>
                  <input value={form.title} onChange={(e) => set('title', e.target.value)}
                    placeholder="Elige tu camino"
                    className="border border-ink/15 px-3 py-2 text-sm font-mono uppercase bg-transparent text-ink focus:outline-none focus:border-slate" />
                </label>

                {/* Subtítulo sección */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase text-ink/40 font-mono">subtítulo de sección (opcional)</span>
                  <input value={form.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value || null)}
                    placeholder="Una línea descriptiva..."
                    className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                </label>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-ink/40 font-mono">cards ({cardsList.length})</span>
                    <button
                      onClick={() => {
                        const next = [...cardsList, { title: '', ctaText: 'ver más' }]
                        setCardsList(next)
                        setExpandedCard(next.length - 1)
                      }}
                      className="text-xs uppercase text-slate hover:text-slate/70 font-mono transition-colors"
                    >+ agregar card</button>
                  </div>

                  {cardsList.map((card, i) => (
                    <div key={i} className="border border-ink/10">
                      {/* Card header */}
                      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-ink/[0.02]"
                        onClick={() => setExpandedCard(expandedCard === i ? null : i)}>
                        {card.image
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={card.image} alt="" className="w-8 h-10 object-cover flex-shrink-0 border border-ink/10" />
                          : <div className="w-8 h-10 border border-dashed border-ink/15 flex-shrink-0 flex items-center justify-center">
                              <span className="text-ink/20 text-[9px]">img</span>
                            </div>
                        }
                        <span className="text-xs font-mono text-ink flex-1 truncate">
                          {card.title || <span className="text-ink/30">sin título</span>}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const next = cardsList.filter((_, j) => j !== i)
                            setCardsList(next)
                            setExpandedCard(null)
                          }}
                          className="text-ink/20 hover:text-pink transition-colors text-xs ml-2"
                        >✕</button>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          className={`flex-shrink-0 transition-transform duration-200 ${expandedCard === i ? 'rotate-90' : ''}`}>
                          <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>

                      {/* Card fields */}
                      {expandedCard === i && (
                        <div className="border-t border-ink/8 p-3 flex flex-col gap-2.5">
                          {/* Image upload + URL */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase text-ink/30 font-mono">imagen principal</span>
                            <div className="flex items-start gap-3">
                              <label className="cursor-pointer flex-shrink-0">
                                {card.image
                                  // eslint-disable-next-line @next/next/no-img-element
                                  ? <img src={card.image} alt="" className="w-14 h-[4.5rem] object-cover border border-ink/10" />
                                  : <div className="w-14 h-[4.5rem] border border-dashed border-ink/20 flex items-center justify-center">
                                      <span className="text-ink/25 text-[10px]">+</span>
                                    </div>
                                }
                                <input type="file" accept="image/*" className="hidden"
                                  disabled={uploadingCardImage !== null}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) uploadCardImage(file, i)
                                    e.target.value = ''
                                  }} />
                              </label>
                              <div className="flex flex-col gap-1.5 flex-1">
                                <input
                                  value={card.image ?? ''}
                                  onChange={(e) => setCardsList(prev => prev.map((x, j) => j === i ? { ...x, image: e.target.value || undefined } : x))}
                                  placeholder="https://... o sube una imagen"
                                  className="border border-ink/15 px-2 py-1.5 text-[10px] font-mono bg-transparent text-ink focus:outline-none focus:border-slate w-full"
                                />
                                <span className="text-[10px] font-mono text-ink/25">
                                  {uploadingCardImage === i ? 'subiendo...' : 'pega url o haz clic en la miniatura para subir'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Badge + Category */}
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-ink/30 font-mono">badge</span>
                              <input value={card.badge ?? ''} placeholder="nuevo"
                                onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badge: e.target.value||undefined} : x))}
                                className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                            </label>
                            <label className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-ink/30 font-mono">categoría</span>
                              <input value={card.category ?? ''} placeholder="desarrollo"
                                onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, category: e.target.value||undefined} : x))}
                                className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                            </label>
                          </div>

                          {/* Title */}
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-ink/30 font-mono">título *</span>
                            <input value={card.title} placeholder="Fundamentos de IA"
                              onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, title: e.target.value} : x))}
                              className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                          </label>

                          {/* Subtitle */}
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-ink/30 font-mono">subtítulo</span>
                            <input value={card.subtitle ?? ''} placeholder="Aprende desde cero"
                              onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, subtitle: e.target.value||undefined} : x))}
                              className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                          </label>

                          {/* Description */}
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-ink/30 font-mono">descripción corta</span>
                            <textarea value={card.description ?? ''} rows={2} placeholder="Texto breve..."
                              onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, description: e.target.value||undefined} : x))}
                              className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate resize-none" />
                          </label>

                          {/* Duration + CTA */}
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-ink/30 font-mono">duración</span>
                              <input value={card.duration ?? ''} placeholder="8 semanas"
                                onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, duration: e.target.value||undefined} : x))}
                                className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                            </label>
                            <label className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-ink/30 font-mono">texto cta</span>
                              <input value={card.ctaText ?? ''} placeholder="ver curso"
                                onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, ctaText: e.target.value||undefined} : x))}
                                className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                            </label>
                          </div>
                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-ink/30 font-mono">link cta</span>
                            <input value={card.ctaLink ?? ''} placeholder="/cursos/nombre-del-curso"
                              onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, ctaLink: e.target.value||undefined} : x))}
                              className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                          </label>

                          {/* ── Badge circular ── */}
                          <div className="border-t border-ink/8 pt-2.5 mt-0.5 flex flex-col gap-2">
                            <p className="text-[10px] uppercase font-mono text-ink/30 tracking-widest">badge circular (opcional)</p>
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-ink/25 font-mono">texto arriba</span>
                                <input value={card.badgeTopText ?? ''} placeholder="diseño"
                                  onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeTopText: e.target.value||undefined} : x))}
                                  className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                              </label>
                              <label className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-ink/25 font-mono">texto abajo</span>
                                <input value={card.badgeBottomText ?? ''} placeholder="web"
                                  onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeBottomText: e.target.value||undefined} : x))}
                                  className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate" />
                              </label>
                            </div>
                            <label className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-ink/25 font-mono">ícono (emoji)</span>
                              <input value={card.badgeIcon ?? ''} placeholder="🎨"
                                onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeIcon: e.target.value||undefined} : x))}
                                className="border border-ink/15 px-2 py-1.5 text-xs font-mono bg-transparent text-ink focus:outline-none focus:border-slate w-24" />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-ink/25 font-mono">fondo badge</span>
                                <div className="flex gap-1.5 flex-wrap items-center">
                                  {['#171a21','#735cdd','#ef476f','#3c91e6','#dddfdf','#ffffff'].map(c => (
                                    <button key={c} onClick={() => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeBgColor: c} : x))}
                                      className="w-5 h-5 border-2 transition-all flex-shrink-0"
                                      style={{ backgroundColor: c, borderColor: card.badgeBgColor === c ? '#735cdd' : 'rgba(23,26,33,0.15)' }} />
                                  ))}
                                  <input type="text" value={card.badgeBgColor ?? ''} placeholder="#ef476f"
                                    onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeBgColor: e.target.value||undefined} : x))}
                                    className="border border-ink/15 px-1.5 py-1 text-[10px] font-mono w-16 bg-transparent text-ink focus:outline-none focus:border-slate" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-ink/25 font-mono">texto badge</span>
                                <div className="flex gap-1.5 flex-wrap items-center">
                                  {['#ffffff','#dddfdf','#171a21','#ef476f','#735cdd'].map(c => (
                                    <button key={c} onClick={() => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeTextColor: c} : x))}
                                      className="w-5 h-5 border-2 transition-all flex-shrink-0"
                                      style={{ backgroundColor: c, borderColor: card.badgeTextColor === c ? '#735cdd' : 'rgba(23,26,33,0.15)' }} />
                                  ))}
                                  <input type="text" value={card.badgeTextColor ?? ''} placeholder="#ffffff"
                                    onChange={(e) => setCardsList(prev => prev.map((x,j) => j===i ? {...x, badgeTextColor: e.target.value||undefined} : x))}
                                    className="border border-ink/15 px-1.5 py-1 text-[10px] font-mono w-16 bg-transparent text-ink focus:outline-none focus:border-slate" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {cardsList.length === 0 && (
                    <p className="text-xs text-ink/25 font-mono">no hay cards aún — haz clic en + agregar card</p>
                  )}
                </div>

                {/* Colores */}
                <div className="border-t border-ink/8 pt-5 flex flex-col gap-4">
                  <p className="text-[10px] uppercase font-mono text-ink/30 tracking-widest">— sección —</p>
                  <ColorPicker label="fondo de sección" value={form.bg_color} onChange={(v) => set('bg_color', v)} presets={COLOR_PRESETS} />
                  <ColorPicker label="color del título" value={form.text_color} onChange={(v) => set('text_color', v)} presets={TEXT_COLOR_PRESETS} />
                  <ColorPicker label="color de la etiqueta" value={form.accent_color} onChange={(v) => set('accent_color', v)} presets={ACCENT_PRESETS} />
                  <p className="text-[10px] uppercase font-mono text-ink/30 tracking-widest mt-1">— card —</p>
                  <ColorPicker label="fondo del card" value={cardColors.bg} onChange={(v) => setCardColors(c => ({ ...c, bg: v }))} presets={COLOR_PRESETS} />
                  <ColorPicker label="texto del card" value={cardColors.text} onChange={(v) => setCardColors(c => ({ ...c, text: v }))} presets={TEXT_COLOR_PRESETS} />
                  <ColorPicker label="acento del card (categoría + cta)" value={cardColors.accent} onChange={(v) => setCardColors(c => ({ ...c, accent: v }))} presets={ACCENT_PRESETS} />
                </div>

                {/* Publicar + orden */}
                <div className="grid grid-cols-2 gap-4 border-t border-ink/8 pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-slate" />
                    <span className="text-xs uppercase font-mono text-ink/60">publicar</span>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase text-ink/40 font-mono">orden</span>
                    <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
                      className="border border-ink/15 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none focus:border-slate w-20" />
                  </label>
                </div>

                </> /* end carousel fields */}

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
