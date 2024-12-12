import apiClient from '@/lib/api-client'
import { Gallery } from '@/types/gallery'

export const galleryService = {
  createGallery: async (formData: FormData) => {
    const response = await apiClient.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getGallery: async (galleryId: number): Promise<Gallery> => {
    const response = await apiClient.get(`/gallery/${galleryId}`)
    return response.data
  },

  updateGallery: async (formData: FormData) => {
    const response = await apiClient.put('/gallery/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
} 