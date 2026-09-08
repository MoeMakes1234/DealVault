import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'DealVault - Real Estate Developer Platform',
  description: 'Professional project management, budgeting, and tracking for real estate developers and house flippers.',
  keywords: 'real estate, developer, flipper, project management, budgeting, construction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
