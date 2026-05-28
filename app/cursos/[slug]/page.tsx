import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import InfoAcordeon from '@/components/sections/InfoAcordeon'
import CarouselSection from '@/components/sections/CarouselSection'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: { slug: string }
}

export default async function CursoLandingPage({ params }: Props) {
  const pageSlug = `/cursos/${params.slug}`
  let sections: any[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('page', pageSlug)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    sections = data ?? []
  } catch {
    // DB unavailable — fall through to notFound or empty
  }

  if (sections.length === 0) notFound()

  return (
    <main className="font-mono">
      <Navbar />

      {sections.map((s: any) => {
        if (s.type === 'hero') {
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
    </main>
  )
}
