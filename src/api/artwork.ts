import axiosInstance from "./axiosInstance"

const GET_ARTWORK = "/images"

export interface ArtworkResponse {
  id: number
  title: string
  description: string
  price: number
  storyOfArt: string
  orientation: string
  tags: string[]
  location: string
  fileName: string
  url: string
}

export interface ApiResponse<T> {
  isSuccess: boolean
  message: string
  data: T
}

export const artworkService = {
  getArtworks: async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<ArtworkResponse[]>>(GET_ARTWORK)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch artworks")
    }
  },
}

