import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://192.168.0.165:3000',
  timeout: 10000, 
})

// 请求拦截器
apiClient.interceptors.request.use(config => {
  // 可以在这里加 token
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

// 响应拦截器
apiClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export default apiClient
