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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,600&family=Fragment+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-os-bg text-os-text antialiased">
        {children}
      </body>
    </html>
  )
}
