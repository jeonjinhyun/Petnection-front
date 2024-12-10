'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { PawPrintBackground } from '@/components/paw-print-background'
import Image from 'next/image'

interface MemoryPost {
  id: number
  image: string
  aiDescription: string
}

const dummyPosts: MemoryPost[] = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  image: "/placeholder.svg",
  aiDescription: `AI가 분석한 결과, 이 사진에는 행복한 순간이 담겨있습니다. 사진 ${i + 1}번째 추억.`
}))

export default function AlbumPage() {
  const [posts] = useState<MemoryPost[]>(dummyPosts)

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 pb-20">
      <PawPrintBackground />
      <div className="max-w-md mx-auto space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white/90 p-4 space-y-4">
            <p className="text-sm text-gray-600">{post.aiDescription}</p>
            <div className="aspect-square relative">
              <Image
                src={post.image}
                alt={`Memory ${post.id}`}
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

