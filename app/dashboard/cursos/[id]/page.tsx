import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CoursePlayer from '@/components/player/CoursePlayer'

export default async function CoursePlayerPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: course }, { data: chapters }, { data: progress }] = await Promise.all([
    supabase.from('courses').select('*').eq('id', params.id).eq('published', true).single(),
    supabase
      .from('course_chapters')
      .select('*, course_lessons(*)')
      .eq('course_id', params.id)
      .order('sort_order', { ascending: true })
      .order('sort_order', { referencedTable: 'course_lessons', ascending: true }),
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id),
  ])

  if (!course) notFound()

  const completedLessonIds = new Set((progress ?? []).map((p: any) => p.lesson_id))

  return (
    <div className="-m-4 md:-m-10">
      <CoursePlayer
        course={course}
        chapters={chapters ?? []}
        completedLessonIds={completedLessonIds}
        userId={user.id}
      />
    </div>
  )
}
