'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CommunityRoom {
  id: number
  name: string
  image: string
  creator: string
  likes: number
}

const dummyRooms: CommunityRoom[] = [
  {
    id: 1,
    name: "강아지 산책 모임",
    image: "/placeholder.svg",
    creator: "펫러버",
    likes: 150
  },
  {
    id: 2,
    name: "고양이 집사 모임",
    image: "/placeholder.svg",
    creator: "냥집사",
    likes: 120
  },
  {
    id: 3,
    name: "반려동물 사진 공유",
    image: "/placeholder.svg",
    creator: "동물사진사",
    likes: 200
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [rooms] = useState<CommunityRoom[]>(dummyRooms)
  const [showSearch, setShowSearch] = useState(true)
  const lastScrollTop = useRef(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop.current) {
        // 아래로 스크롤
        setShowSearch(false)
      } else if (st < lastScrollTop.current - 5) {
        // 위로 스크롤 (5px 이상)
        setShowSearch(true)
      }
      lastScrollTop.current = st <= 0 ? 0 : st
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 pb-20">
      <div 
        ref={searchRef}
        className={`sticky top-0 z-10 bg-[#f3d7d0] pt-4 pb-2 transition-all duration-300 ${
          showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <Input
          type="search"
          placeholder="커뮤니티룸 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="w-full bg-white/50">
            <TabsTrigger value="latest" className="flex-1" onClick={scrollToTop}>최신</TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">인기</TabsTrigger>
            <TabsTrigger value="my" className="flex-1">내 룸</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-6">
            <div className="grid gap-4">
              {filteredRooms.map((room) => (
                <Link href={`/board/${room.id}`} key={room.id}>
                  <Card className="overflow-hidden bg-white/90">
                    <CardHeader className="p-0">
                      <Image
                        src={room.image}
                        alt={room.name}
                        className="w-full h-32 object-cover"
                        width={500}
                        height={300}
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        만든이: {room.creator}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-[#b38c84]">
                        <Heart className="w-4 h-4" />
                        <span>{room.likes}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            {/* 인기 룸 목록 (위와 유사한 구조) */}
          </TabsContent>

          <TabsContent value="my">
            {/* 내 룸 목록 (위와 유사한 구조) */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

