import type { Metadata } from 'next'
import { Syne, DM_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400','600','700','800'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300','400','500'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400','500','600'],
})

export const metadata: Metadata = {
  title: 'FranchiseIQ — Intelligent Operations Platform',
  description: 'AI-powered franchise intelligence for 300+ restaurant locations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${instrumentSans.variable}`}>
      <body className="font-sans bg-bg text-white antialiased">
        {children}
      </body>
    </html>
  )
}
