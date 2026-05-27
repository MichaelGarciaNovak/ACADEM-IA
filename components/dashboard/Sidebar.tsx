'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

const links = [
  { href: '/dashboard', label: 'mis cursos', icon: '▦' },
  { href: '/dashboard/cursos', label: 'catálogo', icon: '◈' },
  { href: '/dashboard/perfil', label: 'perfil', icon: '◯' },
]

export default function DashboardSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-ink flex flex-col border-r border-white/10">
      <div className="px-6 py-5 border-b border-white/10">
        <Logo variant="dark" size="sm" accentColor="#ef476f" />
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href
          return (
            <a
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm uppercase transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-alabaster/50 hover:text-alabaster hover:bg-white/5'
              }`}
            >
              <span className="text-pink text-xs">{l.icon}</span>
              {l.label}
            </a>
          )
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-xs text-alabaster/30 uppercase px-3 mb-3 truncate">{userName}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm uppercase text-alabaster/50 hover:text-pink transition-colors"
        >
          <span className="text-xs">→</span>
          salir
        </button>
      </div>
    </aside>
  )
}
