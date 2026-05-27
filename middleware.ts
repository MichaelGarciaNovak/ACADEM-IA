import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // Rutas protegidas — redirige a /login si no hay sesión
    if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    // Si falla el middleware no bloqueamos al usuario
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/admin/:path*'],
}
