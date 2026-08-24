'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

export default function LoginForm() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }

    window.location.href = '/auth/redirect'
  }

  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Logo variant="dark" size="md" accentColor="#FF6900" />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase text-alabaster/50 font-sans">email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-white/5 border border-white/10 text-alabaster font-sans text-sm px-4 py-3 outline-none focus:border-orange placeholder:text-white/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase text-alabaster/50 font-sans">contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 text-alabaster font-sans text-sm px-4 py-3 outline-none focus:border-orange placeholder:text-white/20 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-orange font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 disabled:opacity-50"
          >
            {loading ? 'entrando...' : 'entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-alabaster/30 font-sans mt-8">
          ¿no tienes cuenta?{' '}
          <a href="/registro" className="text-orange hover:underline">
            regístrate gratis
          </a>
        </p>
      </div>
    </main>
  )
}
