import apiClient from '@/lib/api-client'
import { Gallery } from '@/types/gallery'

export const galleryService = {
  getGallery: async (userId: number): Promise<Gallery> => {
    const response = await apiClient.get(`/gallery/${userId}`)
    return response.data
  }
} 