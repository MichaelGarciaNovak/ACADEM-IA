import type { Metadata } from 'next'
import { nimbus, nimbusCond, plantin } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orange Academy',
  description: 'Plataforma educativa para quienes aprenden en serio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${nimbus.variable} ${nimbusCond.variable} ${plantin.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
