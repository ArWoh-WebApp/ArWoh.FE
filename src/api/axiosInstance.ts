import axios from "axios"

// Instance to use global - using BaseURL from BE API
const API_URL = "https://arwoh.ae-tao-fullstack-api.site/api"
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add interceptor for authentication
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Handle unauthorized
            break
          case 403:
            // Handle forbidden
            break
          case 404:
            // Handle not found
            break
          default:
            // Handle other errors
            break
        }
      }
      return Promise.reject(error)
    },
  )

export default axiosInstance

