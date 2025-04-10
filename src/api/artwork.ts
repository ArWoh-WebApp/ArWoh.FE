/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance"
import type { ApiResponse } from "./apiResponse"

const GET_ARTWORK = "/images"
const GET_RANDOM_ARTWORK = "/images/random"

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
  photographerName?: string
  photographerAvatar?: string
  photographerEmail?: string

  //Optional field
  src?: string
  user?: User
}

export interface ArtworkParams {
  pageIndex?: number
  pageSize?: number
  orientation?: "landscape" | "portrait" | ""
}

export const artworkService = {

  // Get all artworks 
  getArtworks: async (params?: ArtworkParams): Promise<ApiResponse<ArtworkResponse[]>> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()

      if (params?.pageIndex !== undefined) {
        queryParams.append("PageIndex", params.pageIndex.toString())
      }

      if (params?.pageSize !== undefined) {
        queryParams.append("PageSize", params.pageSize.toString())
      }

      if (params?.orientation) {
        // Capitalize first letter for API compatibility
        const formattedOrientation = params.orientation.charAt(0).toUpperCase() + params.orientation.slice(1)
        queryParams.append("orientation", formattedOrientation)
      }

      // Construct URL with query parameters
      const url = queryParams.toString() ? `${GET_ARTWORK}?${queryParams.toString()}` : GET_ARTWORK

      const response = await axiosInstance.get<ApiResponse<ArtworkResponse[]>>(url)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch artworks")
    }
  },

  // Get a random artwork
  getRandomArtwork: async (): Promise<ApiResponse<ArtworkResponse[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<ArtworkResponse[]>>(GET_RANDOM_ARTWORK)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch random artwork")
    }
  },
}
