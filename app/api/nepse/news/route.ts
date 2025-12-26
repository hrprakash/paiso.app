// app/api/nepse/news/route.ts
import { publicApiClient } from '@/lib/utils/publicClient';
import { NextRequest, NextResponse } from 'next/server';
import { publicApiNewsClient } from '@/lib/utils/publicNews';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      page: searchParams.get('page') || '1',
      page_size: searchParams.get('page_size') || '10',
    };

    // This runs on the server, so no CORS issues!
    const data = await publicApiClient.get('/nepse/news/', { params });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || 'Failed to fetch news',
        details: error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}