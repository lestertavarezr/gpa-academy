import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GPA Academy OS',
  description: 'Sistema operativo central de GPA Academy — Operaciones, Ventas, Automatizaciones y más.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-os-bg text-os-text antialiased">
        {children}
      </body>
    </html>
  )
}
