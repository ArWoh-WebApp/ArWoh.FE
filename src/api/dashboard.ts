interface UserSummaryDTO {
    totalUsers: number;
    adminCount: number;
    userCount: number;
    photographerCount: number;
}

interface ImageSummaryDTO {
    totalImages: number;
    imageOrientations: { [key: string]: number };
}

interface RevenueSummaryDTO {
    totalRevenue: number;
    monthlyRevenue: { [key: string]: number };
}

const API_BASE_URL = "http://localhost:9090/api"; 

export const fetchUserSummary = async (): Promise<UserSummaryDTO> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/users/summary`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user summary");
    }

    return response.json();
};

export const fetchImageSummary = async (): Promise<ImageSummaryDTO> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/images/summary`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch image summary");
    }

    return response.json();
};

export const fetchRevenueSummary = async (): Promise<RevenueSummaryDTO> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/revenue/summary`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch revenue summary");
    }

    return response.json();
};