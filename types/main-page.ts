export interface MainPageResponse {
  userProfileResponseDto: {
    name: string
    imgUrl: string
  }
  petDTO: {
    type: 'DOG' | 'CAT'
    name: string
    modelId: number
    isFarewelled: boolean
    textureUrl: string
    eyeColors: string
    noseColors: string
    feature1: number
    feature2: number
    feature3: number
    tailLength: number
    tailThickness: number
    headFat: number
    headThin: number
    bodyThin: number
    bodyFat: number
  }
  myRoomDto: {
    id: number
    objectDtos: Array<{
      id: number
      size: string
      gridPosition: string
      rotate: string
    }>
  }
  communityResponseDto: {
    id: number
    name: string
    createdAt: string
    author: string
    imgUrl: string
    favoriteCount: number
    isFavorite: boolean
    objectDtos: Array<{
      id: number
      size: string
      gridPosition: string
      rotate: string
    }>
  }
} 