import { createClient } from '@/lib/supabase/server'

export default async function AdminCursosPage() {
  const supabase = createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase text-slate mb-1">gestión</p>
          <h1 className="text-3xl font-normal uppercase text-ink">cursos</h1>
        </div>
        <button className="btn-admin text-sm py-2 px-4">
          + nuevo curso
        </button>
      </div>

      <div className="border border-ink/10">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-ink/10 bg-ink/[0.02]">
          {['título', 'categoría', 'nivel', 'estado', 'acciones'].map((h) => (
            <span key={h} className="text-xs uppercase text-ink/40">{h}</span>
          ))}
        </div>

        {!courses || courses.length === 0 ? (
          <div className="px-6 py-10 text-center text-ink/30 text-sm">
            no hay cursos creados aún
          </div>
        ) : (
          courses.map((c: any) => (
            <div key={c.id} className="grid grid-cols-5 px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] items-center">
              <span className="text-sm text-ink font-normal uppercase truncate pr-4">{c.title}</span>
              <span className="text-xs text-pink border border-pink/20 px-2 py-0.5 w-fit">{c.tag}</span>
              <span className="text-xs uppercase text-ink/50">{c.level}</span>
              <span className={`text-xs uppercase w-fit px-2 py-0.5 ${
                c.published
                  ? 'bg-ocean/10 text-ocean'
                  : 'bg-ink/5 text-ink/40'
              }`}>
                {c.published ? 'publicado' : 'borrador'}
              </span>
              <div className="flex gap-3">
                <button className="text-xs uppercase text-ink/40 hover:text-ink transition-colors">editar</button>
                <button className="text-xs uppercase text-ink/40 hover:text-pink transition-colors">eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
