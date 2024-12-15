'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { PawPrintBackground } from '@/components/paw-print-background'
import Image from 'next/image'
import { galleryService } from '@/services/gallery'
import { GalleryImage } from '@/types/gallery'

export default function AlbumPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('id')
    if (id) {
      setUserId(Number(id))
    }
  }, [])

  useEffect(() => {
    const fetchGallery = async () => {
      if (!userId) return
      
      try {
        const gallery = await galleryService.getGallery(userId)
        setImages(gallery.galleryImageResponseDtos)
      } catch (error) {
        console.error('갤러리 로드 실패:', error)
      }
    }

    fetchGallery()
  }, [userId])

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 pb-20">
      <PawPrintBackground />
      <div className="max-w-md mx-auto space-y-6">
        {images.length === 0 ? (
          <div className="bg-white/90 p-8 rounded-lg text-center">
            <p className="text-gray-600">아직 등록된 사진이 없습니다.</p>
          </div>
        ) : (
          images.map((image) => (
            <Card key={image.id} className="bg-white/90 p-4 space-y-4">
              <p 
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: image.aiAnalysis }}
              />
              <div className="aspect-square relative">
                <Image
                  src={image.imgUrl}
                  alt={`Memory ${image.id}`}
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

