import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-white flex font-mono">
      <DashboardSidebar userName={profile?.full_name ?? user.email ?? ''} />
      <main className="flex-1 md:ml-64 p-4 md:p-10">
        {children}
      </main>
    </div>
  )
}
