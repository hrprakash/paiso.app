import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/utils/publicClient';

interface ExternalApiItem {
  id: number;
  index_name: string;
  close: string;
  absolute_change: string;
  percentage_change: string;
  [key: string]: any;
}

interface ExternalApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExternalApiItem[];
}

export async function GET() {
  try {
    // Fetch from external API
    const data = await publicApiClient.Keyget(`/nepse/indices/`) as ExternalApiResponse
    
    // Transform the results array into an object
    const transformedData: { [key: string]: any } = {};
    
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((item: any) => {
        transformedData[item.index_name] = {
          id: item.id,
          index: item.index_name,
          change: parseFloat(item.absolute_change),
          perChange: parseFloat(item.percentage_change),
          currentValue: parseFloat(item.close),
        };
      });
    }
    
    // Return in the format: { sectorsDetails: {...} }
    return NextResponse.json({
      sectorsDetails: transformedData
    });
    
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch indices' },
      { status: 500 }
    );
  }
}