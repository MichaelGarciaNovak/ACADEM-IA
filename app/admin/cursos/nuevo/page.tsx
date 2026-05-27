import { createClient } from '@/lib/supabase/server'
import NuevoCursoForm from './NuevoCursoForm'

export default async function NuevoCursoPage() {
  const supabase = createClient()
  const { data: cats } = await supabase.from('course_categories').select('*').order('sort_order')
  return <NuevoCursoForm categories={cats ?? []} />
}
