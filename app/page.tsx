import Navbar from '@/components/Navbar'
import Logo from '@/components/Logo'
import HeroSection from '@/components/sections/HeroSection'
import InfoAcordeon from '@/components/sections/InfoAcordeon'
import { createClient } from '@/lib/supabase/server'

const features = [
  {
    label: '01',
    title: 'currículum estructurado',
    desc: 'Cada curso sigue una ruta de aprendizaje diseñada por expertos. Sin relleno, sin desvíos.',
  },
  {
    label: '02',
    title: 'aprende haciendo',
    desc: 'Proyectos reales desde la primera lección. El conocimiento que no se aplica no se queda.',
  },
  {
    label: '03',
    title: 'comunidad activa',
    desc: 'Aprende en conjunto. Revisiones de código, foros por curso y sesiones en vivo cada semana.',
  },
  {
    label: '04',
    title: 'a tu ritmo',
    desc: 'Acceso de por vida a todo el contenido. Avanza cuando puedas, tan rápido como quieras.',
  },
]

const courses = [
  { tag: 'desarrollo', title: 'fundamentos de programación', level: 'principiante', duration: '8 semanas' },
  { tag: 'diseño', title: 'diseño de interfaces modernas', level: 'intermedio', duration: '6 semanas' },
  { tag: 'datos', title: 'análisis de datos con python', level: 'intermedio', duration: '10 semanas' },
  { tag: 'ia', title: 'inteligencia artificial aplicada', level: 'avanzado', duration: '12 semanas' },
]

const plans = [
  {
    name: 'free',
    price: '$0',
    period: '/mes',
    desc: 'Para explorar la plataforma.',
    items: ['acceso a 3 cursos gratuitos', 'foros de la comunidad', 'certificados básicos'],
    cta: 'empezar gratis',
    highlight: false,
  },
  {
    name: 'pro',
    price: '$19',
    period: '/mes',
    desc: 'Para aprender en serio.',
    items: ['acceso ilimitado a todos los cursos', 'proyectos con revisión humana', 'sesiones en vivo semanales', 'certificados verificables', 'soporte prioritario'],
    cta: 'empezar pro',
    highlight: true,
  },
  {
    name: 'equipos',
    price: '$49',
    period: '/mes',
    desc: 'Para organizaciones y empresas.',
    items: ['todo lo de pro', 'hasta 10 usuarios', 'panel de administración', 'reportes de progreso', 'onboarding dedicado'],
    cta: 'contactar ventas',
    highlight: false,
  },
]

