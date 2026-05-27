import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseEditor from '@/components/admin/courses/CourseEditor'

export default async function EditarCursoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: course }, { data: categories }, { data: chapters }] = await Promise.all([
    supabase.from('courses').select('*, course_categories(id, name)').eq('id', params.id).single(),
    supabase.from('course_categories').select('*').order('sort_order'),
    supabase
      .from('course_chapters')
      .select('*, course_lessons(*)')
      .eq('course_id', params.id)
      .order('sort_order', { ascending: true })
      .order('sort_order', { referencedTable: 'course_lessons', ascending: true }),
  ])

  if (!course) notFound()

  return (
    <CourseEditor
      course={course}
      categories={categories ?? []}
      initialChapters={chapters ?? []}
    />
  )
}
