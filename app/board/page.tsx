'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

interface Post {
  id: number
  title: string
  content: string
  author: string
  image: string
  date: string
  likes: number
  comments: Comment[]
}

interface Comment {
  id: number
  content: string
  author: string
  date: string
}

export default function BoardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')

  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "오늘의 산책",
      content: "강아지와 함께한 즐거운 산책",
      author: "펫러버",
      image: "/placeholder.svg",
      date: "2023-12-05",
      likes: 5,
      comments: [
        {
          id: 1,
          content: "너무 귀여워요!",
          author: "댓글러",
          date: "2023-12-05 14:30"
        }
      ]
    }
  ])

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4">
      <div className="max-w-md mx-auto space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white/90" onClick={() => setSelectedPost(post)}>
            <CardHeader className="p-0">
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{post.title}</h3>
                <span className="text-sm text-muted-foreground">{post.author}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments.length}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 bg-[#b38c84] hover:bg-[#96756e]"
        onClick={() => setIsCreateOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#f3d7d0] border-none">
          <DialogHeader>
            <DialogTitle>새 게시글 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">사진</Label>
              <Input id="picture" type="file" accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="제목을 입력하세요" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="content">내용</Label>
              <Textarea id="content" placeholder="내용을 입력하세요" />
            </div>
            <Button className="w-full bg-[#b38c84] hover:bg-[#96756e]">
              작성하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-[#f3d7d0] border-none max-w-md">
          {selectedPost && (
            <div className="space-y-4">
              <Image
                src={selectedPost.image}
                alt={selectedPost.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedPost.content}</p>
              </div>
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-yellow-100 p-4 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform cursor-pointer"
                  >
                    <p className="text-sm">{comment.content}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>{comment.author}</span>
                      <span className="mx-2">•</span>
                      <span>{comment.date}</span>
                    </div>
                  </div>
                ))}
                {selectedPost.comments.length < 5 && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="댓글을 입력하세요"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button className="w-full bg-[#b38c84] hover:bg-[#96756e]">
                      댓글 작성
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

