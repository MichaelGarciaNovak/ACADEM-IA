import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, course:courses(title, tag, level, duration)')
    .eq('student_id', user!.id)
    .order('enrolled_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'estudiante'

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase text-pink mb-1">portal estudiante</p>
        <h1 className="text-3xl font-normal uppercase text-ink">hola, {firstName}</h1>
      </div>

      <section>
        <h2 className="text-xs uppercase text-ink/40 mb-6 tracking-widest">mis cursos</h2>

        {!enrollments || enrollments.length === 0 ? (
          <div className="border border-ink/10 p-12 text-center">
            <p className="text-ink/40 text-sm mb-4">aún no estás inscrito en ningún curso</p>
            <a href="/#cursos" className="btn-primary text-sm">
              explorar cursos
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {enrollments.map((e: any) => (
              <div key={e.id} className="border border-ink/10 p-6 hover:border-ink/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs text-pink border border-pink/30 px-2 py-0.5">
                    {e.course?.tag}
                  </span>
                  <span className="text-xs text-ink/40">{e.course?.duration}</span>
                </div>
                <h3 className="text-base font-normal uppercase text-ink mb-4">{e.course?.title}</h3>

                {/* Barra de progreso */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-ink/10">
                    <div
                      className="h-1 bg-pink transition-all"
                      style={{ width: `${e.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink/40">{e.progress ?? 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
