import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'academ/ia — aprende diferente',
  description: 'Plataforma educativa para quienes aprenden en serio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
