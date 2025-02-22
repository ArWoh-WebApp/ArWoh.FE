export interface User {
    id: string
    name: string
    avatar: string
    role?: string
}

export interface Artwork {
    id: string
    title: string
    src: string
    orientation: "landscape" | "portrait"
    brief: string
    description: string
    location?: string
    camera?: {
        model?: string
        settings?: string
    }
    uploadDate: string
    tags: string[]
    user: User
}

