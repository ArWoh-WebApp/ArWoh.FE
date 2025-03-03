/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance"

const GET_ARTWORK = "/images"

export interface User {
  id: string
  name: string
  role: string
}

export interface ArtworkResponse {
  id: number
  photographerId: number
  title: string
  description: string
  price: number
  storyOfArt: string
  orientation: "landscape" | "portrait"
  tags: string[]
  location: string
  fileName: string
  url: string
  src?: string // Optional since it will be mapped from url
  user?: User // Optional since it will be created from photographerId
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