export default async function Home() {
  let heroData = null
  let extraSections: any[] = []
  try {
    const supabase = createClient()
    const { data: heroRow } = await supabase
      .from('sections')
      .select('*')
      .eq('type', 'hero')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()
    heroData = heroRow

    const { data: extras } = await supabase
      .from('sections')
      .select('*')
      .neq('type', 'hero')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    extraSections = extras ?? []
  } catch {
    // fallback to static content
  }

  return (
    <main className="font-mono">
      <Navbar />

      {/* Hero — from DB or static fallback */}
      {heroData ? (
        <HeroSection
          title={heroData.title}
          label={heroData.label ?? undefined}
          subtitle={heroData.subtitle ?? undefined}
          ctaText={heroData.cta_text ?? undefined}
          ctaLink={heroData.cta_link ?? undefined}
          bgColor={heroData.bg_color}
          accentColor={heroData.accent_color}
          textColor={heroData.text_color ?? undefined}
          bgImageUrl={(heroData as any).bg_image_url ?? undefined}
          bgImageOverlay={(heroData as any).bg_image_overlay ?? 50}
          titleVariants={(heroData as any).title_variants ? JSON.parse((heroData as any).title_variants) : undefined}
        />
      ) : (
        <section className="bg-ink text-alabaster min-h-screen flex flex-col justify-center px-6 pt-16">
          <div className="max-w-6xl mx-auto pt-24 pb-20 w-full">
            <p className="section-label mb-6">plataforma educativa</p>
            <h1 className="text-5xl md:text-7xl font-normal uppercase leading-[1.05] tracking-tight mb-8 text-white">
              aprende lo que<br />
              <span className="text-pink">importa.</span>
            </h1>
            <p className="text-lg md:text-xl text-alabaster/60 max-w-xl mb-10 leading-relaxed">
              Cursos diseñados para que llegues lejos, no para que te quedes navegando. Menos ruido, más aprendizaje real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/registro" className="btn-primary text-base">empezar gratis →</a>
              <a href="#cursos" className="btn-outline text-base">ver cursos</a>
            </div>
            <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: '4,200+', label: 'estudiantes activos' },
                { n: '38', label: 'cursos disponibles' },
                { n: '94%', label: 'tasa de completación' },
                { n: '4.9', label: 'valoración promedio' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-normal text-white">{s.n}</p>
                  <p className="text-sm text-alabaster/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secciones dinámicas adicionales */}
      {extraSections.map((s: any) => {
        if (s.type === 'info-acordeon') {
          return (
            <InfoAcordeon
              key={s.id}
              title={s.title}
              label={s.label ?? undefined}
              content={s.content ?? ''}
              items={s.items ? JSON.parse(s.items) : []}
              bgColor={s.bg_color}
              textColor={s.text_color ?? '#171a21'}
              accentColor={s.accent_color}
            />
          )
        }
        return null
      })}

      {/* Features — Blanco */}
      <section id="como-funciona" className="bg-white py-24 px-6 border-t border-ink/10">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">cómo funciona</p>
          <h2 className="text-3xl md:text-4xl font-normal uppercase text-ink mb-16 max-w-lg">
            diseñado para que termines lo que empiezas
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-ink/10">
            {features.map((f) => (
              <div key={f.label} className="bg-white p-10 hover:bg-ink/[0.02] transition-colors">
                <span className="text-pink text-sm mb-4 block">{f.label}</span>
                <h3 className="text-xl font-normal uppercase text-ink mb-3">{f.title}</h3>
                <p className="text-ink/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses — Alabaster Grey */}
      <section id="cursos" className="py-24 px-6" style={{ backgroundColor: '#dddfdf' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4" style={{ color: '#ef476f' }}>cursos destacados</p>
          <h2 className="text-3xl md:text-4xl font-normal uppercase text-ink mb-16">
            elige tu camino
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <a
                key={c.title}
                href="#"
                className="group bg-white border border-ink/10 p-8 hover:border-ink/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs text-pink border border-pink/30 px-2 py-1">{c.tag}</span>
                  <span className="text-xs text-ink/40">{c.duration}</span>
                </div>
                <h3 className="text-xl font-normal uppercase text-ink mb-2 group-hover:text-pink transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-ink/40">{c.level}</p>
                <div className="mt-6 text-sm text-pink opacity-0 group-hover:opacity-100 transition-opacity">
                  ver curso →
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/cursos" className="btn-outline" style={{ borderColor: '#171a21', color: '#171a21' }}>
              ver todos los cursos
            </a>
          </div>
        </div>
      </section>

      {/* Pricing — Blanco */}
      <section id="precios" className="bg-white py-24 px-6 border-t border-ink/10">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">precios</p>
          <h2 className="text-3xl md:text-4xl font-normal uppercase text-ink mb-16">
            sin sorpresas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`p-8 border flex flex-col ${
                  p.highlight
                    ? 'border-pink bg-pink/5'
                    : 'border-ink/10'
                }`}
              >
                {p.highlight && (
                  <span className="text-xs text-pink mb-4 block">más popular</span>
                )}
                <p className="text-sm text-ink/50 mb-2">{p.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-medium text-ink">{p.price}</span>
                  <span className="text-ink/40 text-sm">{p.period}</span>
                </div>
                <p className="text-sm text-ink/50 mb-8">{p.desc}</p>
                <ul className="space-y-3 mb-10 flex-1">
                  {p.items.map((item) => (
                    <li key={item} className="text-sm text-ink/70 flex gap-2">
                      <span className="text-pink">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/registro"
                  className={p.highlight ? 'btn-primary text-center' : 'btn-outline text-center'}
                  style={!p.highlight ? { borderColor: '#171a21', color: '#171a21' } : {}}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — Slate Blue */}
      <section className="py-32 px-6 text-center" style={{ backgroundColor: '#735cdd' }}>
        <div className="max-w-2xl mx-auto">
          <Logo variant="dark" size="lg" accentColor="#ef476f" />
          <p className="text-xl text-white/70 mt-6 mb-10 leading-relaxed">
            el aprendizaje que no se aplica no existe.<br />
            empieza hoy, gratis.
          </p>
          <a href="/registro" className="btn-primary text-lg px-10 py-4">
            crear cuenta →
          </a>
        </div>
      </section>

      {/* Footer — Ink Black */}
      <footer className="bg-ink border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo variant="dark" size="sm" accentColor="#ef476f" />
          <p className="text-xs text-alabaster/30">
            © {new Date().getFullYear()} ΛCΛDEM*IΛ. todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {['términos', 'privacidad', 'contacto'].map((l) => (
              <a key={l} href="#" className="text-xs text-alabaster/40 hover:text-alabaster transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
