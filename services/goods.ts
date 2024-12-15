import apiClient from '@/lib/api-client'
import { GoodsItem, GoodsPage } from '@/types/goods'

export const goodsService = {
  getGoods: async (userId: number, page = 0): Promise<GoodsPage> => {
    const response = await apiClient.get(`/goods/${userId}`, {
      params: { page, size: 10 }
    })
    return response.data
  },

  generateGoods: async (userId: number, image: File): Promise<GoodsItem> => {
    const formData = new FormData()
    formData.append('userId', userId.toString())
    formData.append('image', image)

    const response = await apiClient.post('/goods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
} 