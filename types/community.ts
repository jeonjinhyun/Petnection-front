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
  authorName: string
  imgUrl: string
  createdAt: string | number[]
}

export interface Comment {
  id: number
  content: string
  userProfileResponseDto: {
    name: string
    imgUrl?: string
  }
}

export interface CreateCommentRequest {
  author: number
  content: string
  postId: number
}

export interface GoodsItem {
  id: number
  originalImageUrl: string
  generatedImageUrl: string
} 