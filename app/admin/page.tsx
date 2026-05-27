import { createClient } from '@/lib/supabase/server'

export default async function AdminMetricsPage() {
  const supabase = createClient()

  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalEnrollments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
  ])

  const metrics = [
    { label: 'estudiantes', value: totalUsers ?? 0 },
    { label: 'cursos publicados', value: totalCourses ?? 0 },
    { label: 'inscripciones totales', value: totalEnrollments ?? 0 },
  ]

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase text-slate mb-1">panel de control</p>
        <h1 className="text-3xl font-normal uppercase text-ink">métricas</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {metrics.map((m) => (
          <div key={m.label} className="border border-ink/10 p-6">
            <p className="text-4xl font-normal text-ink mb-1">{m.value.toLocaleString()}</p>
            <p className="text-xs uppercase text-ink/40">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="border border-ink/10 p-8 text-center text-ink/30 text-sm">
        próximamente: gráficas de actividad y retención
      </div>
    </div>
  )
}
