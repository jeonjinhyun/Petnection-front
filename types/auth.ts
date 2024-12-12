export interface LoginRequest {
  email: string
}

export interface LoginResponse {
  id: number
  isNewMember: boolean
}

export interface SignupRequest {
  userCreateRequestDTO: {
    id: number
    name: string
    imgFile: File
  }
  petDto: {
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
} 