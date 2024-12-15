export interface GoodsItem {
  id: number
  originalImageUrl: string
  generatedImageUrl: string
}

export interface GoodsPage {
  content: GoodsItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
} 