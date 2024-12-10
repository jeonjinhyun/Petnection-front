import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 pb-24 flex flex-col">
      <div className="max-w-4xl mx-auto space-y-8 w-full flex-grow flex flex-col justify-center">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>PC 권장 사양</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>운영체제: Windows 10 64비트 / macOS 10.15 이상</li>
              <li>프로세서: Intel Core i5 또는 AMD Ryzen 5 이상</li>
              <li>메모리: 8GB RAM 이상</li>
              <li>그래픽: NVIDIA GeForce GTX 1060 또는 AMD Radeon RX 570 이상</li>
              <li>저장공간: 10GB 이상의 여유 공간</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>프로젝트 소개</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Petnection은 반려동물 애호가들을 위한 혁신적인 소셜 플랫폼입니다. 
              우리의 목표는 반려동물과 함께하는 일상을 더욱 풍요롭게 만들고, 
              반려동물 커뮤니티를 강화하는 것입니다.
            </p>
            <Image
              src="/images/download.png"
              alt="다운로드 이미지"
              width={300}
              height={600}
              className="w-full max-w-sm"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>다운로드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              아래 버튼을 클릭하여 Petnection을 다운로드하세요. 
              최신 버전을 받으실 수 있습니다.
            </p>
            <Button className="w-full bg-[#b38c84] hover:bg-[#96756e]">
              Petnection 다운로드 (v1.0.0)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

