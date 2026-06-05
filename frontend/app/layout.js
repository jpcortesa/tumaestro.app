import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'tumaestro.app — Encuentra al profesional ideal para tu hogar',
  description: 'Contratistas verificados con reseñas reales en Chile',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}