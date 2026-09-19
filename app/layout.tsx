import type { Metadata } from 'next'
import '../styles/globals.css'
import Toaster from '@/components/Toaster'
import ConfirmDialog from '@/components/ConfirmDialog'

export const metadata: Metadata = {
  title: 'DealVault — Real Estate Developer & Flipper Platform',
  description:
    'Professional project management, budgeting, and profitability tracking for real estate developers and house flippers. Track every deal from acquisition to sale.',
  keywords: 'real estate, house flipping, developer, project management, budgeting, construction, deal tracking, rehab',
  authors: [{ name: 'DealVault' }],
  openGraph: {
    title: 'DealVault — Manage Your Real Estate Empire',
    description:
      'Track deals, budgets, contractors, and profitability in one place. Built for real estate developers and house flippers.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%232563eb'/%3E%3Cpath d='M50 24L26 44v32h16V58h16v18h16V44z' fill='white'/%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
  },
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
        <Toaster />
        <ConfirmDialog />
      </body>
    </html>
  )
}
