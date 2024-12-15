'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Crown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { communityService } from '@/services/community'
import { mainService } from '@/services/main'
import { CommunityRoom } from '@/types/community'
import { MainPageResponse } from '@/types/main-page'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

type TabType = 'recent' | 'favorite' | 'my'

interface PageState {
  rooms: {
    recent: CommunityRoom[]
    favorite: CommunityRoom[]
    my: CommunityRoom[]
  }
  pages: Record<TabType, number>
  hasMore: Record<TabType, boolean>
  isLoading: boolean
  searchQuery: string
  showSearch: boolean
  activeTab: TabType
  mainPageData: MainPageResponse | null
  error: string | null
}

interface ErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function CommunityRoomCard({ room, isMain = false, onFavoriteToggle }: { 
  room: CommunityRoom; 
  isMain?: boolean;
  onFavoriteToggle?: (roomId: number, isFavorite: boolean) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    if (isLoading || !onFavoriteToggle) return;

    try {
      setIsLoading(true);
      await onFavoriteToggle(room.id, !room.isFavorite);
    } catch (error: unknown) {
      console.error('Failed to toggle favorite:', error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "즐겨찾기 처리 중 오류가 발생했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/board/${room.id}`}>
      <Card 
        className={`overflow-hidden transition-all duration-200 hover:shadow-lg
          ${isMain ? 'bg-white border-2 border-yellow-400' : 'bg-white/90'}`}
      >
        <CardHeader className="p-0">
          <div className="relative w-full h-32">
            <Image
              src={room.imgUrl || "/placeholder.svg"}
              alt={room.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{room.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            만든이: {room.author}
          </p>
          <div 
            className="flex items-center gap-1 mt-2 text-[#b38c84]"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-200 cursor-pointer
                ${isLoading ? 'opacity-50' : ''}
                ${room.isFavorite ? 'fill-current' : ''}`}
            />
            <span>{room.favoriteCount}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const initialState: PageState = {
    rooms: {
      recent: [],
      favorite: [],
      my: []
    },
    pages: { recent: 0, favorite: 0, my: 0 },
    hasMore: { recent: true, favorite: true, my: true },
    isLoading: true,
    searchQuery: '',
    showSearch: true,
    activeTab: 'recent',
    mainPageData: null,
    error: null
  }

  const [state, setState] = useState<PageState>(initialState)
  const { ref: infiniteRef, inView } = useInView()
  const lastScrollTop = useRef(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleError = useCallback((error: ErrorResponse, message: string) => {
    try {
      let errorMessage = message
      const statusCode = error?.response?.status || 500

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }

      console.error(`Error: ${message}${statusCode ? ` (${statusCode})` : ''}`)

      setState(prev => ({ ...prev, error: errorMessage }))
      
      toast({
        variant: "destructive",
        title: "오류",
        description: errorMessage
      })
    } catch (e) {
      console.error('Error handler failed:', e)
      toast({
        variant: "destructive",
        title: "오류",
        description: "알 수 없는 오류가 발생했습니다."
      })
    }
  }, [toast])

  const loadData = useCallback(async (
    type: TabType,
    page: number,
    userId: number
  ) => {
    const loaderMap = {
      recent: communityService.getRecentRooms,
      favorite: communityService.getFavoriteRooms,
      my: communityService.getMyRooms
    }

    try {
      const data = await loaderMap[type](userId, page, state.searchQuery)
      return data || { content: [] }
    } catch (error: unknown) {
      const err = error as ErrorResponse
      handleError(err, `${type} 데이터 로드 실패`)
      return { content: [] }
    }
  }, [handleError, state.searchQuery])

  const handleLoadMore = useCallback(async () => {
    const userId = localStorage.getItem('id')
    if (!userId || !state.hasMore[state.activeTab]) return

    try {
      const data = await loadData(
        state.activeTab,
        state.pages[state.activeTab],
        parseInt(userId)
      )

      const newContent = data?.content || []
      
      setState(prev => ({
        ...prev,
        rooms: {
          ...prev.rooms,
          [state.activeTab]: [...prev.rooms[state.activeTab], ...newContent]
        },
        pages: {
          ...prev.pages,
          [state.activeTab]: prev.pages[state.activeTab] + 1
        },
        hasMore: {
          ...prev.hasMore,
          [state.activeTab]: newContent.length === 3
        }
      }))
    } catch (error: unknown) {
      handleError(error as ErrorResponse, '추가 데이터 로드 실패')
    }
  }, [state.activeTab, state.pages, state.hasMore, loadData, handleError])

  const handleTabChange = useCallback(async (value: TabType) => {
    setState(prev => ({ ...prev, activeTab: value, isLoading: true }))
    const userId = localStorage.getItem('id')
    if (!userId) return

    try {
      if (state.rooms[value].length === 0) {
        const data = await loadData(value, 0, parseInt(userId))
        if (data) {
          setState(prev => ({
            ...prev,
            rooms: {
              ...prev.rooms,
              [value]: data.content || []
            },
            hasMore: {
              ...prev.hasMore,
              [value]: (data.content?.length || 0) === 3
            },
            isLoading: false
          }))
        }
      }
    } catch (error: unknown) {
      handleError(error as ErrorResponse, '탭 데이터 로드 실패')
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.rooms, loadData, handleError])

  const handleFavoriteToggle = useCallback(async (roomId: number, isFavorite: boolean) => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "로그인이 필요합니다."
      });
      router.push('/');
      return;
    }

    try {
      const success = isFavorite
        ? await communityService.addFavorite(parseInt(userId), roomId)
        : await communityService.removeFavorite(parseInt(userId), roomId);

      if (success) {
        // 상태 업데이트
        setState(prev => ({
          ...prev,
          rooms: {
            ...prev.rooms,
            [prev.activeTab]: prev.rooms[prev.activeTab].map(room =>
              room.id === roomId
                ? {
                    ...room,
                    isFavorite,
                    favoriteCount: room.favoriteCount + (isFavorite ? 1 : -1)
                  }
                : room
            )
          }
        }));

        // 메인 페이지 데이터도 업데이트
        if (state.mainPageData?.communityResponseDto?.id === roomId) {
          setState(prev => ({
            ...prev,
            mainPageData: prev.mainPageData ? {
              ...prev.mainPageData,
              communityResponseDto: {
                ...prev.mainPageData.communityResponseDto,
                isFavorite,
                favoriteCount: prev.mainPageData.communityResponseDto.favoriteCount + (isFavorite ? 1 : -1)
              }
            } : null
          }));
        }

        toast({
          title: "성공",
          description: `즐겨찾기${isFavorite ? '에 추가' : '가 해제'}되었습니다.`
        });
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse
      const errorMessage = err?.response?.data?.message || '즐겨찾기 처리 중 오류가 발생했습니다.';
      toast({
        variant: "destructive",
        title: "오류",
        description: errorMessage
      });
    }
  }, [state.mainPageData, toast, router]);

  useEffect(() => {
    const fetchInitialData = async () => {
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

      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const [mainData, recentData] = await Promise.all([
          mainService.getMainPageData(parseInt(userId)).catch(() => null),
          loadData('recent', 0, parseInt(userId))
        ])

        setState(prev => ({
          ...prev,
          mainPageData: mainData,
          rooms: {
            ...prev.rooms,
            recent: recentData?.content || []
          },
          hasMore: {
            ...prev.hasMore,
            recent: (recentData?.content?.length || 0) === 3
          },
          isLoading: false
        }))
      } catch (error: unknown) {
        handleError(error as ErrorResponse, "초기 데이터 로드 실패")
      } finally {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchInitialData()
  }, [loadData, handleError, toast, router])

  useEffect(() => {
    if (inView && !state.isLoading) {
      handleLoadMore()
    }
  }, [inView, handleLoadMore, state.isLoading])

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop.current && st > 10) {
        setState(prev => ({ ...prev, showSearch: false }))
      } else {
        setState(prev => ({ ...prev, showSearch: true }))
      }
      lastScrollTop.current = st <= 0 ? 0 : st
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    
    setState(prev => ({ 
      ...prev, 
      searchQuery: newSearchQuery,
      isLoading: true,
      rooms: {
        recent: [],
        favorite: [],
        my: []
      },
      pages: { recent: 0, favorite: 0, my: 0 },
      hasMore: { recent: true, favorite: true, my: true }
    }));
    
    const userId = localStorage.getItem('id');
    if (userId) {
      try {
        const data = await loadData(state.activeTab, 0, parseInt(userId));
        setState(prev => ({
          ...prev,
          rooms: {
            ...prev.rooms,
            [state.activeTab]: data.content || []
          },
          isLoading: false
        }));
      } catch (error) {
        handleError(error as ErrorResponse, '검색 데이터 로드 실패');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [state.activeTab, loadData, handleError]);

  const getUniqueRooms = useCallback((rooms: CommunityRoom[]) => {
    return Array.from(new Map(rooms.map(room => [room.id, room])).values());
  }, []);

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#f3d7d0] p-4 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-red-500">{state.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3d7d0] p-4 pb-20">
      <div 
        ref={searchRef}
        className={`sticky top-0 z-10 pt-4 pb-2 transition-all duration-300 
          ${state.showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
      >
        <Input
          type="search"
          placeholder="커뮤니티룸 검색..."
          value={state.searchQuery}
          onChange={handleSearchChange}
          className="bg-white/90 backdrop-blur max-w-md mx-auto"
        />
      </div>

      <Tabs 
        defaultValue="recent" 
        className="mt-4 max-w-md mx-auto" 
        onValueChange={(value) => handleTabChange(value as TabType)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-white/50">
          <TabsTrigger value="recent">최신</TabsTrigger>
          <TabsTrigger value="favorite">즐겨찾기</TabsTrigger>
          <TabsTrigger value="my">내 룸</TabsTrigger>
        </TabsList>

        {(['recent', 'favorite', 'my'] as const).map((tab) => (
          <TabsContent key={`tab-${tab}`} value={tab}>
            <div className="grid gap-4">
              {tab === 'recent' && state.mainPageData?.communityResponseDto && (
                <div key={`main-${state.mainPageData.communityResponseDto.id}`} className="relative">
                  <CommunityRoomCard 
                    room={state.mainPageData.communityResponseDto} 
                    isMain={true}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">메인</span>
                  </div>
                </div>
              )}
              {state.isLoading ? (
                <div className="text-center py-4">로딩 중...</div>
              ) : (
                getUniqueRooms(state.rooms[tab])
                  .filter(room => 
                    !(tab === 'recent' && room.id === state.mainPageData?.communityResponseDto?.id)
                  )
                  .map((room) => (
                    <CommunityRoomCard 
                      key={`${tab}-${room.id}`}
                      room={room}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))
              )}
              {state.hasMore[tab] && <div ref={infiniteRef} className="h-10" />}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}