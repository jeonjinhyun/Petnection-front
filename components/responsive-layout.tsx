'use client'

import { Home, Album, ShoppingBag, Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ResponsiveLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  if (pathname === '/') return <>{children}</>

  const desktopNavItems = [
    { icon: Home, label: '홈', href: '/home' },
    { icon: Album, label: '앨범', href: '/album' },
    { icon: ShoppingBag, label: '굿즈', href: '/goods' },
    { icon: Download, label: '다운로드', href: '/download' },
    { icon: Mail, label: '메시지', href: '/messages' },
  ]

  const mobileNavItems = [
    { icon: Home, label: '홈', href: '/home' },
    { icon: Album, label: '앨범', href: '/album' },
    { icon: ShoppingBag, label: '굿즈', href: '/goods' },
    { icon: Mail, label: '메시지', href: '/messages' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f3d7d0] overflow-hidden">
      {/* Sidebar for web view */}
      <nav className="hidden md:flex flex-col w-64 bg-white p-4 space-y-4 fixed h-screen overflow-y-auto z-10">
        <h1 className="text-2xl font-bold text-[#b38c84] mb-6">Petnection</h1>
        {desktopNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 p-2 rounded-lg hover:bg-[#f3d7d0] transition-colors",
              pathname === item.href && "bg-[#f3d7d0] text-[#b38c84]"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 md:p-8 overflow-y-auto h-screen">
        {children}
      </main>

      {/* Bottom navigation for mobile view */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around z-10">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1",
              pathname === item.href && "text-[#b38c84]"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

