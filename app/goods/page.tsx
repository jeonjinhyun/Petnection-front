'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { PawPrintBackground } from '@/components/paw-print-background'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { goodsService } from '@/services/goods'
import { GoodsItem } from '@/types/goods'

export default function GoodsPage() {
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const userId = Number(localStorage.getItem('id'))
        const response = await goodsService.getGoods(userId, currentPage)
        setGoods(response.content)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error('굿즈 로드 실패:', error)
      }
    }

    fetchGoods()
  }, [currentPage])

  const nextSlide = () => {
    if (currentIndex === goods.length - 1) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
        setCurrentIndex(0)
      } else {
        setCurrentIndex(0)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
    }
    setFlipped(false)
  }

  const prevSlide = () => {
    if (currentIndex === 0) {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1)
        setCurrentIndex(goods.length - 1)
      } else {
        setCurrentIndex(goods.length - 1)
      }
    } else {
      setCurrentIndex(prev => prev - 1)
    }
    setFlipped(false)
  }

  if (goods.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3d7d0] flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-lg text-center">
          <p className="text-gray-600">생성된 굿즈가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 flex flex-col justify-center items-center">
      <PawPrintBackground />
      <div className="w-full max-w-sm relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="bg-white/90 aspect-[3/4] cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="relative w-full h-full flex flex-col">
                <div className="relative flex-1">
                  <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: flipped ? 1 : 0 }}
                  >
                    <Image
                      src={goods[currentIndex].generatedImageUrl}
                      alt={`Generated ${goods[currentIndex].id}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: flipped ? 0 : 1 }}
                  >
                    <Image
                      src={goods[currentIndex].originalImageUrl}
                      alt={`Original ${goods[currentIndex].id}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                </div>
                <div className="p-4 text-center text-gray-600">
                  {flipped ? "클릭하여 원본 이미지 보기" : "클릭하여 생성된 이미지 보기"}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

