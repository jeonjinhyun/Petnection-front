'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your login logic here
    router.push('/home')
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
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#b38c84] hover:bg-[#96756e]"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

