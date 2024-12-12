export interface GalleryImage {
  id: number
  imgUrl: string
  aiAnalysis: string
}

export interface Gallery {
  id: number
  name: string
  galleryImageResponseDtos: GalleryImage[]
} 