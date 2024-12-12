'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from '@/services/auth'
import { mainService } from '@/services/main'
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 로그인 요청
      const loginResponse = await authService.login(email)
      
      if (!loginResponse || !loginResponse.id) {
        throw new Error('Invalid login response')
      }

      localStorage.setItem('id', loginResponse.id.toString())

      try {
        // 메인 페이지 데이터 가져오기
        const mainPageData = await mainService.getMainPageData(loginResponse.id)
        
        // 홈 페이지로 이동
        router.push('/home')

        toast({
          title: "로그인 성공",
          description: `환영합니다, ${mainPageData.userProfileResponseDto.name || '사용자'}님!`,
        })
      } catch (mainError) {
        console.error('Failed to fetch main page data:', mainError)
        // 메인 페이지 데이터 실패해도 홈으로는 이동
        router.push('/home')
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        })
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: error instanceof Error 
          ? error.message 
          : "로그인 중 오류가 발생했습니다.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3d7d0]">
      <div className="w-full max-w-md p-6">
        <Card className="border-none shadow-lg bg-white/90">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-[#b38c84]">
              Petnection
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              이메일로 로그인 해주세요.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#b38c84] focus:ring-[#b38c84]"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#b38c84] hover:bg-[#96756e]"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

