'use client'

import { useState } from 'react'
// import { useParams } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PawPrintBackground } from '@/components/paw-print-background'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Post {
  id: number
  title: string
  content: string
  author: string
  image: string
  date: string
  comments: Comment[]
}

interface Comment {
  id: number
  content: string
  author: string
  date: string
  userImage: string
}

const STICKY_NOTE_COLORS = [
  'bg-pink-100',
  'bg-yellow-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
]

export default function BoardPage() {
  // id를 사용하지 않을 경우 _id로 표시하여 eslint 경고 제거
  // const { id: _id } = useParams()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "우리 댕댕이를 위해",
      content: "귀여운 우리 강아지와 함께한 즐거운 산책\n\n오늘도 즐거운 하루였어요!",
      author: "펫러버",
      image: "/placeholder.svg",
      date: "2024.11.10",
      comments: [
        {
          id: 1,
          content: "너무 귀여워요! 다음에 같이 산책해요~",
          author: "댓글러1",
          date: "2024.11.10 14:30",
          userImage: "/placeholder.svg"
        },
        {
          id: 2,
          content: "우리 강아지도 저기서 산책하는걸 좋아해요!",
          author: "댓글러2",
          date: "2024.11.10 15:45",
          userImage: "/placeholder.svg"
        }
      ]
    }
  ])

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4">
      <PawPrintBackground />
      <div className="max-w-md mx-auto space-y-4 relative">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="bg-white/90 p-6 space-y-4"
          >
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>{post.author}</p>
              <p>{post.date}</p>
            </div>

            <div className="relative aspect-square mb-4">
              <Image
                src={post.image}
                alt="게시글 이미지"
                width={800}
                height={500}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="space-y-2 text-center">
              <div className="whitespace-pre-line">
                {post.content}
              </div>
            </div>

            <div className="pt-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {post.comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className={`${STICKY_NOTE_COLORS[index % STICKY_NOTE_COLORS.length]} p-4 rounded-lg shadow-md min-w-[120px] max-w-[120px] h-[120px] cursor-pointer transform hover:-translate-y-1 transition-transform`}
                      onClick={() => setSelectedComment(comment)}
                    >
                      <div className="flex items-center">
                        <Image
                          src={comment.userImage}
                          alt="프로필 이미지"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <p className="text-center font-medium">{comment.author}</p>
                      </div>
                    </div>
                  ))}
                  {post.comments.length < 5 && (
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="min-w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6 text-gray-400" />
                    </button>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
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
        <DialogContent className="bg-[#f9f3f0] border-none p-0 sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">새 게시글 작성</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between bg-[#b38c84] p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">Petnection</h2>
            <button 
              onClick={() => setIsCreateOpen(false)}
              className="text-white hover:opacity-80"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 aspect-square relative">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label 
                className="block w-full text-center py-2 px-4 bg-[#b38c84] text-white rounded-lg cursor-pointer hover:bg-[#96756e] transition-colors"
              >
                내 PC에서 사진 불러오기
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setPreviewImage(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <input
                  type="text"
                  placeholder="제목을 입력하세요..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <textarea
                  placeholder="내용을 입력하세요..."
                  rows={4}
                  className="w-full bg-transparent outline-none resize-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-[#b38c84] hover:bg-[#96756e] text-white rounded-lg py-3"
              onClick={() => {
                // Handle post creation
                setIsCreateOpen(false)
              }}
            >
              완료
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
        <DialogContent className="bg-[#f3d7d0] border-none max-w-xs">
          <DialogHeader>
            <DialogTitle className="sr-only">댓글 보기</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <p className="font-medium text-lg">{selectedComment.author}</p>
              <p className="text-sm">{selectedComment.content}</p>
              <p className="text-xs text-gray-500">{selectedComment.date}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-[#f3d7d0] border-none max-w-xs">
          <DialogHeader>
            <DialogTitle>댓글 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <Button className="w-full bg-[#b38c84] hover:bg-[#96756e]">
              작성하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}