'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Category { id: string; name: string }

export default function NuevoCursoForm({ categories }: { categories: Category[] }) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')

    const { data, error: err } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        category_id: categoryId || null,
        description: description.trim() || null,
      })
      .select('id')
      .single()

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    window.location.href = `/admin/cursos/${data.id}/editar`
  }

  return (
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-ink/30 mb-2">nuevo</p>
        <h1 className="text-2xl font-normal uppercase text-ink">crear curso</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-ink/40">categoría</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40"
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
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40 placeholder:text-ink/20"
            placeholder="Título del curso"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-ink/40">descripción corta</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40 resize-none placeholder:text-ink/20"
            placeholder="Descripción breve del curso"
          />
        </div>

        {error && (
          <p className="text-xs text-pink font-mono">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-admin text-sm disabled:opacity-50">
            {loading ? 'creando...' : 'crear y editar →'}
          </button>
          <a href="/admin/cursos" className="btn-outline text-sm">cancelar</a>
        </div>
      </form>
    </div>
  )
}
