import { createClient } from '@/lib/supabase/server'
import ContenidoClient from './ContenidoClient'

export default async function AdminContenidoPage() {
  const supabase = createClient()

  const [{ data: sections }, { data: courses }] = await Promise.all([
    supabase.from('sections').select('*').order('sort_order', { ascending: true }),
    supabase.from('courses').select('id, title').order('title', { ascending: true }),
  ])

  return (
    <ContenidoClient
      initialSections={sections ?? []}
      courses={courses ?? []}
    />
  )
}
