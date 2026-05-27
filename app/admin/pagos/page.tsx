import { createClient } from '@/lib/supabase/server'

export default async function AdminPagosPage() {
  const supabase = createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*, profile:profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase text-slate mb-1">gestión</p>
        <h1 className="text-3xl font-normal uppercase text-ink">pagos</h1>
      </div>

      <div className="border border-ink/10">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-ink/10 bg-ink/[0.02]">
          {['usuario', 'plan', 'monto', 'fecha', 'estado'].map((h) => (
            <span key={h} className="text-xs uppercase text-ink/40">{h}</span>
          ))}
        </div>

        {!payments || payments.length === 0 ? (
          <div className="px-6 py-10 text-center text-ink/30 text-sm">
            no hay registros de pagos
          </div>
        ) : (
          payments.map((p: any) => (
            <div key={p.id} className="grid grid-cols-5 px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] items-center">
              <span className="text-sm text-ink">{p.profile?.full_name ?? '—'}</span>
              <span className="text-xs uppercase text-ink/50">{p.plan}</span>
              <span className="text-sm text-ink">${p.amount}</span>
              <span className="text-xs text-ink/40">
                {new Date(p.created_at).toLocaleDateString('es-MX')}
              </span>
              <span className={`text-xs uppercase w-fit px-2 py-0.5 ${
                p.status === 'paid'
                  ? 'bg-ocean/10 text-ocean'
                  : p.status === 'failed'
                  ? 'bg-pink/10 text-pink'
                  : 'bg-ink/5 text-ink/40'
              }`}>
                {p.status === 'paid' ? 'pagado' : p.status === 'failed' ? 'fallido' : p.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
