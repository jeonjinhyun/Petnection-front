'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X, ImageIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PawPrintBackground } from '@/components/paw-print-background'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image'
import { communityService } from '@/services/community'

interface Post {
  id: number
  title: string
  content: string
  authorName: string
  imgUrl: string
  createdAt: string
  comments: Comment[]
}

interface Comment {
  id: number
  content: string
  authorName: string
  createdAt: string
  userImage?: string
}

const STICKY_NOTE_COLORS = [
  'bg-pink-100',
  'bg-yellow-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
]

export default function BoardPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await communityService.getPosts(Number(id))
        setPosts(response.content)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        toast({
          variant: "destructive",
          title: "오류",
          description: "게시글을 불러오는데 실패했습니다."
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchPosts()
    }
  }, [id, toast])

  const handleCreatePost = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "이미지를 선택해주세요."
      })
      return
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "내용을 입력해주세요."
      })
      return
    }

    const userId = localStorage.getItem('id')
    if (!userId) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "로그인이 필요합니다."
      })
      router.push('/')
      return
    }

    try {
      const formData = new FormData()
      formData.append('imgFile', selectedFile)
      formData.append('content', content)
      formData.append('communityRoomId', String(id))
      formData.append('author', userId)

      await communityService.createPost(formData)
      
      // 성공 후 상태 초기화 및 게시글 새로고침
      setIsCreateOpen(false)
      setSelectedFile(null)
      setPreviewImage(null)
      setContent('')
      
      // 게시글 목록 새로고침
      const response = await communityService.getPosts(Number(id))
      setPosts(response.content)

      toast({
        title: "성공",
        description: "게시글이 작성되었습니다."
      })
    } catch (error) {
      console.error('Failed to create post:', error)
      toast({
        variant: "destructive",
        title: "오류",
        description: "게시글 작성에 실패했습니다."
      })
    }
  }

  const formatDate = (date: string | number[]) => {
    if (!date) return '-';
    
    try {
      if (Array.isArray(date)) {
        // 배열 형식일 경우 ([2024, 12, 12, 18, 49, 52, 568377000])
        const [year, month, day, hour, minute] = date;
        const dateObj = new Date(year, month - 1, day, hour, minute);
        
        return new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(dateObj);
      } else {
        // 문자열 형식일 경우
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          return '-';
        }
        
        return new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(dateObj);
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3d7d0] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4">
      <PawPrintBackground />
      <div className="max-w-md mx-auto space-y-4 relative">
        {posts.length === 0 ? (
          <Card className="bg-white/90 p-6 text-center">
            <div className="space-y-4">
              <p className="text-lg font-medium">아직 게시글이 없습니다.</p>
              <p className="text-gray-500">첫 번째 게시글을 작성해보세요!</p>
              <Button 
                className="bg-[#b38c84] hover:bg-[#96756e]"
                onClick={() => setIsCreateOpen(true)}
              >
                게시글 작성하기
              </Button>
            </div>
          </Card>
        ) : (
          posts.map((post) => (
            <Card 
              key={post.id} 
              className="bg-white/90 p-6 space-y-4"
            >
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>{post.authorName}</p>
                <p>{formatDate(post.createdAt)}</p>
              </div>
              <div className="relative aspect-square mb-4">
                <Image
                  src={post.imgUrl || "/placeholder.svg"}
                  alt="게시글 이미지"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 text-center">
              <div className="whitespace-pre-line text-xl font-bold mb-2">  {/* 스타일 수정 */}
                  {post.title}
                </div>
                <div className="whitespace-pre-line">
                  {post.content}
                </div>
              </div>

              <div className="pt-4">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-4 pb-4">
                    {post.comments?.map((comment, index) => (
                      <div
                        key={comment.id}
                        className={`${STICKY_NOTE_COLORS[index % STICKY_NOTE_COLORS.length]} p-4 rounded-lg shadow-md min-w-[120px] max-w-[120px] h-[120px] cursor-pointer transform hover:-translate-y-1 transition-transform`}
                        onClick={() => setSelectedComment(comment)}
                      >
                        <div className="flex items-center">
                          <Image
                            src={comment.userImage || "/placeholder.svg"}
                            alt="프로필 이미지"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <p className="text-center font-medium">{comment.authorName}</p>
                        </div>
                      </div>
                    ))}
                    {(!post.comments || post.comments.length < 5) && (
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
          ))
        )}
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
                      setSelectedFile(file)
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
                <textarea
                  placeholder="내용을 입력하세요..."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent outline-none resize-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-[#b38c84] hover:bg-[#96756e] text-white rounded-lg py-3"
              onClick={handleCreatePost}
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
              <p className="font-medium text-lg">{selectedComment.authorName}</p>
              <p className="text-sm">{selectedComment.content}</p>
              <p className="text-xs text-gray-500">{formatDate(selectedComment.createdAt)}</p>
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