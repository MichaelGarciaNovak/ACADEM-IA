import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CatalogoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase
      .from('courses')
      .select('*, course_categories(name)')
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('user_id', user?.id ?? ''),
  ])

  const enrolledIds = new Set((enrollments ?? []).map((e: any) => e.course_id))

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-ink/30 mb-2">explorar</p>
        <h1 className="text-2xl font-normal uppercase text-ink">catálogo de cursos</h1>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="border border-ink/10 p-16 text-center">
          <p className="text-xs text-ink/30 uppercase tracking-widest">próximamente</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {courses.map((c: any) => {
            const isEnrolled = enrolledIds.has(c.id)
            const total =
              (Number(c.theory_hours) * Number(c.theory_price_per_hour)) +
              (Number(c.practice_hours) * Number(c.practice_price_per_hour))

            return (
              <div key={c.id} className="border border-ink/10 p-6 hover:border-ink/20 transition-colors">
                {c.image_url && (
                  <div className="aspect-[4/3] overflow-hidden mb-4 bg-ink/5">
                    <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs text-pink border border-pink/20 px-2 py-0.5">
                    {c.course_categories?.name ?? '—'}
                  </span>
                  {total > 0 && (
                    <span className="text-xs text-ink/40">${total.toLocaleString('es-MX')}</span>
                  )}
                </div>
                <h2 className="text-base uppercase text-ink mb-3">{c.title}</h2>
                {c.description && (
                  <p className="text-xs text-ink/50 leading-relaxed mb-5 line-clamp-3">{c.description}</p>
                )}
                <Link
                  href={`/dashboard/cursos/${c.id}`}
                  className={isEnrolled ? 'btn-primary text-xs inline-block' : 'btn-outline text-xs inline-block'}
                >
                  {isEnrolled ? 'continuar →' : 'ver curso →'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
