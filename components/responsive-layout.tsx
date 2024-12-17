'use client'

import { Home, Album, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { MainPageResponse } from '@/types/main-page'
import { mainService } from '@/services/main'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

export default function ResponsiveLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const [mainPageData, setMainPageData] = useState<MainPageResponse | null>(null)

  const navItems = [
    { icon: Home, label: '홈', href: '/home' },
    { icon: Album, label: '앨범', href: '/album' },
    { icon: ShoppingBag, label: '굿즈', href: '/goods' },
    // { icon: Download, label: '다운로드', href: '/download', mobileHidden: true }
    // { icon: Mail, label: '메시지', href: '/messages' },
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      if (pathname === '/') return

      const userId = localStorage.getItem('id')
      
      if (!userId) {
        toast({
          variant: "destructive",
          title: "오류",
          description: "로그인이 필요합니다.",
        })
        router.push('/')
        return
      }

      try {
        const data = await mainService.getMainPageData(parseInt(userId))
        setMainPageData(data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast({
          variant: "destructive",
          title: "프로필 로드 실패",
          description: "클라이언트에서 계정생성을 완료해주세요.",
        })
        router.push('/')
      }
    }

    fetchUserData()
  }, [pathname, toast, router])

  if (pathname === '/') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#f3d7d0] overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white fixed h-screen overflow-y-auto z-10">
        {/* Logo Section */}
        <div className="p-6 pb-2 border-b">
          <Link href="/" className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#b38c84]">Petnection</h1>
            <div className="relative w-20 h-5 mt-1">
              <Image
                src="/logo.png" 
                alt="Petnection" 
                width={80}
                height={20}
                className="filter brightness-0 invert-[.30] sepia-[.20] saturate-[2.5] hue-rotate-[340deg]"
              />
            </div>
          </Link>
        </div>
            
        {/* Navigation Links */}
        <div className="flex-1 p-4 pt-2 space-y-2">
          {navItems.map((item) => (
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
        </div>

        {/* User Profile Section */}
        {mainPageData && (
          <div className="border-t bg-white p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-16 w-16 border">
                <AvatarImage 
                  src={mainPageData.userProfileResponseDto.imgUrl || "/user-placeholder.png"} 
                  alt={mainPageData.userProfileResponseDto.name} 
                />
                <AvatarFallback>{mainPageData.userProfileResponseDto.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-between h-16">
                <p className="text-sm font-medium">{mainPageData.userProfileResponseDto.name}</p>
                <div className="flex items-center gap-2 mt-1 p-1">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage 
                      src={mainPageData.petImg || "/pet-placeholder.png"} 
                      alt={mainPageData.petDTO.name} 
                    />
                    <AvatarFallback>{mainPageData.petDTO.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">{mainPageData.petDTO.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 md:p-8 overflow-y-auto h-screen">
        {children}
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around z-10">
          {navItems.map((item) => (
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