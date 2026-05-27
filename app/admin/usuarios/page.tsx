import { createClient } from '@/lib/supabase/server'

export default async function AdminUsuariosPage() {
  const supabase = createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase text-slate mb-1">gestión</p>
        <h1 className="text-3xl font-normal uppercase text-ink">usuarios</h1>
      </div>

      <div className="border border-ink/10">
        <div className="grid grid-cols-4 px-6 py-3 border-b border-ink/10 bg-ink/[0.02]">
          {['nombre', 'rol', 'registro', 'acciones'].map((h) => (
            <span key={h} className="text-xs uppercase text-ink/40">{h}</span>
          ))}
        </div>

        {!users || users.length === 0 ? (
          <div className="px-6 py-10 text-center text-ink/30 text-sm">
            no hay usuarios registrados
          </div>
        ) : (
          users.map((u: any) => (
            <div key={u.id} className="grid grid-cols-4 px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] items-center">
              <span className="text-sm text-ink">{u.full_name ?? '—'}</span>
              <span className={`text-xs uppercase w-fit px-2 py-0.5 ${
                u.role === 'admin'
                  ? 'bg-slate/10 text-slate'
                  : 'bg-ink/5 text-ink/50'
              }`}>
                {u.role}
              </span>
              <span className="text-xs text-ink/40">
                {new Date(u.created_at).toLocaleDateString('es-MX')}
              </span>
              <div className="flex gap-3">
                <button className="text-xs uppercase text-ink/40 hover:text-ink transition-colors">
                  editar
                </button>
                <button className="text-xs uppercase text-ink/40 hover:text-pink transition-colors">
                  desactivar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
