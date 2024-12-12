'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Album, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'

// 더미 데이터 추가
const dummyUser = {
  name: "김멍멍",
  image: "/user-placeholder.png"
}

const dummyPet = {
  name: "해피",
  image: "/pet-placeholder.png"
}

export function Sidebar() {
  const pathname = usePathname()
  
  if (pathname === '/') return null

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Petnection" width={32} height={32} />
            <span className="font-semibold">Petnection</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
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
        </nav>

        
        <div className="mt-auto border-t bg-white p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={dummyUser.image} alt={dummyUser.name} />
              <AvatarFallback>{dummyUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-between h-16">
              <p className="text-sm font-medium">{dummyUser.name}</p>
              <div className="flex items-center gap-2 mt-1 p-1">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={dummyPet.image} alt={dummyPet.name} />
                  <AvatarFallback>{dummyPet.name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-base text-muted-foreground">{dummyPet.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

