import { NextResponse, type NextRequest } from 'next/server'

// Auth protection is handled in each layout (app/admin/layout.tsx, app/dashboard/layout.tsx)
// This middleware is intentionally minimal to avoid Edge Runtime issues
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
