import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import InfoAcordeon from '@/components/sections/InfoAcordeon'
import CarouselSection from '@/components/sections/CarouselSection'
import CurriculumSection, { CurriculumChapter } from '@/components/sections/CurriculumSection'
import ObjectivesSection from '@/components/sections/ObjectivesSection'
import { createClient } from '@/lib/supabase/server'
import { titleToSlug } from '@/lib/slugify'

interface Props {
  params: { slug: string }
}

interface CourseData {
  value_proposition: string | null
  learning_objective_1: string | null
  learning_objective_2: string | null
  learning_objective_3: string | null
  learning_objective_4: string | null
}

export default async function CursoLandingPage({ params }: Props) {
  const pageSlug = `/cursos/${params.slug}`
  let sections: any[] = []
  let chapters: CurriculumChapter[] = []
  let courseData: CourseData | null = null

  try {
    const supabase = createClient()

    const { data } = await supabase
      .from('sections')
      .select('*')
      .eq('page', pageSlug)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    sections = data ?? []

    // Load course data if any section needs it
    const needsCourseData = sections.some(s =>
      s.type === 'curriculum' || s.type === 'objectives'
    )
    if (needsCourseData) {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, value_proposition, learning_objective_1, learning_objective_2, learning_objective_3, learning_objective_4')
      const course = courses?.find(c => titleToSlug(c.title) === params.slug)
      if (course) {
        courseData = course

        // Fetch chapters only if curriculum section present
        if (sections.some(s => s.type === 'curriculum')) {
          const { data: chapterData } = await supabase
            .from('course_chapters')
            .select('*, course_lessons(*)')
            .eq('course_id', course.id)
            .order('sort_order', { ascending: true })
          chapters = chapterData ?? []
        }
      }
    }
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

        if (s.type === 'curriculum') {
          return (
            <CurriculumSection
              key={s.id}
              title={s.title}
              label={s.label ?? undefined}
              bgColor={s.bg_color}
              textColor={s.text_color ?? '#171a21'}
              accentColor={s.accent_color}
              chapters={chapters}
            />
          )
        }

        if (s.type === 'objectives') {
          return (
            <ObjectivesSection
              key={s.id}
              label={s.label ?? undefined}
              valueProposition={courseData?.value_proposition ?? ''}
              objectives={[
                courseData?.learning_objective_1 ?? '',
                courseData?.learning_objective_2 ?? '',
                courseData?.learning_objective_3 ?? '',
                courseData?.learning_objective_4 ?? '',
              ]}
              bgColor={s.bg_color}
              textColor={s.text_color ?? '#171a21'}
              accentColor={s.accent_color}
            />
          )
        }

        return null
      })}
    </main>
  )
}
