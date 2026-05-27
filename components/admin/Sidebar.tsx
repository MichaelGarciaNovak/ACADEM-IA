'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

const links = [
  { href: '/admin', label: 'métricas', icon: '◈' },
  { href: '/admin/usuarios', label: 'usuarios', icon: '◯' },
  { href: '/admin/cursos', label: 'cursos', icon: '▦' },
  { href: '/admin/pagos', label: 'pagos', icon: '◇' },
  { href: '/admin/contenido', label: 'contenido', icon: '▤' },
]

export default function AdminSidebar({ userName }: { userName: string }) {
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
        <Logo variant="dark" size="sm" accentColor="#735cdd" />
        <span className="text-xs text-slate/70 uppercase mt-1 block">admin</span>
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
              <span className="text-slate text-xs">{l.icon}</span>
              {l.label}
            </a>
          )
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-xs text-alabaster/30 uppercase px-3 mb-3 truncate">{userName}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm uppercase text-alabaster/50 hover:text-slate transition-colors"
        >
          <span className="text-xs">→</span>
          salir
        </button>
      </div>
    </aside>
  )
}
