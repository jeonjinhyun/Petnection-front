import apiClient from '@/lib/api-client'

export const goodsService = {
  generateImage: async (userId: number, image: File) => {
    const formData = new FormData()
    formData.append('userId', userId.toString())
    formData.append('image', image)

    const response = await apiClient.post('/goods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getImages: async (userId: number, page = 0) => {
    const response = await apiClient.get(`/goods/${userId}?page=${page}`)
    return response.data
  }
} 