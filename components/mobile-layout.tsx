'use client'

import { Home, Album, ShoppingBag, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function MobileLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  if (pathname === '/') return <>{children}</>

  return (
    <div className="min-h-screen pb-16 bg-[#f3d7d0]">
      {children}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around">
        <Link 
          href="/home"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === '/home' && "text-[#b38c84]"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">홈</span>
        </Link>
        <Link 
          href="/album"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === '/album' && "text-[#b38c84]"
          )}
        >
          <Album className="w-5 h-5" />
          <span className="text-xs">앨범</span>
        </Link>
        <Link 
          href="/goods"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === '/goods' && "text-[#b38c84]"
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs">굿즈</span>
        </Link>
        <Link 
          href="/messages"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === '/messages' && "text-[#b38c84]"
          )}
        >
          <Mail className="w-5 h-5" />
          <span className="text-xs">메시지</span>
        </Link>
      </nav>
    </div>
  )
}

