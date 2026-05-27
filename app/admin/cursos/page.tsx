import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminCursosPage() {
  const supabase = createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, course_categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-12 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/30 mb-2">gestor</p>
          <h1 className="text-3xl font-normal uppercase text-ink">cursos</h1>
        </div>
        <Link href="/admin/cursos/nuevo" className="btn-primary text-sm">
          + nuevo curso
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="border border-ink/10 p-20 text-center">
          <p className="text-ink/30 text-xs uppercase tracking-widest mb-6">sin cursos aún</p>
          <Link href="/admin/cursos/nuevo" className="btn-outline text-sm inline-block">
            crear primer curso
          </Link>
        </div>
      ) : (
        <div className="border border-ink/10">
          <div className="grid grid-cols-[1fr_160px_120px_120px_100px] px-6 py-3 border-b border-ink/10">
            {['título', 'categoría', 'costo total', 'estado', 'acciones'].map((h) => (
              <span key={h} className="text-xs uppercase tracking-widest text-ink/30">{h}</span>
            ))}
          </div>
          {courses.map((c: any) => {
            const total =
              (Number(c.theory_hours) * Number(c.theory_price_per_hour)) +
              (Number(c.practice_hours) * Number(c.practice_price_per_hour))
            return (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_160px_120px_120px_100px] px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] transition-colors items-center"
              >
                <span className="text-sm text-ink uppercase truncate pr-4">{c.title}</span>
                <span className="text-xs text-ink/40">{c.course_categories?.name ?? '—'}</span>
                <span className="text-xs text-ink/60">${total.toLocaleString('es-MX')}</span>
                <span className={`text-xs uppercase tracking-widest px-2 py-1 w-fit ${
                  c.published ? 'text-green-700 bg-green-50' : 'text-ink/30 bg-ink/5'
                }`}>
                  {c.published ? 'publicado' : 'borrador'}
                </span>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/cursos/${c.id}/editar`}
                    className="text-xs uppercase text-ink/40 hover:text-ink transition-colors"
                  >
                    editar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
