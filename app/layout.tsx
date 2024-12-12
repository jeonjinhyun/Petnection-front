import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ResponsiveLayout from '@/components/responsive-layout'
import { PawPrintBackground } from '@/components/paw-print-background'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Petnection',
  description: 'Connect with pet lovers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PawPrintBackground />
        <ResponsiveLayout>{children}</ResponsiveLayout>
        <Toaster />
      </body>
    </html>
  )
}

