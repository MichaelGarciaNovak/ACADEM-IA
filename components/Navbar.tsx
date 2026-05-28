'use client'

import { useState } from 'react'
import Logo from './Logo'

const links = [
  { href: '#cursos', label: 'cursos' },
  { href: '#como-funciona', label: 'cómo funciona' },
  { href: '#precios', label: 'precios' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-ink/10 bg-white/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo variant="light" size="sm" />

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase font-normal text-ink/50 hover:text-ink transition-colors font-mono"
            >
              {l.label}
            </a>
          ))}
          <a href="/login" className="text-sm uppercase font-normal text-ink/50 hover:text-ink transition-colors font-mono">
            entrar
          </a>
          <a href="/registro" className="btn-primary text-sm py-2 px-4">
            empezar gratis
          </a>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className="font-mono text-xl">{open ? '×' : '≡'}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-ink/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase font-normal text-ink/50 hover:text-ink font-mono"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <hr className="border-ink/10" />
          <a href="/login" className="text-sm uppercase font-normal text-ink/50 hover:text-ink font-mono" onClick={() => setOpen(false)}>
            entrar
          </a>
          <a href="/registro" className="btn-primary text-sm text-center">
            empezar gratis
          </a>
        </div>
      )}
    </header>
  )
}
