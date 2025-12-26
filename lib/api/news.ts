import { ApiResponse } from "@/types";
import { CompanyNewsNAlert, NewsListRequestParams, NewsListResponse } from "./types";

export const showNewsApi = {
  /**
   * Fetch paginated news list
   */
  newsList: async (
    params?: NewsListRequestParams
  ): Promise<ApiResponse<NewsListResponse | null>> => {
    try {
      const queryParams = new URLSearchParams({
        page: String(params?.page || 1),
        page_size: String(params?.page_size || 10),
      });

      // Call Next.js API route (no CORS issues)
      const response = await fetch(`/api/nepse/news?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch news");
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: "News fetched successfully",
      };
    } catch (error: any) {
      console.error("News list failed:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to get news",
      };
    }
  },

  /**
   * Fetch a single news detail by ID
   */
  getNewsById: async (
    id: number
  ): Promise<ApiResponse<CompanyNewsNAlert | null>> => {
    try {
      // Call Next.js API route
      const response = await fetch(`/api/nepse/news/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch news");
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: "News fetched successfully",
      };
    } catch (error: any) {
      console.error("Failed to fetch news:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch news details",
      };
    }
  },
};
