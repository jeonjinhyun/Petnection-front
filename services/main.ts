import apiClient from '@/lib/api-client'
import { MainPageResponse } from '@/types/main-page'

export const mainService = {
  getMainPageData: async (userId: number): Promise<MainPageResponse> => {
    try {
      const response = await apiClient.get(`/main/${userId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch main page data:', error)
      throw error
    }
  }
} 