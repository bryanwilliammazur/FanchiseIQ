import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FranchiseIQ — Intelligent Operations Platform',
  description: 'AI-powered franchise intelligence for 300+ restaurant locations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#080c14' }}>
        {children}
      </body>
    </html>
  )
}
