import { publicApiClient } from "../utils/publicClient";
import { MarketSummaryStats, MarketDataResponse, IndexData, CompanyList, } from "./types";
import { ApiResponse } from "@/types";
import { StockTableItem } from "./types";

export const summaryApi = {

    marketSummary : async() : Promise<MarketSummaryStats> =>{
        return publicApiClient.get<MarketSummaryStats>("/Summary/")
    },

    marketTable : async() : Promise<MarketDataResponse> =>{
        return publicApiClient.get<MarketDataResponse>("/TradeTurnoverTransactionSubindices/")
    },

subIndices: async (): Promise<ApiResponse<IndexData>> => {
  try {
    const response = await fetch(`/api/subindices`);

    if (!response.ok) {
      throw new Error("Failed to fetch indices");
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.sectorsDetails, // Get sectorsDetails from response
      message: "Indices fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to get indices",
    };
  }
},


todayPrice: async (): Promise<ApiResponse<StockTableItem[]>> => {
  try {
    const response = await fetch(`/api/livemarket`);

    if (!response.ok) {
      throw new Error("Failed to fetch today prices");
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: "Today prices fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to get today prices",
    };
  }
},



companyList: async (): Promise<ApiResponse<CompanyList[]>> => {
  try {
    const response = await fetch(`/api/companylist`);

    if (!response.ok) {
      throw new Error("Failed to fetch  company list");
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: "company list fetched sucessfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to get company list",
    };
  }
},
}

