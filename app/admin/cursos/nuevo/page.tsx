import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NuevoCursoPage() {
  const supabase = createClient()
  const { data: cats } = await supabase.from('course_categories').select('*').order('sort_order')

  async function createCourse(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { data, error } = await supabase.from('courses').insert({
      title: formData.get('title') as string,
      category_id: formData.get('category_id') as string || null,
      description: formData.get('description') as string,
    }).select('id').single()
    if (!error && data) redirect(`/admin/cursos/${data.id}/editar`)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-ink/30 mb-2">nuevo</p>
        <h1 className="text-2xl font-normal uppercase text-ink">crear curso</h1>
      </div>

      <form action={createCourse} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-ink/40">categoría</label>
          <select name="category_id" className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40">
            <option value="">— sin categoría —</option>
            {cats?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-ink/40">título *</label>
          <input
            name="title"
            required
            className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40 placeholder:text-ink/20"
            placeholder="Título del curso"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-ink/40">descripción corta</label>
          <textarea
            name="description"
            rows={3}
            className="border border-ink/20 bg-white text-ink font-mono text-sm px-3 py-2 outline-none focus:border-ink/40 resize-none placeholder:text-ink/20"
            placeholder="Descripción breve del curso"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary text-sm">
            crear y editar →
          </button>
          <a href="/admin/cursos" className="btn-outline text-sm">cancelar</a>
        </div>
      </form>
    </div>
  )
}
