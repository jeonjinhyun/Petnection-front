import apiClient from '@/lib/api-client'
import { CommunityRoom, Post, Comment, GoodsItem } from '@/types/community'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const communityService = {
  // 커뮤니티 룸 관련
  getRecentRooms: async (userId: number, page = 0, keyword?: string): Promise<PageResponse<CommunityRoom>> => {
    const response = await apiClient.get(`/community/search/recent/${userId}`, {
      params: {
        keyword: keyword || '',
        page,
        size: 3
      }
    });
    return response.data;
  },

  getFavoriteRooms: async (userId: number, page = 0, keyword?: string): Promise<PageResponse<CommunityRoom>> => {
    const response = await apiClient.get(`/community/search/favorites/${userId}`, {
      params: {
        keyword: keyword || '',
        page,
        size: 3
      }
    });
    return response.data;
  },

  getMyRooms: async (userId: number, page = 0, keyword?: string): Promise<PageResponse<CommunityRoom>> => {
    const response = await apiClient.get(`/community/search/my/${userId}`, {
      params: {
        keyword: keyword || '',
        page,
        size: 3
      }
    });
    return response.data;
  },

  createRoom: async (formData: FormData) => {
    const response = await apiClient.post('/community', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // 게시글 관련
  getPosts: async (communityRoomId: number, page = 0): Promise<PageResponse<Post>> => {
    const response = await apiClient.get(`/post/${communityRoomId}`, {
      params: {
        page,
        size: 10,
        sort: 'createdAt,desc'
      }
    })
    return response.data
  },

  createPost: async (formData: FormData) => {
    const response = await apiClient.post('/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // 댓글 관련
  getComments: async (postId: number) => {
    const response = await apiClient.get(`/comment/${postId}`)
    return response.data
  },

  createComment: async (data: { author: number, content: string, postId: number }) => {
    const response = await apiClient.post('/comment', data)
    return response.data
  },

  // 즐겨찾기 관련
  addFavorite: async (userId: number, roomId: number): Promise<boolean> => {
    try {
      const response = await apiClient.post(`/favorite/${userId}/${roomId}`)
      return response.data
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  },

  removeFavorite: async (userId: number, roomId: number): Promise<boolean> => {
    try {
      const response = await apiClient.delete(`/favorite/${userId}/${roomId}`)
      return response.data
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      throw error
    }
  }
} 