import Navbar from '@/components/Navbar'
import Logo from '@/components/Logo'
import HeroSection from '@/components/sections/HeroSection'
import InfoAcordeon from '@/components/sections/InfoAcordeon'
import CarouselSection from '@/components/sections/CarouselSection'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  let sections: any[] = []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('page', '/')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    sections = data ?? []
  } catch {
    // Sin base de datos la home queda vacía: todo su contenido se administra
    // desde /admin/contenido, no hay copia estática de respaldo.
  }

  return (
    <main className="font-sans">
      <Navbar />

      {sections.map((s: any) => {
        if (s.type === 'hero') {
          let phoneImageUrl: string | undefined
          try { phoneImageUrl = s.content ? JSON.parse(s.content).phoneImageUrl : undefined } catch {}
          return (
            <HeroSection
              key={s.id}
              title={s.title}
              label={s.label ?? undefined}
              subtitle={s.subtitle ?? undefined}
              ctaText={s.cta_text ?? undefined}
              ctaLink={s.cta_link ?? undefined}
              bgColor={s.bg_color}
              accentColor={s.accent_color}
              textColor={s.text_color ?? undefined}
              bgImageUrl={s.bg_image_url ?? undefined}
              bgImageOverlay={s.bg_image_overlay ?? 50}
              titleVariants={s.title_variants ? JSON.parse(s.title_variants) : undefined}
              phoneImageUrl={phoneImageUrl}
            />
          )
        }

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

        if (s.type === 'carousel') {
          let cardBgColor = '#ffffff'
          let cardTextColor: string | undefined
          let cardAccentColor: string | undefined
          if (s.content) {
            try {
              const cc = JSON.parse(s.content)
              if (cc && typeof cc === 'object') {
                cardBgColor     = cc.cardBgColor     ?? '#ffffff'
                cardTextColor   = cc.cardTextColor
                cardAccentColor = cc.cardAccentColor
              }
            } catch {
              if (s.content.startsWith('#')) cardBgColor = s.content
            }
          }
          return (
            <CarouselSection
              key={s.id}
              label={s.label ?? undefined}
              title={s.title}
              subtitle={s.subtitle ?? undefined}
              cards={s.items ? JSON.parse(s.items) : []}
              bgColor={s.bg_color}
              textColor={s.text_color ?? '#171a21'}
              accentColor={s.accent_color}
              cardBgColor={cardBgColor}
              cardTextColor={cardTextColor}
              cardAccentColor={cardAccentColor}
            />
          )
        }

        return null
      })}

      <footer className="bg-ink border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo variant="dark" size="sm" />
          <p className="text-xs text-alabaster/30">
            © {new Date().getFullYear()} Orange Academy. todos los derechos reservados.
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
