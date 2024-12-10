'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Album, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  
  if (pathname === '/') return null

  return (
    <div className="w-[200px] bg-white border-r h-screen p-4 flex flex-col gap-2">
      <div className="text-xl font-bold text-[#b38c84] mb-6">Petnection</div>
      
      <Link 
        href="/home"
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg hover:bg-[#f3d7d0] transition-colors",
          pathname === '/home' && "bg-[#f3d7d0]"
        )}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      <Link 
        href="/album"
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg hover:bg-[#f3d7d0] transition-colors",
          pathname === '/album' && "bg-[#f3d7d0]"
        )}
      >
        <Album className="w-4 h-4" />
        <span>Memory Album</span>
      </Link>

      <Link 
        href="/board"
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg hover:bg-[#f3d7d0] transition-colors",
          pathname === '/board' && "bg-[#f3d7d0]"
        )}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Board</span>
      </Link>
    </div>
  )
}

