import axios from 'axios'

const BASE_URL = 'http://125.132.216.190:9100/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  withCredentials: true
})

// 인터셉터 설정
apiClient.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = 'http://125.132.216.190:9151'
  config.headers['Access-Control-Allow-Credentials'] = 'true'
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 에러 인터셉터 단순화
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    })
    return Promise.reject(error)
  }
)

export default apiClient 