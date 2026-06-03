import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import config from '@/lib/config'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: `${config.nome} Fidelidade`,
  description: `Programa de fidelidade — ${config.nome}. ${config.tagline}`,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: config.nome,
  },
}

export const viewport: Viewport = {
  themeColor: config.corPrimaria,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <style>{`
          :root {
            --cor-primaria: ${config.corPrimaria};
            --cor-secundaria: ${config.corSecundaria};
            --cor-texto: ${config.corTexto};
          }
        `}</style>
      </head>
      <body className="font-body bg-brand-dark min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')`,
          }}
        />
      </body>
    </html>
  )
}
