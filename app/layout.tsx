import type { Metadata, Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'

import './globals.css'
import { LanguageProvider } from '@/components/language-provider'

const _cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Champion Roulette - League of Legends Randomizer',
  description: 'Random champion selector and special effect randomizer for League of Legends',
}

export const viewport: Viewport = {
  themeColor: '#0f1420',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`${_cinzel.variable} ${_inter.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
