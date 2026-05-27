import { createClient } from '@/lib/supabase/server'
import ContenidoClient from './ContenidoClient'

export default async function AdminContenidoPage() {
  const supabase = createClient()
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ContenidoClient initialSections={sections ?? []} />
}
