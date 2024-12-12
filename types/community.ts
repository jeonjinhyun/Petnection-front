
export interface CommunityRoom {
  id: number
  name: string
  createdAt: string
  author: string
  imgUrl: string
  favoriteCount: number
  isFavorite: boolean
  objectDtos: {
    id: number
    size: string
    gridPosition: string
    rotate: string
  }[]
}

export interface Post {
  id: number
  title: string
  content: string
  imgUrl: string
  authorName: string
  createdAt: string | number[];  // 두 가지 타입 모두 허용
}

export interface Comment {
  id: number
  userProfileResponseDto: {
    name: string
    imgUrl: string
  }
  content: string
}

export interface GoodsItem {
  id: number
  originalImageUrl: string
  generatedImageUrl: string
} 