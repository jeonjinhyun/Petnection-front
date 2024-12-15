import apiClient from '@/lib/api-client'
import { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth'

export const authService = {
  login: async (email: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', { email })
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  signup: async (formData: SignupRequest): Promise<boolean> => {
    const response = await apiClient.post('/user/join', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
} 