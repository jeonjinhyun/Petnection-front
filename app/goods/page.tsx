'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { PawPrintBackground } from '@/components/paw-print-background'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface GoodsItem {
  id: number
  frontImage: string
  backImage: string
  description: string
}

const dummyGoods: GoodsItem[] = Array(5).fill(null).map((_, i) => ({
  id: i + 1,
  frontImage: "/placeholder.svg",
  backImage: "/placeholder.svg",
  description: `AI가 생성한 굿즈 이미지 ${i + 1}. 귀여운 반려동물 디자인.`
}))

export default function GoodsPage() {
  const [goods] = useState<GoodsItem[]>(dummyGoods)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % goods.length)
    setFlipped(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + goods.length) % goods.length)
    setFlipped(false)
  }

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 flex flex-col justify-center items-center">
      <PawPrintBackground />
      <div className="w-full max-w-sm relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="bg-white/90 aspect-[3/4] cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {flipped ? (
                    <div
                      key="back"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `rotateY(${flipped ? 0 : -180}deg)`,
                        transition: 'transform 0.3s',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <Image
                        src={goods[currentIndex].backImage}
                        alt={`AI Generated ${goods[currentIndex].id}`}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                        <p className="text-sm">{goods[currentIndex].description}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      key="front"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `rotateY(${!flipped ? 0 : 180}deg)`,
                        transition: 'transform 0.3s',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <Image
                        src={goods[currentIndex].frontImage}
                        alt={`Goods ${goods[currentIndex].id}`}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </AnimatePresence>
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

